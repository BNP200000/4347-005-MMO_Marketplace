INSERT INTO
    "USER" (user_id, username, password, email)
VALUES
    ('1x2y3z456', 'dragonlord', 'pass123', 'dragonlord@example.com'),
    ('2y3z4a567', 'skywalker', 'star123', 'skywalker@example.com'),
    ('3z4a5b678', 'ironfist', 'punch789', 'ironfist@example.com'),
    ('4a5b6c789', 'shadowblade', 'shadow456', 'shadowblade@example.com'),
    ('5b6c7d890', 'stormrider', 'rider567', 'stormrider@example.com'),
    ('6c7d8e901', 'firemage', 'fire321', 'firemage@example.com'),
    ('7d8e9f012', 'windrunner', 'wind111', 'windrunner@example.com'),
    ('8e9f0g123', 'earthwarden', 'earth222', 'earthwarden@example.com'),
    ('9f0g1h234', 'waterseer', 'water333', 'waterseer@example.com'),
    ('0g1h2i345', 'lightbringer', 'light444', 'lightbringer@example.com');

INSERT INTO
    "CLASS" (class_id, class_name, class_description, class_role)
VALUES
    ('1m2n3o456', 'Warrior', 'Frontline fighter', 'Tank'),
    ('2n3o4p567', 'Rogue', 'Stealthy assassin', 'DPS'),
    ('3o4p5q678', 'Mage', 'Master of magic', 'DPS'),
    ('4p5q6r789', 'Cleric', 'Healer of the wounded', 'Healer'),
    ('5q6r7s890', 'Paladin', 'Holy warrior', 'Tank'),
    ('6r7s8t901', 'Ranger', 'Expert marksman', 'DPS'),
    ('7s8t9u012', 'Druid', 'Nature spellcaster', 'Healer'),
    ('8t9u0v123', 'Monk', 'Martial artist', 'DPS'),
    ('9u0v1w234', 'Bard', 'Musical supporter', 'Support'),
    ('0v1w2x345', 'Necromancer', 'Summoner of the dead', 'DPS');

INSERT INTO
    "CHARACTER" (character_id, exp_level, character_name, gold_balance, owner_id, character_class, party_leader)
VALUES
    ('1a2b3c456', 5, 'Alduin', 300, '1x2y3z456', '1m2n3o456', NULL), -- Alduin is a Warrior, no leader
    ('2b3c4d567', 3, 'Lyria', 150, '2y3z4a567', '2n3o4p567', '1a2b3c456'), -- Lyria is a Rogue, led by Alduin
    ('3c4d5e678', 7, 'Gorath', 500, '3z4a5b678', '3o4p5q678', '1a2b3c456'), -- Gorath is a Mage, led by Alduin
    ('4d5e6f789', 6, 'Serana', 250, '4a5b6c789', '1m2n3o456', NULL), -- Serana is a Warrior, no leader
    ('5e6f7g890', 10, 'Theron', 800, '5b6c7d890', '2n3o4p567', '1a2b3c456'), -- Theron is a Rogue, led by Alduin
    ('6f7g8h901', 4, 'Miraak', 200, '6c7d8e901', '3o4p5q678', '2b3c4d567'), -- Miraak is a Mage, led by Lyria
    ('7g8h9i012', 12, 'Valdrin', 1000, '7d8e9f012', '4p5q6r789', '3c4d5e678'), -- Valdrin is a Cleric, led by Gorath
    ('8h9i0j123', 2, 'Nalya', 100, '8e9f0g123', '1m2n3o456', '2b3c4d567'), -- Nalya is a Warrior, led by Lyria
    ('9i0j1k234', 9, 'Druin', 750, '9f0g1h234', '4p5q6r789', '3c4d5e678'), -- Druin is a Cleric, led by Gorath
    ('0j1k2l345', 8, 'Kael', 600, '0g1h2i345', '5q6r7s890', '1a2b3c456');

INSERT INTO
    "PARTY" (party_name, party_balance, party_leader)
VALUES
    ('Lyrical', 53422, '1a2b3c456'),
    ('Arcane', 3234223, '4d5e6f789'),
    ('Dragon Slayer', 1000, '2b3c4d567'),
    ('Witch Hunter', 54223, '3c4d5e678'),
    ('Tuba Gang', 546, '7g8h9i012'),
    ('Stroopwafel', 564, '0j1k2l345'),
    ('Birds of Prey', 32, '9i0j1k234'),
    ('The Fallen', 7869, '6f7g8h901'),
    ('Masked Fools', 435345, '5e6f7g890'),
    ('Asgard', 34523, '8h9i0j123');

