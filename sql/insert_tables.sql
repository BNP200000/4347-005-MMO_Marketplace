INSERT INTO "USER" (user_id, username, password, email, account_type, has_free_chat, has_safe_chat, has_safe_server_access)
VALUES
    ('1x2y3z456', 'dragonlord', 'pass123', 'dragonlord@example.com', 'adult', TRUE, TRUE, TRUE),
    ('2y3z4a567', 'skywalker', 'star123', 'skywalker@example.com', 'child', FALSE, TRUE, FALSE),
    ('3z4a5b678', 'ironfist', 'punch789', 'ironfist@example.com', 'adult', TRUE, TRUE, TRUE),
    ('4a5b6c789', 'shadowblade', 'shadow456', 'shadowblade@example.com', 'child', FALSE, TRUE, FALSE),
    ('5b6c7d890', 'stormrider', 'rider567', 'stormrider@example.com', 'adult', TRUE, TRUE, TRUE),
    ('6c7d8e901', 'firemage', 'fire321', 'firemage@example.com', 'child', FALSE, TRUE, FALSE),
    ('7d8e9f012', 'windrunner', 'wind111', 'windrunner@example.com', 'adult', TRUE, TRUE, TRUE),
    ('8e9f0g123', 'earthwarden', 'earth222', 'earthwarden@example.com', 'child', FALSE, TRUE, FALSE),
    ('9f0g1h234', 'waterseer', 'water333', 'waterseer@example.com', 'adult', TRUE, TRUE, TRUE),
    ('0g1h2i345', 'lightbringer', 'light444', 'lightbringer@example.com', 'child', FALSE, TRUE, FALSE);


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
    "CHARACTER" (character_id, exp_level, character_name, gold_balance, owner_id, character_class, leader_id)
VALUES
    ('1a2b3c456', 5, 'Alduin', 300, '1x2y3z456', '1m2n3o456', NULL),
    ('2b3c4d567', 3, 'Lyria', 150, '2y3z4a567', '2n3o4p567', '1a2b3c456'),
    ('3c4d5e678', 7, 'Gorath', 500, '3z4a5b678', '3o4p5q678', '1a2b3c456'),
    ('4d5e6f789', 6, 'Serana', 250, '4a5b6c789', '1m2n3o456', NULL),
    ('5e6f7g890', 10, 'Theron', 800, '5b6c7d890', '2n3o4p567', '1a2b3c456'),
    ('6f7g8h901', 4, 'Miraak', 200, '6c7d8e901', '3o4p5q678', '2b3c4d567'),
    ('7g8h9i012', 12, 'Valdrin', 1000, '7d8e9f012', '4p5q6r789', '3c4d5e678'), 
    ('8h9i0j123', 2, 'Nalya', 100, '8e9f0g123', '1m2n3o456', '2b3c4d567'),
    ('9i0j1k234', 9, 'Druin', 750, '9f0g1h234', '4p5q6r789', '3c4d5e678'),
    ('0j1k2l345', 8, 'Kael', 600, '0g1h2i345', '5q6r7s890', '1a2b3c456');

INSERT INTO
    "PARTY" (party_name, party_leader, party_balance)
VALUES
    ('Lyrical', '1a2b3c456', 53422),
	('Arcane', '4d5e6f789', 3234223),
	('Dragon Slayer', '2b3c4d567', 1000),
	('Witch Hunter', '3c4d5e678', 54223),
	('Tuba Gang', '7g8h9i012', 546),
	('Stroopwafel', '0j1k2l345', 564),
	('Birds of Prey', '9i0j1k234', 32),
	('The Fallen', '6f7g8h901', 7869),
	('Masked Fools', '5e6f7g890', 435345),
	('Asgard', '8h9i0j123', 34523);

ALTER TABLE "CHARACTER"
ADD CONSTRAINT FK_leader_id
FOREIGN KEY (leader_id) REFERENCES "PARTY" (party_leader);

INSERT INTO
    "CHARACTER_FRIEND" (character_a_id, character_b_id)
