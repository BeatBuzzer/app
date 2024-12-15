// Types from your original interfaces

import type {ActiveGame, Game, GameRound, Song} from "~/types/api/game";
import {GameStatus} from "~/types/api/game";
import type {GetUserResponse} from "~/types/api/users";

interface DatabaseGameRow {
    // Game basic info
    game_id: number;
    status: string;
    playlist_id: string;
    playlist_cover: string;
    playlist_name: string;
    created_at: string;
    creator_id: string; // who created the game and thus already started playing

    // Opponent info (the other player's data)
    opponent_user_id: string;
    opponent_avatar_url: string | null;
    opponent_username: string;
    opponent_spotify_id: string | null;
    opponent_spotify_visibility: boolean;
    opponent_daily_streak: number | null;
    opponent_daily_streak_updated_at: string | null;

    // Round info (the song being played)
    round_number: number;         // From game_rounds table - the order of the song
    correct_song_id: string;
    correct_song_name: string;
    correct_song_artist: string;
    correct_song_preview_url: string | null;

    // Wrong options (the 3 incorrect choices)
    wrong_song_1_id: string;
    wrong_song_1_name: string;
    wrong_song_1_artist: string;
    wrong_song_1_preview_url: string | null;

    wrong_song_2_id: string;      // Similar to wrong_song_1
    wrong_song_2_name: string;
    wrong_song_2_artist: string;
    wrong_song_2_preview_url: string | null;

    wrong_song_3_id: string;      // Similar to wrong_song_1
    wrong_song_3_name: string;
    wrong_song_3_artist: string;
    wrong_song_3_preview_url: string | null;
}

const createSongFromRow = (
    id: string,
    name: string,
    artist: string,
    previewUrl: string | null
): Song => ({
    id,
    name,
    artists: [{
        name: artist
    }],
    preview_url: previewUrl,
    is_playable: previewUrl !== null
});


export const mapDatabaseRowsToGame = (rows: DatabaseGameRow[]): Game => {
    if (rows.length === 0) {
        throw new Error('No rows provided to map to Game');
    }

    const firstRow = rows[0];

    // Map opponent info
    const opponent: GetUserResponse = {
        id: firstRow.opponent_user_id,
        avatar_url: firstRow.opponent_avatar_url ?? undefined,
        username: firstRow.opponent_username,
        spotify_id: firstRow.opponent_spotify_id ?? undefined,
        spotify_visibility: firstRow.opponent_spotify_visibility,
        daily_streak: firstRow.opponent_daily_streak ?? undefined,
        daily_streak_updated_at: firstRow.opponent_daily_streak_updated_at ?? undefined
    };

    // Map rounds
    const rounds: GameRound[] = rows.map(row => ({
        round: row.round_number,
        correct_song: createSongFromRow(
            row.correct_song_id,
            row.correct_song_name,
            row.correct_song_artist,
            row.correct_song_preview_url
        ),
        wrong_songs: [
            createSongFromRow(
                row.wrong_song_1_id,
                row.wrong_song_1_name,
                row.wrong_song_1_artist,
                row.wrong_song_1_preview_url
            ),
            createSongFromRow(
                row.wrong_song_2_id,
                row.wrong_song_2_name,
                row.wrong_song_2_artist,
                row.wrong_song_2_preview_url
            ),
            createSongFromRow(
                row.wrong_song_3_id,
                row.wrong_song_3_name,
                row.wrong_song_3_artist,
                row.wrong_song_3_preview_url
            )
        ]
    }));

    // Construct final game object with players instead of player_ids
    return {
        game_id: firstRow.game_id,
        status: firstRow.status as GameStatus,
        creator_id: firstRow.creator_id,
        playlist: {
            id: firstRow.playlist_id,
            name: firstRow.playlist_name,
            cover: firstRow.playlist_cover
        },
        players: [opponent],
        rounds: rounds,
        created_at: firstRow.created_at
    };
};

export const mapDatabaseRowsToGames = (rows: DatabaseGameRow[]): Game[] => {
    if (rows.length === 0) return [];

    // Group rows by game_id
    const gameRows = new Map<number, DatabaseGameRow[]>();
    rows.forEach(row => {
        const currentRows = gameRows.get(row.game_id) ?? [];
        gameRows.set(row.game_id, [...currentRows, row]);
    });

    // Map each group of rows to a Game
    return Array.from(gameRows.values())
        .map(gameRows => mapDatabaseRowsToGame(gameRows));
};

export const mapGameToActiveGame = (game: Game): ActiveGame => {
    const mappedRounds = game.rounds.map((round) => ({
        round: round.round,
        preview_url: round.correct_song.preview_url!,
        options: [round.correct_song, ...round.wrong_songs].map(option => {
            // Remove preview URL from all options to not identify the correct one
            option.preview_url = null;
            return option;
        }).sort(() => Math.random() - 0.5)
    }));

    return {
        game_id: game.game_id,
        status: game.status,
        creator_id: game.creator_id,
        playlist: game.playlist,
        players: game.players,
        rounds: mappedRounds
    };
}