INSERT INTO "ITEM" (item_name, item_category, item_rarity, item_price, allowed_classes) VALUES
('Health Potion', 'Consumable', 'Common', 50, ARRAY[
    '1m2n3o456', '2n3o4p567', '3o4p5q678', '4p5q6r789', '5q6r7s890', 
    '6r7s8t901', '7s8t9u012', '8t9u0v123', '9u0v1w234', '0v1w2x345'
]),
('Greater Health Potion', 'Consumable', 'Uncommon', 100, ARRAY[
    '1m2n3o456', '2n3o4p567', '3o4p5q678', '4p5q6r789', '5q6r7s890', 
    '6r7s8t901', '7s8t9u012', '8t9u0v123', '9u0v1w234', '0v1w2x345'
]),
('Mana Potion', 'Consumable', 'Common', 50, ARRAY[
    '1m2n3o456', '2n3o4p567', '3o4p5q678', '4p5q6r789', '5q6r7s890', 
    '6r7s8t901', '7s8t9u012', '8t9u0v123', '9u0v1w234', '0v1w2x345'
]),
('Greater Mana Potion', 'Consumable', 'Uncommon', 100, ARRAY[
    '1m2n3o456', '2n3o4p567', '3o4p5q678', '4p5q6r789', '5q6r7s890', 
    '6r7s8t901', '7s8t9u012', '8t9u0v123', '9u0v1w234', '0v1w2x345'
]),
('Steel Dagger', 'Weapon', 'Rare', 600, ARRAY['2n3o4p567', '9u0v1w234', '6r7s8t901']),
('Iron Sword', 'Weapon', 'Uncommon', 300, ARRAY['1m2n3o456', '5q6r7s890', '6r7s8t901']),
('Wooden Staff', 'Weapon', 'Uncommon', 200, ARRAY['3o4p5q678', '0v1w2x345', '7s8t9u012']),
('Cloak of Shadows', 'Armor', 'Rare', 550, ARRAY['2n3o4p567', '6r7s8t901', '9u0v1w234']),
('Iron Helm', 'Armor', 'Uncommon', 250, ARRAY['8t9u0v123', '5q6r7s890']),
('Amulet of Druidic Power', 'Accessory', 'Rare', 300, ARRAY['7s8t9u012', '6r7s8t901']),
('Robe of Arcane Mysteries', 'Armor', 'Uncommon', 200, ARRAY['3o4p5q678', '7s8t9u012', '8t9u0v123']),
('Ring of the Necromancer', 'Accessory', 'Epic', 600, ARRAY['0v1w2x345']),
('Bow of the Silent Hunter', 'Weapon', 'Rare', 250, ARRAY['6r7s8t901', '2n3o4p567']),
('Divine Shield', 'Shield', 'Legendary', 1200, ARRAY['4p5q6r789', '5q6r7s890', '1m2n3o456']),
('Crown of the Bard King', 'Headgear', 'Legendary', 1000, ARRAY['9u0v1w234']),
('Warhammer of the Paladin King', 'Weapon', 'Legendary', 950, ARRAY['5q6r7s890']);


INSERT INTO "LISTING" (character_id, item_id, quantity, listing_date, is_active, sale_price) VALUES
('1a2b3c456', 1, 10, '2024-09-15', TRUE, 150),
('2b3c4d567', 2, 5, '2024-08-23', TRUE, 350),
('3c4d5e678', 3, 1, '2024-10-01', FALSE, 1000),
('4d5e6f789', 4, 2, '2024-09-10', TRUE, 1200),
('5e6f7g890', 5, 3, '2024-08-30', FALSE, 500),
('6f7g8h901', 6, 7, '2024-09-25', TRUE, 250),
('7g8h9i012', 7, 4, '2024-09-02', TRUE, 200),
('8h9i0j123', 8, 12, '2024-07-20', FALSE, 300),
('9i0j1k234', 9, 6, '2024-08-29', TRUE, 950),
('0j1k2l345', 10, 1, '2024-09-18', FALSE, 50),
('1a2b3c456', 11, 4, '2024-08-15', TRUE, 400),
('2b3c4d567', 12, 6, '2024-07-28', FALSE, 180),
('3c4d5e678', 13, 8, '2024-09-30', TRUE, 600),
('4d5e6f789', 14, 9, '2024-08-25', TRUE, 1000),
('5e6f7g890', 15, 10, '2024-09-01', FALSE, 800),
('6f7g8h901', 16, 11, '2024-09-12', TRUE, 50);

INSERT INTO "IN_INVENTORY" (character_id, item_id, quantity) VALUES
('1a2b3c456', 1, 32),
('2b3c4d567', 2, 15),
('3c4d5e678', 3, 40),
('4d5e6f789', 4, 22),
('5e6f7g890', 5, 12),
('6f7g8h901', 6, 47),
('7g8h9i012', 7, 29),
('8h9i0j123', 8, 18),
('9i0j1k234', 9, 35),
('0j1k2l345', 10, 41),
('1a2b3c456', 11, 27),
('2b3c4d567', 12, 14),
('3c4d5e678', 13, 38),
('4d5e6f789', 14, 46),
('5e6f7g890', 15, 9),
('6f7g8h901', 16, 44);

INSERT INTO
    "TRANSACTION" (transaction_id, total_price, transaction_date)
VALUES
    ('741966', 53422, '2024-10-22'),
    ('703221', 3234223, '2024-10-28'),
    ('703814', 1000, '2024-11-04'),
    ('772759', 54223, '2024-11-06'),
    ('744093', 546, '2024-11-12'),
    ('733026', 564, '2024-11-23'),
    ('773521', 32, '2024-11-30'),
    ('781428', 7869, '2024-12-14'),
    ('761722', 435345, '2024-12-21'),
    ('716844', 34523, '2024-12-24');

