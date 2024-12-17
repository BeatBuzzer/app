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
    time_to_guess   NUMERIC,
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

    -- Insert songs with preserved order
    INSERT INTO game_rounds (game_id,
                             song_order,
                             song_id,
                             wrong_option_1,
                             wrong_option_2,
                             wrong_option_3)
    SELECT new_game_id,
           ordinality, -- This preserves the array order
           song.spotify_song_id,
           song.wrong_option_1,
           song.wrong_option_2,
           song.wrong_option_3
    FROM unnest(song_data) WITH ORDINALITY as song;

    -- Return the new game info
    RETURN QUERY
        SELECT new_game_id, new_created_at;
END;
$$ LANGUAGE plpgsql;

-- Get all games for a user
CREATE OR REPLACE FUNCTION get_player_games(p_user_id UUID)
    RETURNS TABLE
            (
                -- Game basic info
                game_id              INTEGER,
                status              game_status,
                playlist_id         TEXT,
                playlist_cover      TEXT,
                playlist_name       TEXT,
                created_at         TIMESTAMPTZ,
                creator_id         UUID,

                -- Player info
                player_user_id     UUID,
                player_avatar_url  TEXT,
                player_username    TEXT,
                player_spotify_id  TEXT,
                player_spotify_visibility BOOLEAN,
                player_daily_streak INTEGER,
                player_daily_streak_updated_at TIMESTAMPTZ,
                player_score       INTEGER,

                -- Round info
                round_number       INTEGER,
                correct_song_id    TEXT,
                correct_song_name  TEXT,
                correct_song_artist TEXT,
                correct_song_preview_url TEXT,
                wrong_song_1_id    TEXT,
                wrong_song_1_name  TEXT,
                wrong_song_1_artist TEXT,
                wrong_song_1_preview_url TEXT,
                wrong_song_2_id    TEXT,
                wrong_song_2_name  TEXT,
                wrong_song_2_artist TEXT,
                wrong_song_2_preview_url TEXT,
                wrong_song_3_id    TEXT,
                wrong_song_3_name  TEXT,
                wrong_song_3_artist TEXT,
                wrong_song_3_preview_url TEXT,

                -- Round stats (directly associated with player)
                time_to_guess      NUMERIC,
                correct_guess      BOOLEAN,
                guessed_song_id    TEXT,
                guessed_song_name  TEXT,
                guessed_song_artist TEXT,
                guessed_song_preview_url TEXT
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT DISTINCT ON (g.game_id, gr.song_order, all_players.user_id)
            g.game_id,
            g.status,
            g.playlist_id,
            p.cover,
            p.name,
            g.created_at,
            gp_creator.user_id,
            -- Player information
            all_players.user_id,
            u.avatar_url,
            u.username,
            u.spotify_id,
            u.spotify_visibility,
            u.daily_streak,
            u.daily_streak_updated_at,
            gp_stats.score,
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
            w3.preview_url,
            -- Stats information (associated with player)
            gpss.time_to_guess,
            gpss.correct_guess,
            gs.spotify_song_id,
            gs.song_name,
            gs.artist_name,
            gs.preview_url
        FROM games g
                 -- Get current player's games
                 JOIN game_players gp_current ON g.game_id = gp_current.game_id
            AND gp_current.user_id = p_user_id
            -- Get all players in the game
                 JOIN game_players all_players ON g.game_id = all_players.game_id
            -- Get user info for all players
                 JOIN users u ON all_players.user_id = u.id
            -- Get creator info
                 LEFT JOIN game_players gp_creator ON g.game_id = gp_creator.game_id
            AND gp_creator.is_creator = true
            -- Get rounds info
                 JOIN game_rounds gr ON g.game_id = gr.game_id
                 JOIN songs cs ON gr.song_id = cs.spotify_song_id
                 JOIN songs w1 ON gr.wrong_option_1 = w1.spotify_song_id
                 JOIN songs w2 ON gr.wrong_option_2 = w2.spotify_song_id
                 JOIN songs w3 ON gr.wrong_option_3 = w3.spotify_song_id
                 JOIN playlists p ON g.playlist_id = p.id
            -- Get stats for all players
                 LEFT JOIN game_players gp_stats ON g.game_id = gp_stats.game_id
            AND gp_stats.user_id = all_players.user_id
                 LEFT JOIN game_player_song_stats gpss ON g.game_id = gpss.game_id
            AND gpss.song_order = gr.song_order
            AND gpss.user_id = all_players.user_id
                 LEFT JOIN songs gs ON gpss.guessed_song_id = gs.spotify_song_id
        ORDER BY g.game_id, gr.song_order, all_players.user_id, g.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Get a game by its ID
-- Returns multiple rows, one for each player in the game
CREATE OR REPLACE FUNCTION get_game(p_game_id INTEGER)
    RETURNS TABLE
            (
                -- Game info
                game_id         INTEGER,
                status          game_status,
                playlist_id     TEXT,
                created_at      TIMESTAMPTZ,
                -- Players array
                player_id       UUID,
                is_creator      BOOLEAN,
                has_played      BOOLEAN,
                -- Round info
                round_number    INTEGER,
                correct_song_id TEXT
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT g.game_id,
               g.status,
               g.playlist_id,
               g.created_at,
               gp.user_id,
               gp.is_creator,
               EXISTS(SELECT 1
                      FROM game_player_song_stats gpss
                      WHERE gpss.game_id = g.game_id
                        AND gpss.user_id = gp.user_id) AS has_played,
               gr.song_order,
               gr.song_id                              as correct_song_id
        FROM games g
                 -- Join to get all players
                 JOIN game_players gp
                      ON g.game_id = gp.game_id
            -- Join to get rounds
                 JOIN game_rounds gr
                      ON g.game_id = gr.game_id
        WHERE g.game_id = p_game_id
        ORDER BY gr.song_order;
END;
$$ LANGUAGE plpgsql;

-- A player finished his rounds
CREATE OR REPLACE FUNCTION game_handle_player_finish(
    p_game_id INTEGER,
    p_user_id UUID,
    p_song_orders INTEGER[],
    p_times_to_guess NUMERIC[],
    p_correct_guesses BOOLEAN[],
    p_guessed_song_ids TEXT[],
    p_score INTEGER
) RETURNS VOID AS
$$
DECLARE
    i INTEGER;
BEGIN
    -- Insert all stats
    FOR i IN 1..array_length(p_song_orders, 1)
        LOOP
            INSERT INTO game_player_song_stats (game_id,
                                                user_id,
                                                song_order,
                                                time_to_guess,
                                                correct_guess,
                                                guessed_song_id)
            VALUES (p_game_id,
                    p_user_id,
                    p_song_orders[i],
                    p_times_to_guess[i],
                    p_correct_guesses[i],
                    p_guessed_song_ids[i]);
        END LOOP;

    -- Update player's score with provided score
    UPDATE game_players
    SET score = p_score
    WHERE game_id = p_game_id
      AND user_id = p_user_id;

    -- Check if all players have finished and update game status if needed
    UPDATE games
    SET status = 'finished'
    WHERE game_id = p_game_id
      AND NOT EXISTS (SELECT 1
                      FROM game_players gp
                               LEFT JOIN (SELECT DISTINCT user_id
                                          FROM game_player_song_stats
                                          WHERE game_id = p_game_id) gpss ON gp.user_id = gpss.user_id
                      WHERE gp.game_id = p_game_id
                        AND gpss.user_id IS NULL);
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM get_player_games('d2e6a9a3-a0be-45ce-ae39-676c6a88c53a');