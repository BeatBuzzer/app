CREATE TABLE users
(
    id                 uuid    not null references auth.users on delete cascade,
    avatar_url         text,
    username           text    not null,
    spotify_id         text    not null,
    spotify_visibility boolean not null default false,
    primary key (id)
);

ALTER TABLE users
    ADD CONSTRAINT unique_username UNIQUE (username),
    ADD CONSTRAINT valid_username check (username <> '' AND length(trim(username)) >= 4 AND username ~ '^[a-zA-Z0-9_]+$');

CREATE INDEX idx_username ON users(username);