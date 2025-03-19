CALL register('john_doe', '{"local": "john.doe","domain": "database.cz"}', 'securePass123');
CALL register('jane_smith', '{"local": "jane.smith","domain": "company.com"}', 'strongPassword456');

INSERT INTO packages (name, number_of_cards, image_path) VALUES 
('Package Of Water', 7, 'images/packages/package_water.png');

INSERT INTO collections (name) VALUES 
('Elements');

-- Numbers from document but optimized
INSERT INTO card_rarities (name, chance, image_path) VALUES
('Common', 999, 'images/rarity/common.png'),
('Uncommon', 199, 'images/rarity/uncommon.png'),
('Rare', 40, 'images/rarity/rare.png'),
('Mythical', 8, 'images/rarity/mythical.png'),
('Legendary', 4, 'images/rarity/legendary.png');

INSERT INTO card_frames (name, image_path) VALUES 
('Water Frame', 'images/frames/water_frame.png');

INSERT INTO card_icons (name, image_path) VALUES 
('Water Icon', 'images/icons/water_icon.png');

INSERT INTO cards (name, image_path, collection_id, rarity_id, frame_id, icon_id) VALUES 
('Human Of Water', 'images/cards/human_of_water.png', 1, 1, 1, 1),
('Guard Of Water', 'images/cards/guard_of_water.png', 1, 2, 1, 1),
('Prisoner Of Water', 'images/cards/prisoner_of_water.png', 1, 3, 1, 1),
('Water Element', 'images/cards/water_element.png', 1, 4, 1, 1),
('Shark', 'images/cards/shark.png', 1, 5, 1, 1);

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
