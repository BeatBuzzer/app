import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";
import {z} from "zod";
import {GameStatus} from "~/types/api/game";
import type {PostgrestError} from "@supabase/postgrest-js";
import type {GameDB, GetGameDBRow} from "~/server/utils/mapper/game-mapper";
import {mapGameRows} from "~/server/utils/mapper/game-mapper";

const PlayGameSchema = z.object({
    round: z.number(),
    guess: z.string().regex(spotifyIDRegex, {message: 'Invalid Spotify ID'}),
    time: z.number()
}).readonly()


function calculateScore(time_to_guess: number): number {
    return Math.floor((15 - time_to_guess) * 9.81);
}

export default defineEventHandler(async (event) => {
    const gameId = getRouterParam(event, 'uid');

    // validate game id
    if (!gameId) {
        setResponseStatus(event, 400);
        return {error: 'Invalid game id'};
    }

    // validate post-request body
    const body = await readValidatedBody(event, body => PlayGameSchema.safeParse(body));
    if (!body.success) {
        setResponseStatus(event, 400);
        return {error: body.error.issues};
    }

    // Require user to be authenticated
    const user = await serverSupabaseUser(event);
    if (!user?.id) {
        setResponseStatus(event, 401);
        return {error: 'unauthenticated'};
    }

    let game = await useStorage<GameDB>().getItem('game:' + gameId);
    const client = serverSupabaseServiceRole(event);

    // Get game from database if not present in memory
    if (!game) {
        const {data: rows, error: getGameError}: {
            data: GetGameDBRow[] | null,
            error: PostgrestError | null
        } = await client.rpc('get_game', {p_game_id: gameId} as never).select();

        if (getGameError) {
            setResponseStatus(event, 500);
            return {error: 'Internal server error'};
        }

        if (!rows) {
            setResponseStatus(event, 404);
            return {error: 'Game not found'};
        }

        game = mapGameRows(rows);

        // Save game to memory
        useStorage().setItem('game:' + gameId, game).then(() => console.debug('Added game to memory:' + gameId));
    }

    if (!game) {
        setResponseStatus(event, 500);
        return {error: 'Game not found in memory'};
    }

    // Check if game is still active
    if (game.status !== GameStatus.PLAYING) {
        setResponseStatus(event, 400);
        return {error: 'Game is not active'};
    }

    // Check if player is part of the game
    if (!game.players.some(player => player.player_id === user.id)) {
        setResponseStatus(event, 400);
        return {error: 'Player not part of the game'};
    }

    // Check if round is valid
    if (game.rounds.length < body.data.round) {
        setResponseStatus(event, 400);
        return {error: 'Invalid round'};
    }

    // Handle rounds
    const round = game.rounds[body.data.round - 1];
    const player = game.players.find(player => player.player_id === user.id);

    // Check if round has already been played by player
    if(game.rounds.some(round => round.round_number === body.data.round && round.time_to_guess) || player?.has_played) {
        setResponseStatus(event, 400);
        return {error: 'Round has already been played'};
    }

    if (round.correct_song_id === body.data.guess) {
        round.correct_guess = true;
        round.guess = body.data.guess;
        round.time_to_guess = body.data.time;

        const reward = calculateScore(body.data.time);

        if (player && player.score) {
            player.score += reward;
        } else player!.score = reward;

    } else {
        round.correct_guess = false;
        round.guess = body.data.guess;
        round.time_to_guess = body.data.time;

        if (!player!.score) {
            player!.score = 0;
        }
    }

    // Update game in memory
    useStorage().setItem('game:' + gameId, game).then(() => console.debug('Updated game in memory:' + gameId));

    // Handle Last round has been played
    if (game.rounds.length === body.data.round) {

        // persist game to database
        const params = {
            p_game_id: gameId,
            p_user_id: user.id,
            p_song_orders: game.rounds.map(round => round.round_number),
            p_times_to_guess: game.rounds.map(round => round.time_to_guess),
            p_correct_guesses: game.rounds.map(round => round.correct_guess),
            p_guessed_song_ids: game.rounds.map(round => round.guess),
            p_score: game.players.find(player => player.player_id === user.id)?.score
        };
        const {error} = await client.rpc('handle_player_finish', params as never);

        if (error) {
            setResponseStatus(event, 500);
            return {error: 'Internal server error'};
        }

        // asynchronously remove game from memory. No await!
        useStorage().removeItem('game:' + gameId).then(() => console.debug('Removed game from memory:' + gameId));
    }

    return {correct_guess: round.correct_guess, score: player!.score, was_last_round: game.rounds.length === body.data.round};

});
