create table playlists
(
    id          text                  not null primary key,
    "spotifyId" text                  not null,
    name        text                  not null,
    cover       text,
    enabled     boolean default false not null
);

CREATE UNIQUE INDEX enabled_playlist_unique_name ON playlists (name) WHERE enabled = true;

create table categories
(
    name         text not null,
    "playlistId" text not null references playlists,
    primary key (name, "playlistId")
);
