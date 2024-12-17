import type {GetUserResponse} from "@/types/api/users";

export interface SpotifySong {
    track: Song;
}

export interface Song {
    id: string;
    name: string;
    artists: SongArtist[];
    preview_url?: string | null;
    is_playable: boolean;
}

interface SongArtist {
    name: string;
}

export interface GameRound {
    round: number;
    correct_song: Song;
    wrong_songs: Song[];
}

export interface Game {
    game_id: number;
    status: GameStatus;
    creator_id: string; // who created the game and thus already played its turn
    playlist: {
        id: string;
        name: string;
        cover?: string;
    };
    players: GetUserResponse[];
    rounds: GameRound[];
    created_at: string;
    stats?: GameStats[];
}

export interface ActiveGame {
    game_id: number;
    status: GameStatus;
    creator_id: string; // who created the game and thus already played its turn
    playlist: ActiveGamePlaylist;
    players: GetUserResponse[];
    rounds: ActiveGameRound[];
}

export interface ActiveGamePlaylist {
    id: string;
    name: string;
    cover?: string;
}

export interface ActiveGameRound {
    round: number;
    preview_url: string;
    options: Song[];
}

export enum GameStatus {
    PLAYING = 'playing',
    FINISHED = 'finished'
}

export interface GameStats {
    user_id: string;
    score: number;
    guesses: GameStatsContent[];
}

export interface GameStatsContent {
    round_number: number;
    song: Song;
    time_to_guess: number;
    correct_guess: boolean;
}

export interface GameInitResponse {
    game_id: number,
    new_created_at: string
}

// Requests
export interface GameInitRequest {
    playlist_id: string;
    opponent_id: string;
}

export interface GetGameResponse {
    active: ActiveGame[];
    waiting: Game[];
    past: Game[];
}

export interface PlayGameRequest {
    round: number;
    guess: string;
    time: number;
}

export interface PlayGameResponse {
    correct_guess: boolean;
    score: number;
    was_last_round: boolean;
}