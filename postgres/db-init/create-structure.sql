-- Data types
CREATE DOMAIN NON_EMPTY_TEXT AS TEXT CHECK (char_length(VALUE) > 0);
CREATE DOMAIN POSITIVE_INTEGER AS INTEGER CHECK (VALUE > 0);

-- Tables
CREATE TABLE users (
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
    uuid UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    username NON_EMPTY_TEXT NOT NULL,
    email JSONB NOT NULL UNIQUE,
    password NON_EMPTY_TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE packages (
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
    uuid UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    name NON_EMPTY_TEXT NOT NULL,
    number_of_cards POSITIVE_INTEGER NOT NULL,
    image_path NON_EMPTY_TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE collections (
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
    uuid UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    name NON_EMPTY_TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE card_rarities (
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
    uuid UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    name NON_EMPTY_TEXT NOT NULL,
    chance INTEGER NOT NULL,
    image_path NON_EMPTY_TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE card_frames (
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
    uuid UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    name NON_EMPTY_TEXT NOT NULL,
    image_path NON_EMPTY_TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE card_icons (
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
    uuid UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    name NON_EMPTY_TEXT NOT NULL,
    image_path NON_EMPTY_TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE cards (
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
    uuid UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    name NON_EMPTY_TEXT NOT NULL,
    image_path NON_EMPTY_TEXT NOT NULL,
    collection_id INTEGER NOT NULL,
    rarity_id INTEGER NOT NULL,
    frame_id INTEGER NOT NULL,
    icon_id INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (collection_id) REFERENCES collections (id),
    FOREIGN KEY (rarity_id) REFERENCES card_rarities (id),
    FOREIGN KEY (frame_id) REFERENCES card_frames (id),
    FOREIGN KEY (icon_id) REFERENCES card_icons (id)
);

CREATE TABLE owned_cards(
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
    uuid UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    user_id INTEGER NOT NULL,
    card_id INTEGER NOT NULL,
    quantity POSITIVE_INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (user_id, card_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (card_id) REFERENCES cards (id) ON DELETE CASCADE
);

CREATE TABLE cards_in_package(
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
    uuid UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    package_id INTEGER NOT NULL,
    card_id INTEGER NOT NULL,
    UNIQUE(package_id, card_id),
    PRIMARY KEY (id),
    FOREIGN KEY (package_id) REFERENCES packages (id) ON DELETE CASCADE,
    FOREIGN KEY (card_id) REFERENCES cards (id) ON DELETE CASCADE
);

CREATE TABLE trades(
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY UNIQUE,
    uuid UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    from_user_id INTEGER NOT NULL,
    to_user_id INTEGER NOT NULL,
    offered_card_id INTEGER NOT NULL,
    wanted_card_id INTEGER NOT NULL,
    CHECK (from_user_id != to_user_id),
    CHECK (offered_card_id != wanted_card_id),
    PRIMARY KEY (id),
    FOREIGN KEY (from_user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (to_user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (offered_card_id) REFERENCES cards (id) ON DELETE CASCADE,
    FOREIGN KEY (wanted_card_id) REFERENCES cards (id) ON DELETE CASCADE
);

-- Views
CREATE VIEW top_10_users_with_most_cards AS
    SELECT users.username AS username, count(owned_cards.user_id) AS card_count 
        FROM owned_cards
        JOIN users ON owned_cards.user_id = users.id
        GROUP BY users.username
        ORDER BY card_count DESC
        LIMIT 10;

CREATE VIEW top_10_most_owned_cards AS
    SELECT cards.name AS name, sum(owned_cards.quantity) AS card_count 
        FROM owned_cards
        JOIN cards ON owned_cards.card_id = cards.id
        GROUP BY cards.name
        ORDER BY card_count DESC
        LIMIT 10;

CREATE VIEW top_10_most_wanted_cards AS
    SELECT cards.name AS name, count(trades.wanted_card_id) AS card_count
        FROM trades
        JOIN cards ON trades.wanted_card_id = cards.id
        GROUP BY cards.name
        ORDER BY card_count DESC
        LIMIT 10;
