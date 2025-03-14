-- User
CREATE USER app PASSWORD 'app';

-- Grand
GRANT SELECT, INSERT(username, email, password), DELETE ON users TO app;

GRANT SELECT ON packages TO app;

GRANT SELECT ON collections TO app;

GRANT SELECT ON card_rarities TO app;

GRANT SELECT ON card_frames TO app;

GRANT SELECT ON card_icons TO app;

GRANT SELECT ON cards TO app;

GRANT SELECT, INSERT(user_id, card_id, quantity), UPDATE(quantity), DELETE ON owned_cards TO app;

GRANT SELECT ON cards_in_package TO app;

GRANT SELECT, INSERT(from_user_id, to_user_id, offered_card_id, wanted_card_id), DELETE ON trades TO app;

GRANT SELECT ON top_10_users_with_most_cards TO app;

GRANT SELECT ON top_10_most_owned_cards TO app;

GRANT SELECT ON top_10_most_wanted_cards TO app;
