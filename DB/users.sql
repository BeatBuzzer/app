CREATE TABLE users
(
    id                      uuid                     not null references auth.users on delete cascade,
    avatar_url              text,
    username                text                     not null,
    spotify_id              text                     not null,
    spotify_visibility      boolean                  not null default false,
    created_at              timestamp with time zone          default now(),
    daily_streak            integer                  not null default 0,
    daily_streak_updated_at timestamp with time zone not null default now(),
    primary key (id)
);

ALTER TABLE users
    ADD CONSTRAINT unique_username UNIQUE (username),
    ADD CONSTRAINT valid_username check (username <> '' AND length(trim(username)) >= 4 AND
                                         username ~ '^[a-zA-Z0-9_]+$');
                                         
CREATE INDEX idx_username ON users(username);

CREATE OR REPLACE FUNCTION get_profile_information(userId UUID)
    RETURNS RECORD
AS
$$
DECLARE
    result RECORD;
BEGIN
    SELECT u.id                 AS user_id,
           u.avatar_url         AS user_avatar,
           u.username           AS username,
           u.spotify_id         AS user_spotify_id,
           u.spotify_visibility AS spotify_visibility
    INTO result
    FROM users u
    WHERE u.id = userId;

    RETURN result;
END;
$$ LANGUAGE plpgsql;