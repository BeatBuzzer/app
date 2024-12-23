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
    "playlistId" text not null references playlists (id) on delete cascade,
    primary key (name, "playlistId")
);

-- Get random playlist
CREATE OR REPLACE FUNCTION get_random_playlist()
    RETURNS TABLE (
                      id text,
                      "spotifyId" text,
                      name text,
                      cover text
                  ) AS $$
BEGIN
    RETURN QUERY
        SELECT
            p.id,
            p."spotifyId",
            p.name,
            p.cover
        FROM playlists p
        WHERE p.enabled = true
        ORDER BY random()
        LIMIT 1;
END;
$$ LANGUAGE plpgsql;