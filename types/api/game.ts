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
    id: string;
    name: string;
}

export interface GameRound {
    round: number;
    correct_song: Song;
    wrong_songs: Song[];
}

export interface Game {
    game_id: number;
    playlist_id: string;
    player_ids: string[];
    songs: GameRound[];
    created_at: string;
    stats?: GameStats[];
}

export interface GameStats {
    user_id: string;
    score: number;
    guesses: GameStatsContent[];
}

export interface GameStatsContent {
    song_order: number;
    song: Song;
    time_to_guess: number;
    correct_guess: boolean;
}

export interface GameInitResponse {
    rounds: {
        round: number;
        preview_url: string;
        options: Song[];
    }
}

// Requests
export interface GameInitRequest {
    playlist_id: string;
    opponent_id: string;
}