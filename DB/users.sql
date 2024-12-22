CREATE TABLE users
(
    id                      uuid                     not null references auth.users on delete cascade,
    avatar_url              text,
    username                text                     not null,
    spotify_id              text                     not null,
    spotify_visibility      boolean                  not null default false,
    created_at              timestamp with time zone          default now(),
    daily_streak            integer                  not null default 0,
    daily_streak_updated_at timestamp with time zone not null default now()-interval '1 day',
    primary key (id)
);

ALTER TABLE users
    ADD CONSTRAINT unique_username UNIQUE (username),
    ADD CONSTRAINT valid_username check (username <> '' AND length(trim(username)) >= 4 AND
                                         username ~ '^[a-zA-Z0-9_]+$');

CREATE INDEX idx_username ON users (username);

-- automatically update daily_streak_updated_at timestamp
CREATE OR REPLACE FUNCTION user_update_streak_updated_at_column()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.daily_streak_updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_daily_streak_timestamp
    BEFORE UPDATE
    ON users
    FOR EACH ROW
EXECUTE FUNCTION user_update_streak_updated_at_column();

--
INSERT INTO users (id, username, spotify_id, spotify_visibility)
VALUES ('00000000-0000-0000-0000-000000000000', 'delete_user', '', false);