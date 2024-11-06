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

INSERT INTO 
	"ITEM_CATEGORY" (category_id, category_type) 
VALUES 
	('c2295c6c-2b41-40e1-8086-f5aa69177907', 'Consumable'),
	('bd87c381-a9bf-4a6e-b545-69a3f8b13830', 'Weapon'),
	('a42c881e-a961-4126-824f-ff3a4b09fd4c', 'Armor'),
	('bae6f631-9021-46ca-bc9a-0bc09d7cb20f', 'Accessory'),
	('4239ff2c-2564-4d31-b305-ae84863ddc2b', 'Shield'),
	('1cfefd20-3193-43c2-acbe-4a84ffd4f0f8', 'Headgear');

INSERT INTO 
	"ITEM_RARITY" (rarity_id, rarity_type)
VALUES
	('63ef8fe5-6375-4278-a773-8c10f93fcfdb', 'Common'),
	('9d559e17-b7e6-4d98-8a0b-23191d3afbd7', 'Uncommon'),
	('18be044f-684d-4a12-bec1-e689846bb741', 'Rare'),
	('2f8a10d5-cec2-4afb-ad7c-0faa9f8ae247', 'Epic'),
	('ec34355c-a89e-4543-8786-c80b39e68358', 'Legendary');

INSERT INTO "ITEM" (item_name, category_id, rarity_id, item_price) VALUES
('Health Potion', 'c2295c6c-2b41-40e1-8086-f5aa69177907', '63ef8fe5-6375-4278-a773-8c10f93fcfdb', 50),
('Greater Health Potion', 'c2295c6c-2b41-40e1-8086-f5aa69177907', '9d559e17-b7e6-4d98-8a0b-23191d3afbd7', 100),
('Mana Potion', 'c2295c6c-2b41-40e1-8086-f5aa69177907', '63ef8fe5-6375-4278-a773-8c10f93fcfdb', 50),
('Greater Mana Potion', 'c2295c6c-2b41-40e1-8086-f5aa69177907', '9d559e17-b7e6-4d98-8a0b-23191d3afbd7', 100),
('Steel Dagger', 'bd87c381-a9bf-4a6e-b545-69a3f8b13830', '18be044f-684d-4a12-bec1-e689846bb741', 600),
('Iron Sword', 'bd87c381-a9bf-4a6e-b545-69a3f8b13830', '9d559e17-b7e6-4d98-8a0b-23191d3afbd7', 300),
('Wooden Staff', 'bd87c381-a9bf-4a6e-b545-69a3f8b13830', '9d559e17-b7e6-4d98-8a0b-23191d3afbd7', 200),
('Cloak of Shadows', 'a42c881e-a961-4126-824f-ff3a4b09fd4c', '18be044f-684d-4a12-bec1-e689846bb741', 550),
('Iron Helm', 'a42c881e-a961-4126-824f-ff3a4b09fd4c', '9d559e17-b7e6-4d98-8a0b-23191d3afbd7', 250),
('Amulet of Druidic Power', 'bae6f631-9021-46ca-bc9a-0bc09d7cb20f', '18be044f-684d-4a12-bec1-e689846bb741', 300),
('Robe of Arcane Mysteries', 'a42c881e-a961-4126-824f-ff3a4b09fd4c', '9d559e17-b7e6-4d98-8a0b-23191d3afbd7', 200),
('Ring of the Necromancer', 'bae6f631-9021-46ca-bc9a-0bc09d7cb20f', '2f8a10d5-cec2-4afb-ad7c-0faa9f8ae247', 600),
('Bow of the Silent Hunter', 'bd87c381-a9bf-4a6e-b545-69a3f8b13830', '18be044f-684d-4a12-bec1-e689846bb741', 250),
('Divine Shield', '4239ff2c-2564-4d31-b305-ae84863ddc2b', 'ec34355c-a89e-4543-8786-c80b39e68358', 1200),
('Crown of the Bard King', '1cfefd20-3193-43c2-acbe-4a84ffd4f0f8', 'ec34355c-a89e-4543-8786-c80b39e68358', 1000),
('Warhammer of the Paladin King', 'bd87c381-a9bf-4a6e-b545-69a3f8b13830', 'ec34355c-a89e-4543-8786-c80b39e68358', 950);

INSERT INTO 
	"ITEM_CLASS" (item_id, class_id)
VALUES 
(1, '1m2n3o456'), (1, '2n3o4p567'), (1, '3o4p5q678'), (1, '4p5q6r789'), (1, '5q6r7s890'), 
(1, '6r7s8t901'), (1, '7s8t9u012'), (1, '8t9u0v123'), (1, '9u0v1w234'), (1, '0v1w2x345'),
(2, '1m2n3o456'), (2, '2n3o4p567'), (2, '3o4p5q678'), (2, '4p5q6r789'), (2, '5q6r7s890'), 
(2, '6r7s8t901'), (2, '7s8t9u012'), (2, '8t9u0v123'), (2, '9u0v1w234'), (2, '0v1w2x345'),
(3, '1m2n3o456'), (3, '2n3o4p567'), (3, '3o4p5q678'), (3, '4p5q6r789'), (3, '5q6r7s890'), 
(3, '6r7s8t901'), (3, '7s8t9u012'), (3, '8t9u0v123'), (3, '9u0v1w234'), (3, '0v1w2x345'),
(4, '1m2n3o456'), (4, '2n3o4p567'), (4, '3o4p5q678'), (4, '4p5q6r789'), (4, '5q6r7s890'), 
(4, '6r7s8t901'), (4, '7s8t9u012'), (4, '8t9u0v123'), (4, '9u0v1w234'), (4, '0v1w2x345'),
(5, '2n3o4p567'), (5, '9u0v1w234'), (5, '6r7s8t901'),
(6, '1m2n3o456'), (6, '5q6r7s890'), (6, '6r7s8t901'),
(7, '3o4p5q678'), (7, '0v1w2x345'), (7, '7s8t9u012'),
(8, '2n3o4p567'), (8, '6r7s8t901'), (8, '9u0v1w234'),
(9, '8t9u0v123'), (9, '5q6r7s890'),
(10, '7s8t9u012'), (10, '6r7s8t901'),
(11, '3o4p5q678'), (11, '7s8t9u012'), (11, '8t9u0v123'),
(12, '0v1w2x345'),
(13, '6r7s8t901'), (13, '2n3o4p567'),
(14, '4p5q6r789'), (14, '5q6r7s890'), (14, '1m2n3o456'),
(15, '9u0v1w234'),
(16, '5q6r7s890');

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

