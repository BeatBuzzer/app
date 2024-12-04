DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'friendship_status') THEN
            CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'declined');
        END IF;
    END
$$;

CREATE TABLE IF NOT EXISTS friendships
(
    friendship_id  SERIAL PRIMARY KEY,
    user1_id       UUID                     NOT NULL,
    user2_id       UUID                     NOT NULL,
    status         friendship_status        NOT NULL,
    action_user_id UUID                     NOT NULL, -- The user who performed the last action
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    -- Ensure user1_id is always less than user2_id to prevent duplicate friendships
    CONSTRAINT ensure_user_order CHECK (user1_id < user2_id),
    CONSTRAINT unique_friendship UNIQUE (user1_id, user2_id),

    -- Foreign keys
    CONSTRAINT fk_user1 FOREIGN KEY (user1_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_user2 FOREIGN KEY (user2_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_action_user FOREIGN KEY (action_user_id) REFERENCES users (id)
);

CREATE INDEX IF NOT EXISTS idx_friendship_user1 ON friendships (user1_id, status);
CREATE INDEX IF NOT EXISTS idx_friendship_user2 ON friendships (user2_id, status);

-- Functions

-- automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_friendships_timestamp
    BEFORE UPDATE
    ON friendships
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Send a friend request
CREATE OR REPLACE FUNCTION send_friend_request(sender_id UUID, receiver_id UUID) RETURNS void AS
$$
DECLARE
    smaller_id UUID;
    larger_id  UUID;
BEGIN
    -- Determine order of IDs
    IF sender_id < receiver_id THEN
        smaller_id := sender_id;
        larger_id := receiver_id;
    ELSE
        smaller_id := receiver_id;
        larger_id := sender_id;
    END IF;

    -- Insert friendship record
    INSERT INTO friendships (user1_id, user2_id, status, action_user_id)
    VALUES (smaller_id, larger_id, 'pending', sender_id)
    ON CONFLICT (user1_id, user2_id) DO UPDATE
        SET status         = CASE
                                 WHEN friendships.status = 'declined' THEN 'pending'::friendship_status
                                 ELSE friendships.status
            END,
            action_user_id = sender_id;
END;
$$ LANGUAGE plpgsql;

-- accept friendship request
CREATE OR REPLACE FUNCTION accept_friend_request_by_id(friendship_id_param INT)
    RETURNS void AS
$$
BEGIN
    UPDATE friendships
    SET status = 'accepted'
    WHERE friendship_id = friendship_id_param
      AND status = 'pending';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No pending friend request found with this ID';
    END IF;
END;
$$ LANGUAGE plpgsql;


-- decline friendship request
CREATE OR REPLACE FUNCTION decline_friend_request_by_id(friendship_id_param INT)
    RETURNS void AS
$$
BEGIN
    UPDATE friendships
    SET status = 'declined'
    WHERE friendship_id = friendship_id_param
      AND status = 'pending';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No pending friend request found with this ID';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- delete friendship
CREATE OR REPLACE FUNCTION remove_friend(user_id UUID, friend_id UUID) RETURNS void AS
$$
DECLARE
    smaller_id UUID;
    larger_id  UUID;
BEGIN
    -- Determine order of IDs
    IF friend_id < user_id THEN
        smaller_id := friend_id;
        larger_id := user_id;
    ELSE
        smaller_id := user_id;
        larger_id := friend_id;
    END IF;

    DELETE
    FROM friendships
    WHERE user1_id = smaller_id
      AND user2_id = larger_id
      AND status = 'accepted';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No active friendship found between these users';
    END IF;
END;
$$ LANGUAGE plpgsql;


-- retrieve all friends, incoming and outgoing friend requests
CREATE OR REPLACE FUNCTION get_friends(user_id UUID)
    RETURNS TABLE
            (
                friendship_id  INT,
                friend_id      UUID,
                status         friendship_status,
                action_user_id UUID,
                created_at     TIMESTAMP WITH TIME ZONE,
                updated_at     TIMESTAMP WITH TIME ZONE
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT f.friendship_id,
               CASE
                   WHEN f.user1_id = user_id THEN f.user2_id
                   ELSE f.user1_id
                   END AS friend_id,
               f.status,
               f.action_user_id,
               f.created_at,
               f.updated_at
        FROM friendships f
        WHERE (f.user1_id = user_id OR f.user2_id = user_id)
          AND (f.status != 'declined');
END;
$$ LANGUAGE plpgsql;

-- examples
-- SELECT send_friend_request('sender', 'receiver');
-- SELECT accept_friend_request_by_id(4);
-- SELECT decline_friend_request_by_id(4);
-- SELECT remove_friend('friend_user');
-- SELECT * FROM get_friends('user_id');
