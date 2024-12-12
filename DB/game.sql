DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'game_status') THEN
            CREATE TYPE game_status AS ENUM ('playing', 'finished');
        END IF;
    END
$$;


DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'game_song_input') THEN
            CREATE TYPE game_song_input AS
            (
                spotify_song_id TEXT,
                wrong_option_1  TEXT,
                wrong_option_2  TEXT,
                wrong_option_3  TEXT
            );
        END IF;
    END
$$;

-- Games
CREATE TABLE IF NOT EXISTS games
(
    game_id     SERIAL PRIMARY KEY,
    playlist_id TEXT                     NOT NULL REFERENCES playlists (id) ON DELETE CASCADE,
    status      game_status              NOT NULL DEFAULT 'playing',
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Players of each game and their scores
CREATE TABLE IF NOT EXISTS game_players
(
    game_id    INTEGER REFERENCES games (game_id) ON DELETE CASCADE,
    user_id    UUID REFERENCES users (id),
    score      INTEGER NOT NULL DEFAULT 0,
    is_creator BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (game_id, user_id)
);
-- Index for ensuring only one creator per game or none
CREATE UNIQUE INDEX one_creator_per_game ON game_players (game_id) WHERE is_creator = true;
-- Index for finding players in a game
CREATE INDEX idx_game_players_player_id ON game_players (user_id);
-- Index for finding high scores by user
CREATE INDEX idx_game_players_score ON game_players (user_id, score DESC);

-- Songs
-- mostly for reference after the game is over since we always fetch songs from Spotify
CREATE TABLE IF NOT EXISTS songs
(
    spotify_song_id TEXT PRIMARY KEY,
    song_name       TEXT NOT NULL,
    artist_name     TEXT NOT NULL,
    preview_url     TEXT
);

-- Songs in each game
CREATE TABLE IF NOT EXISTS game_rounds
(
    game_id        INTEGER REFERENCES games (game_id) ON DELETE CASCADE,
    song_order     INTEGER NOT NULL,
    song_id        TEXT    NOT NULL,
    wrong_option_1 TEXT    NOT NULL,
    wrong_option_2 TEXT    NOT NULL,
    wrong_option_3 TEXT    NOT NULL,
    PRIMARY KEY (game_id, song_order),

    CONSTRAINT fk_spotify_song_id FOREIGN KEY (song_id) REFERENCES songs (spotify_song_id),
    CONSTRAINT fk_wrong_option_1 FOREIGN KEY (wrong_option_1) REFERENCES songs (spotify_song_id),
    CONSTRAINT fk_wrong_option_2 FOREIGN KEY (wrong_option_2) REFERENCES songs (spotify_song_id),
    CONSTRAINT fk_wrong_option_3 FOREIGN KEY (wrong_option_3) REFERENCES songs (spotify_song_id)
);

-- Statistics for each song of each game for each user
CREATE TABLE IF NOT EXISTS game_player_song_stats
(
    game_id         INTEGER REFERENCES games (game_id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users (id),
    song_order      INTEGER NOT NULL,
    time_to_guess   INTEGER,
    correct_guess   BOOLEAN NOT NULL DEFAULT false,
    guessed_song_id TEXT,
    PRIMARY KEY (game_id, user_id, song_order),
    FOREIGN KEY (game_id, song_order) REFERENCES game_rounds (game_id, song_order)
);

CREATE INDEX idx_game_player_song_stats_game_user ON game_player_song_stats (game_id, user_id);

--- Functions

-- Initialize a game with a playlist and players
CREATE OR REPLACE FUNCTION init_game(
    playlist_id_input TEXT,
    player_ids UUID[],
    song_data game_song_input[]
)
    RETURNS TABLE
            (
                game_id    INTEGER,
                created_at TIMESTAMP WITH TIME ZONE
            )
AS
$$
DECLARE
    new_game_id    INTEGER;
    new_created_at TIMESTAMP WITH TIME ZONE;
    player_id      UUID;
BEGIN
    -- Create game
    INSERT INTO games (playlist_id, status)
    VALUES (playlist_id_input, 'playing')
    RETURNING games.game_id, games.created_at INTO new_game_id, new_created_at;

    -- Add all players from array
    FOREACH player_id IN ARRAY player_ids
        LOOP
            INSERT INTO game_players (game_id, user_id, score)
            VALUES (new_game_id, player_id, 0);
        END LOOP;

    UPDATE game_players
    SET is_creator = true
    WHERE game_players.game_id = new_game_id
      AND game_players.user_id = player_ids[1];

    -- Insert songs (assuming the songs already exist in the songs table)
    INSERT INTO game_rounds (game_id,
                             song_order,
                             song_id,
                             wrong_option_1,
                             wrong_option_2,
                             wrong_option_3)
    SELECT new_game_id,
           row_number() OVER (ORDER BY song.spotify_song_id), -- Added ORDER BY
           song.spotify_song_id,
           song.wrong_option_1,
           song.wrong_option_2,
           song.wrong_option_3
    FROM unnest(song_data) song;

    RETURN QUERY
        SELECT new_game_id AS game_id, new_created_at AS created_at;

END;
$$ LANGUAGE plpgsql;

-- Get all games for a user
CREATE OR REPLACE FUNCTION get_player_games(p_user_id UUID)
    RETURNS TABLE
            (
                -- Game basic info
                game_id                          INTEGER,
                status                           game_status,
                playlist_id                      TEXT,
                playlist_cover                   TEXT,
                playlist_name                    TEXT,
                created_at                       TIMESTAMPTZ,
                creator_id                       UUID,
                -- Opponent info (renamed from player_ to opponent_)
                opponent_user_id                 UUID,
                opponent_avatar_url              TEXT,
                opponent_username                TEXT,
                opponent_spotify_id              TEXT,
                opponent_spotify_visibility      BOOLEAN,
                opponent_daily_streak            INTEGER,
                opponent_daily_streak_updated_at TIMESTAMPTZ,
                -- Round info
                round_number                     INTEGER,
                correct_song_id                  TEXT,
                correct_song_name                TEXT,
                correct_song_artist              TEXT,
                correct_song_preview_url         TEXT,
                wrong_song_1_id                  TEXT,
                wrong_song_1_name                TEXT,
                wrong_song_1_artist              TEXT,
                wrong_song_1_preview_url         TEXT,
                wrong_song_2_id                  TEXT,
                wrong_song_2_name                TEXT,
                wrong_song_2_artist              TEXT,
                wrong_song_2_preview_url         TEXT,
                wrong_song_3_id                  TEXT,
                wrong_song_3_name                TEXT,
                wrong_song_3_artist              TEXT,
                wrong_song_3_preview_url         TEXT
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT g.game_id,
               g.status,
               g.playlist_id,
               p.cover,
               p.name,
               g.created_at,
               gp_creator.user_id,

               -- Opponent information
               u.id,
               u.avatar_url,
               u.username,
               u.spotify_id,
               u.spotify_visibility,
               u.daily_streak,
               u.daily_streak_updated_at,
               -- Round information
               gr.song_order,
               cs.spotify_song_id,
               cs.song_name,
               cs.artist_name,
               cs.preview_url,
               w1.spotify_song_id,
               w1.song_name,
               w1.artist_name,
               w1.preview_url,
               w2.spotify_song_id,
               w2.song_name,
               w2.artist_name,
               w2.preview_url,
               w3.spotify_song_id,
               w3.song_name,
               w3.artist_name,
               w3.preview_url
        FROM games g
                 -- Join to get current user's games
                 JOIN game_players gp_current ON g.game_id = gp_current.game_id AND gp_current.user_id = p_user_id
            -- Join to get opponent's info
                 JOIN game_players gp_opponent ON g.game_id = gp_opponent.game_id AND gp_opponent.user_id != p_user_id
                 LEFT JOIN game_players gp_creator ON g.game_id = gp_creator.game_id AND gp_creator.is_creator = true
                 JOIN users u ON gp_opponent.user_id = u.id
                 JOIN game_rounds gr ON g.game_id = gr.game_id
                 JOIN songs cs ON gr.song_id = cs.spotify_song_id
                 JOIN songs w1 ON gr.wrong_option_1 = w1.spotify_song_id
                 JOIN songs w2 ON gr.wrong_option_2 = w2.spotify_song_id
                 JOIN songs w3 ON gr.wrong_option_3 = w3.spotify_song_id
                 JOIN playlists p ON g.playlist_id = p.id
        ORDER BY g.created_at DESC, gr.song_order ASC;
END;
$$ LANGUAGE plpgsql;