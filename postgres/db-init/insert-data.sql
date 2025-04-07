CALL register('john_doe', '{"local": "john.doe","domain": "database.cz"}', 'securePass123');
CALL register('jane_smith', '{"local": "jane.smith","domain": "company.com"}', 'strongPassword456');

INSERT INTO packages (name, number_of_cards, image_path) VALUES 
('Package Of Water', 7, 'images/packages/package_water.png'),
('Package Of Cars', 20, 'images/Packages/Cars/Package.png');

INSERT INTO collections (name) VALUES 
('Elements'),
('Cars');

-- Numbers from document but optimized
INSERT INTO card_rarities (name, chance, image_path) VALUES
('Common', 999, 'images/rarity/common.png'),
('Uncommon', 199, 'images/rarity/uncommon.png'),
('Rare', 40, 'images/rarity/rare.png'),
('Mythical', 8, 'images/rarity/mythical.png'),
('Legendary', 4, 'images/rarity/legendary.png');

INSERT INTO card_frames (name, image_path) VALUES 
('Water Frame', 'images/frames/water_frame.png'),
('Cars Frame', 'images/Frames/Cars/Frame.png');

INSERT INTO card_icons (name, image_path) VALUES 
('Water Icon', 'images/icons/water_icon.png'),
('Cars Icon', 'images/Icons/Cars/Icon.png');

INSERT INTO cards (name, image_path, collection_id, rarity_id, frame_id, icon_id) VALUES 
-- Elements
('Human Of Water', 'images/cards/human_of_water.png', 1, 1, 1, 1),
('Guard Of Water', 'images/cards/guard_of_water.png', 1, 2, 1, 1),
('Prisoner Of Water', 'images/cards/prisoner_of_water.png', 1, 3, 1, 1),
('Water Element', 'images/cards/water_element.png', 1, 4, 1, 1),
('Shark', 'images/cards/shark.png', 1, 5, 1, 1),

-- Cars
-- Common (8)
('City Car', 'images/Mains/Cars/Common/1.png', 2, 1, 2, 2),
('Sedan', 'images/Mains/Cars/Common/2.png', 2, 1, 2, 2),
('Hatchback', 'images/Mains/Cars/Common/3.png', 2, 1, 2, 2),
('Crossover', 'images/Mains/Cars/Common/4.png', 2, 1, 2, 2),
('Coupe', 'images/Mains/Cars/Common/5.png', 2, 1, 2, 2),
('Convertible', 'images/Mains/Cars/Common/6.png', 2, 1, 2, 2),
('Van', 'images/Mains/Cars/Common/7.png', 2, 1, 2, 2),
('Pickup Truck', 'images/Mains/Cars/Common/8.png', 2, 1, 2, 2),

-- Uncommon (5)
('Police Car', 'images/Mains/Cars/Uncommon/9.png', 2, 2, 2, 2),
('Ambulance', 'images/Mains/Cars/Uncommon/10.png', 2, 2, 2, 2),
('Fire Truck', 'images/Mains/Cars/Uncommon/11.png', 2, 2, 2, 2),
('Taxi', 'images/Mains/Cars/Uncommon/12.png', 2, 2, 2, 2),
('Delivery Van', 'images/Mains/Cars/Uncommon/13.png', 2, 2, 2, 2),

-- Rare (4)
('Sports Car', 'images/Mains/Cars/Rare/14.png', 2, 3, 2, 2),
('Racing Car', 'images/Mains/Cars/Rare/15.png', 2, 3, 2, 2),
('Limousine', 'images/Mains/Cars/Rare/16.png', 2, 3, 2, 2),
('SUV', 'images/Mains/Cars/Rare/17.png', 2, 3, 2, 2),

-- Mythical (2)
('Vintage Car', 'images/Mains/Cars/Mythical/18.png', 2, 4, 2, 2),
('Concept Car', 'images/Mains/Cars/Mythical/19.png', 2, 4, 2, 2),

-- Legendary (1)
('Hypercar', 'images/Mains/Cars/Legendary/20.png', 2, 5, 2, 2);

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
(2, 5, 1),

-- Cars
-- Common (IDs 6–13)
(1, 6, 5), (1, 7, 3), (1, 8, 2), (1, 9, 6),
(2, 10, 4), (2, 11, 2), (2, 12, 1), (2, 13, 3),

-- Uncommon (IDs 14–18)
(1, 14, 1), (1, 15, 2),
(2, 16, 1), (2, 17, 2), (2, 18, 1),

-- Rare (IDs 19–22)
(1, 19, 1), (2, 20, 1), (2, 21, 1), (1, 22, 1),

-- Mythical (IDs 23–24)
(1, 23, 1), (2, 24, 1),

-- Legendary (ID 25)
(1, 25, 1);

INSERT INTO cards_in_package (package_id, card_id) VALUES 
(1, 1), 
(1, 2), 
(1, 3),
(1, 4),
(1, 5),

-- Cars
(2, 6), (2, 7), (2, 8), (2, 9), (2, 10),
(2, 11), (2, 12), (2, 13), (2, 14), (2, 15),
(2, 16), (2, 17), (2, 18), (2, 19), (2, 20),
(2, 21), (2, 22), (2, 23), (2, 24), (2, 25);

INSERT INTO trades (from_user_id, to_user_id, offered_card_id, wanted_card_id) VALUES
(1, 2, 1, 2),

-- Cars
(2, 1, 16, 7);