VALUES
    ('1a2b3c456', '2b3c4d567'),
    ('1a2b3c456', '3c4d5e678'),
    ('2b3c4d567', '6f7g8h901'),
    ('3c4d5e678', '9i0j1k234'),
    ('4d5e6f789', '1a2b3c456'),
    ('5e6f7g890', '2b3c4d567'),
    ('6f7g8h901', '7g8h9i012'),
    ('7g8h9i012', '3c4d5e678'),
    ('8h9i0j123', '9i0j1k234'),
    ('0j1k2l345', '5e6f7g890');

INSERT INTO "ITEM_CATEGORY" (item_category) VALUES
    ('Consumable'),
    ('Weapon'),
    ('Armor'),
    ('Accessory'),
    ('Shield'),
    ('Headgear');

INSERT INTO "ITEM_RARITY" (item_rarity) VALUES
    ('Common'),
    ('Uncommon'),
    ('Rare'),
    ('Epic'),
    ('Legendary');

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


INSERT INTO "LISTING" (character_id, quantity, listing_date, is_active, sale_price) VALUES
('1a2b3c456', 10, '2024-09-15', TRUE, 150),
('2b3c4d567', 5, '2024-08-23', TRUE, 350),
('3c4d5e678', 1, '2024-10-01', FALSE, 1000),
('4d5e6f789', 2, '2024-09-10', TRUE, 1200),
('5e6f7g890', 3, '2024-08-30', FALSE, 500),
('6f7g8h901', 7, '2024-09-25', TRUE, 250),
('7g8h9i012', 4, '2024-09-02', TRUE, 200),
('8h9i0j123', 12, '2024-07-20', FALSE, 300),
('9i0j1k234', 6, '2024-08-29', TRUE, 950),
('0j1k2l345', 1, '2024-09-18', FALSE, 50),
('1a2b3c456', 4, '2024-08-15', TRUE, 400),
('2b3c4d567', 6, '2024-07-28', FALSE, 180),
('3c4d5e678', 8, '2024-09-30', TRUE, 600),
('4d5e6f789', 9, '2024-08-25', TRUE, 1000),
('5e6f7g890', 10, '2024-09-01', FALSE, 800),
('6f7g8h901', 11, '2024-09-12', TRUE, 50);

INSERT INTO "IN_INVENTORY" (character_id, quantity) VALUES
('1a2b3c456', 32),
('2b3c4d567', 15),
('3c4d5e678', 40),
('4d5e6f789', 22),
('5e6f7g890', 12),
('6f7g8h901', 47),
('7g8h9i012', 29),
('8h9i0j123', 18),
('9i0j1k234', 35),
('0j1k2l345', 41),
('1a2b3c456', 27),
('2b3c4d567', 14),
('3c4d5e678', 38),
('4d5e6f789', 46),
('5e6f7g890', 9),
('6f7g8h901', 44);

INSERT INTO
    "TRANSACTION" (transaction_id, seller_id, buyer_id, transaction_date)
VALUES
    ('nfgu04bkz1', '1a2b3c456', '2b3c4d567', '2024-10-22'),
    ('7lgij2an48', '2b3c4d567', '1a2b3c456', '2024-10-28'),
    ('tiu0p1pmon', '3c4d5e678', '0j1k2l345', '2024-11-04'),
    ('vt4ix91tle', '4d5e6f789', '5e6f7g890', '2024-11-06'),
    ('urgd1d5h6i', '5e6f7g890', '1a2b3c456', '2024-11-12'),
    ('o3jc0zpf5w', '6f7g8h901', '5e6f7g890', '2024-11-23'),
    ('nTdbGTf8Mz', '7g8h9i012', '6f7g8h901', '2024-11-30'),
    ('46onzox4ew', '8h9i0j123', '0j1k2l345', '2024-12-14'),
    ('bf9ky0a20c', '9i0j1k234', '5e6f7g890', '2024-12-21'),
    ('6UFAVp7Tok', '0j1k2l345', '7g8h9i012', '2024-12-24');

