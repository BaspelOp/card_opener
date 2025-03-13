CALL register('example1', '{"local": "example1","domain": "example.com"}', 'password1');
CALL register('example2', '{"local": "example2","domain": "example.com"}', 'password2');

INSERT INTO packages (name, number_of_cards, image_path) VALUES 
('package1', 7, 'path/to/package1.png');

INSERT INTO collections (name) VALUES 
('collection1');

-- Numbers from document but optimized
INSERT INTO card_rarities (name, chance, image_path) VALUES
('Common', 999, 'path/to/common.png'),
('Uncommon', 199, 'path/to/uncommon.png'),
('Rare', 40, 'path/to/rare.png'),
('Mythical', 8, 'path/to/mythical.png'),
('Legendary', 4, 'path/to/legendary.png');

INSERT INTO card_frames (name, image_path) VALUES 
('frame1', 'path/to/frame1.png');

INSERT INTO card_icons (name, image_path) VALUES 
('icon1', 'path/to/icon1.png');

INSERT INTO cards (name, image_path, collection_id, rarity_id, frame_id, icon_id) VALUES 
('card1', 'path/to/card1.png', 1, 1, 1, 1),
('card2', 'path/to/card2.png', 1, 2, 1, 1),
('card3', 'path/to/card3.png', 1, 3, 1, 1),
('card4', 'path/to/card4.png', 1, 4, 1, 1),
('card5', 'path/to/card5.png', 1, 5, 1, 1);

INSERT INTO owned_cards (user_id, card_id, quantity) VALUES 
(1, 1, 10), 
(1, 2, 5), 
(1, 3, 7), 
(1, 4, 3), 
(1, 5, 8),
(2, 1, 12), 
(2, 2, 6), 
(2, 3, 2), 
(2, 4, 3), 
(2, 5, 1);

INSERT INTO cards_in_package (package_id, card_id) VALUES 
(1, 1), 
(1, 2), 
(1, 3),
(1, 4),
(1, 5);

INSERT INTO trades (from_user_id, to_user_id, offered_card_id, wanted_card_id) VALUES
(1, 2, 1, 2);
