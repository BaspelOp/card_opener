CALL register('john_doe', '{"local": "john.doe","domain": "database.cz"}', 'securePass123');
CALL register('jane_smith', '{"local": "jane.smith","domain": "company.com"}', 'strongPassword456');

INSERT INTO packages (name, number_of_cards, image_path) VALUES 
('Package Of Water', 7, 'images/Packages/Elements/Package.png'),
('Package Of Cars', 5, 'images/Packages/Cars/Package.png'),
('Package Of Weapons', 3, 'images/Packages/Weapons/Package.png');

INSERT INTO collections (name) VALUES 
('Elements'),
('Cars'),
('Weapons');

-- Numbers from document but optimized
INSERT INTO card_rarities (name, chance, image_path) VALUES
('Common', 999, 'images/rarity/common.png'),
('Uncommon', 199, 'images/rarity/uncommon.png'),
('Rare', 40, 'images/rarity/rare.png'),
('Mythical', 8, 'images/rarity/mythical.png'),
('Legendary', 4, 'images/rarity/legendary.png');

INSERT INTO card_frames (name, image_path) VALUES 
('Water Frame', 'images/Frames/Elements/Frame.png'),
('Cars Frame', 'images/Frames/Cars/Frame.png'),
('Weapons Frame', 'images/Frames/Weapons/Frame.png');

INSERT INTO card_icons (name, image_path) VALUES 
('Water Icon', 'images/Icons/Elements/Icon.png'),
('Cars Icon', 'images/Icons/Cars/Icon.png'),
('Weapons Icon', 'images/Icons/Weapons/Icon.png');

INSERT INTO cards (name, image_path, collection_id, rarity_id, frame_id, icon_id) VALUES 
-- Elements
-- Common (8)
('Human Of Water', 'images/Mains/Elements/Common/1.png', 1, 1, 1, 1),
('Bubble Creature', 'images/Mains/Elements/Common/2.png', 1, 1, 1, 1),
('River Sprite', 'images/Mains/Elements/Common/3.png', 1, 1, 1, 1),
('Lake Dweller', 'images/Mains/Elements/Common/4.png', 1, 1, 1, 1),
('Raindrop Kid', 'images/Mains/Elements/Common/5.png', 1, 1, 1, 1),
('Fog Wanderer', 'images/Mains/Elements/Common/6.png', 1, 1, 1, 1),
('Ocean Spirit', 'images/Mains/Elements/Common/7.png', 1, 1, 1, 1),
('Water Elemental', 'images/Mains/Elements/Common/8.png', 1, 1, 1, 1),

-- Uncommon (5)
('Guard Of Water', 'images/Mains/Elements/Uncommon/9.png', 1, 2, 1, 1),
('Ice Warrior', 'images/Mains/Elements/Uncommon/10.png', 1, 2, 1, 1),
('Steam Golem', 'images/Mains/Elements/Uncommon/11.png', 1, 2, 1, 1),
('Swamp Guardian', 'images/Mains/Elements/Uncommon/12.png', 1, 2, 1, 1),
('Tidecaller', 'images/Mains/Elements/Uncommon/13.png', 1, 2, 1, 1),

-- Rare (4)
('Prisoner Of Water', 'images/Mains/Elements/Rare/14.png', 1, 3, 1, 1),
('Ice Element', 'images/Mains/Elements/Rare/15.png', 1, 3, 1, 1),
('Aqua Mage', 'images/Mains/Elements/Rare/16.png', 1, 3, 1, 1),
('Deep Sea Serpent', 'images/Mains/Elements/Rare/17.png', 1, 3, 1, 1),

-- Mythical (2)
('Water Element', 'images/Mains/Elements/Mythical/18.png', 1, 4, 1, 1),
('Leviathan', 'images/Mains/Elements/Mythical/19.png', 1, 4, 1, 1),

-- Legendary (1)
('Shark', 'images/Mains/Elements/Legendary/20.png', 1, 5, 1, 1),

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
('Hypercar', 'images/Mains/Cars/Legendary/20.png', 2, 5, 2, 2),

-- Weapons
-- Common (8)
('Knife', 'images/Mains/Weapons/Common/1.png', 3, 1, 3, 3),
('Pistol', 'images/Mains/Weapons/Common/2.png', 3, 1, 3, 3),
('Revolver', 'images/Mains/Weapons/Common/3.png', 3, 1, 3, 3),
('Shotgun', 'images/Mains/Weapons/Common/4.png', 3, 1, 3, 3),
('Rifle', 'images/Mains/Weapons/Common/5.png', 3, 1, 3, 3),
('Sniper Rifle', 'images/Mains/Weapons/Common/6.png', 3, 1, 3, 3),
('Grenade', 'images/Mains/Weapons/Common/7.png', 3, 1, 3, 3),
('Crossbow', 'images/Mains/Weapons/Common/8.png', 3, 1, 3, 3),

-- Uncommon (5)
('Flamethrower', 'images/Mains/Weapons/Uncommon/9.png', 3, 2, 3, 3),
('Machine Gun', 'images/Mains/Weapons/Uncommon/10.png', 3, 2, 3, 3),
('Rocket Launcher', 'images/Mains/Weapons/Uncommon/11.png', 3, 2, 3, 3),
('Katana', 'images/Mains/Weapons/Uncommon/12.png', 3, 2, 3, 3),
('Bow', 'images/Mains/Weapons/Uncommon/13.png', 3, 2, 3, 3),

-- Rare (4)
('Laser Gun', 'images/Mains/Weapons/Rare/14.png', 3, 3, 3, 3),
('Plasma Rifle', 'images/Mains/Weapons/Rare/15.png', 3, 3, 3, 3),
('Energy Sword', 'images/Mains/Weapons/Rare/16.png', 3, 3, 3, 3),
('Railgun', 'images/Mains/Weapons/Rare/17.png', 3, 3, 3, 3),

-- Mythical (2)
('Gravity Gun', 'images/Mains/Weapons/Mythical/18.png', 3, 4, 3, 3),
('Dark Matter Cannon', 'images/Mains/Weapons/Mythical/19.png', 3, 4, 3, 3),

-- Legendary (1)
('Excalibur', 'images/Mains/Weapons/Legendary/20.png', 3, 5, 3, 3);


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
-- Elements
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(1, 6), (1, 7), (1, 8), (1, 9), (1, 10),
(1, 11), (1, 12), (1, 13), (1, 14), (1, 15),
(1, 16), (1, 17), (1, 18), (1, 19), (1, 20),

-- Cars
(2, 21), (2, 22), (2, 23), (2, 24), (2, 25),
(2, 26), (2, 27), (2, 28), (2, 29), (2, 30),
(2, 31), (2, 32), (2, 33), (2, 34), (2, 35), 
(2, 36), (2, 37), (2, 38), (2, 39), (2, 40),

-- Weapons
(3, 41), (3, 42), (3, 43), (3, 44), (3, 45),
(3, 46), (3, 47), (3, 48), (3, 49), (3, 50),
(3, 51), (3, 52), (3, 53), (3, 54), (3, 55),
(3, 56), (3, 57), (3, 58), (3, 59), (3, 60);

INSERT INTO trades (from_user_id, to_user_id, offered_card_id, wanted_card_id) VALUES
(1, 2, 1, 2),

-- Cars
(2, 1, 16, 7);