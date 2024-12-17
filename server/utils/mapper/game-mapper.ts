// Types from your original interfaces

import type {ActiveGame, Game, GameRound, Song, GameStatus, GameStats} from "~/types/api/game";
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

    // Player info
    player_user_id: string;
    player_avatar_url: string | null;
    player_username: string;
    player_spotify_id: string | null;
    player_spotify_visibility: boolean;
    player_daily_streak: number | null;
    player_daily_streak_updated_at: string | null;
    player_score: number;

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

    // Player round stats
    time_to_guess: number | null;
    correct_guess: boolean | null;
    guessed_song_id: string | null;
    guessed_song_name: string | null;
    guessed_song_artist: string | null;
    guessed_song_preview_url: string | null;
}

export interface GetGameDBRow {
    game_id: number;
    status: GameStatus;
    playlist_id: string;
    created_at: string;
    player_id: string;
    is_creator: boolean;
    has_played: boolean;
    round_number: number;
    correct_song_id: string;
}

interface GameDBPlayer {
    player_id: string;
    is_creator: boolean;
    has_played: boolean;
    score?: number;
}

interface GameDBRound {
    round_number: number;
    correct_song_id: string;
    time_to_guess?: number;
    correct_guess?: boolean;
    guess?: string;
}

export interface GameDB {
    game_id: number;
    status: GameStatus;
    playlist_id: string;
    created_at: string;
    players: GameDBPlayer[];
    rounds: GameDBRound[];
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

    // Group all players from rows
    const playersMap = new Map<string, GetUserResponse>();

    rows.forEach(row => {
        const playerId = row.player_user_id;
        if (!playersMap.has(playerId)) {
            playersMap.set(playerId, {
                id: row.player_user_id,
                avatar_url: row.player_avatar_url ?? undefined,
                username: row.player_username,
                spotify_id: row.player_spotify_id ?? undefined,
                spotify_visibility: row.player_spotify_visibility,
                daily_streak: row.player_daily_streak ?? undefined,
                daily_streak_updated_at: row.player_daily_streak_updated_at ?? undefined
            });
        }
    });

    // Map rounds
    const uniqueRounds = new Map<number, GameRound>();
    rows.forEach(row => {
        if (!uniqueRounds.has(row.round_number)) {
            uniqueRounds.set(row.round_number, {
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
            });
        }
    });

    // Map stats
    const stats: GameStats[] = [];
    const statsMap = new Map<string, GameStats>();

    rows.forEach(row => {
        if (!statsMap.has(row.player_user_id)) {
            statsMap.set(row.player_user_id, {
                user_id: row.player_user_id,
                score: row.player_score,
                guesses: []
            });
        }

        const playerStats = statsMap.get(row.player_user_id)!;

        // Only add guess if we have stats data for this round
        if (row.time_to_guess !== null) {
            playerStats.guesses.push({
                round_number: row.round_number,
                time_to_guess: row.time_to_guess,
                correct_guess: row.correct_guess!,
                song: createSongFromRow(
                    row.guessed_song_id!,
                    row.guessed_song_name!,
                    row.guessed_song_artist!,
                    row.guessed_song_preview_url
                )
            });
        }
    });

    // Add all stats to the array
    stats.push(...Array.from(statsMap.values()));

    return {
        game_id: firstRow.game_id,
        status: firstRow.status as GameStatus,
        creator_id: firstRow.creator_id,
        playlist: {
            id: firstRow.playlist_id,
            name: firstRow.playlist_name,
            cover: firstRow.playlist_cover
        },
        players: Array.from(playersMap.values()),
        rounds: Array.from(uniqueRounds.values()),
        created_at: firstRow.created_at,
        stats: stats.length > 0 ? stats : undefined
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

export function mapGameRows(rows: GetGameDBRow[]): GameDB {
    const firstRow = rows[0];

    return {
        game_id: firstRow.game_id,
        status: firstRow.status,
        playlist_id: firstRow.playlist_id,
        created_at: firstRow.created_at,
        players: [...new Set(rows.map(row => row.player_id))].map(playerId => ({
            player_id: playerId,
            is_creator: rows.find(r => r.player_id === playerId)!.is_creator,
            has_played: rows.find(r => r.player_id === playerId)!.has_played
        })),
        rounds: [...new Set(rows.map(row => row.round_number))].map(roundNum => ({
            round_number: roundNum,
            correct_song_id: rows.find(r => r.round_number === roundNum)!.correct_song_id
        }))
    };
}