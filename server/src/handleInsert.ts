import pool from "./dbConfig";
import {getUserId, getCharacterId, getClassId, getLeaderId, getItemId, getCategoryId, getRarityId} from "./getId";

export const handleCharacterInsert = async (columns: string[], values: any[]) => {
    const insertCols = [...columns];
    const insertValues = [...values];
  
    const ownerIdx = columns.indexOf("owner");
    if(ownerIdx === -1) {
      throw new Error("Owner could not be found");
    }
    const ownerName = values[ownerIdx];
    const ownerId = await getUserId(ownerName);
    insertCols[ownerIdx] = "owner_id";
    insertValues[ownerIdx] = ownerId;
  
    const classIdx = columns.indexOf("class");
    if(classIdx === -1) {
      throw new Error("Class could not be found");
    }
    const className = values[classIdx];
    const classId = await getClassId(className);      
    insertCols[classIdx] = "character_class";
    insertValues[classIdx] = classId;
  
    const leaderIdx = columns.indexOf("leader");
    if(leaderIdx === -1) {
      throw new Error("Leader could not be found");
    }
    insertCols[leaderIdx] = "leader_id";
    if(values[leaderIdx] !== null) {
      const leader = values[leaderIdx];
      const leaderId = await getLeaderId(leader, "CHARACTER");
      insertValues[leaderIdx] = leaderId;
    } else {
      insertValues[leaderIdx] = null;
    }
  
    const placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO "CHARACTER"
                    (${insertCols.join(", ")}) 
                    VALUES (${placeholders}) 
                    RETURNING *`;
    return {query, value: insertValues};
};

export const handleFriendInsert = async (columns: string[], values: any[]) => {
    const insertCols = [...columns];
    const insertValues = [...values];
  
    const characterIdx = columns.indexOf("character");
    if(characterIdx === -1) {
      throw new Error("Character could not be found");
    } 
    const chararacterName = values[characterIdx];
    const characterId = await getCharacterId(chararacterName);
    insertCols[characterIdx] = "character_a_id";
    insertValues[characterIdx] = characterId;
  
    const friendIdx = columns.indexOf("friend");
    if(friendIdx === -1) {
      throw new Error("Friend could not be found");
    }
    const friendName = values[friendIdx];
    const friendId = await getCharacterId(friendName);
    insertCols[friendIdx] = "character_b_id";
    insertValues[friendIdx] = friendId;
  
    const placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO "CHARACTER_FRIEND"
                    (${insertCols.join(", ")}) 
                    VALUES (${placeholders}) 
                    RETURNING *`;
    return {query, value: insertValues};
};

export const handlePartyInsert = async (columns: string[], values: any[]) => {
    const insertCols = [...columns];
    const insertValues = [...values];
    
    const leaderIdx = columns.indexOf("party_leader");
    if(leaderIdx === -1) {
      throw new Error("Character could not be found");
    }
    const leader = values[leaderIdx];
    const leaderId = await getLeaderId(leader, "PARTY");
    insertValues[leaderIdx] = leaderId;
  
    const placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO "PARTY"
                    (${insertCols.join(", ")}) 
                    VALUES (${placeholders}) 
                    RETURNING *`;
    return {query, value: insertValues};
};

export const handleItemInsert = async (columns: string[], values: any[]) => {
    const insertCols = [...columns].filter(
      col => col !== "allowed_classes"
    );
    const insertValues = [...values].filter(
      (_, idx) => columns[idx] !== "allowed_classes"
    );
  
    const categoryIdx = columns.indexOf("item_category");
    if(categoryIdx === -1) {
      throw new Error("Item category not found");
    }
    const category = values[categoryIdx];
    const categoryId = await getCategoryId(category);
    insertCols[categoryIdx] = "category_id";
    insertValues[categoryIdx] = categoryId;
  
    const rarityIdx = columns.indexOf("item_rarity");
    if(rarityIdx === -1) {
      throw new Error("Item rarity not found");
    }
    const rarity = values[rarityIdx];
    const rarityId = await getRarityId(rarity);
    insertCols[rarityIdx] = "rarity_id";
    insertValues[rarityIdx] = rarityId;    
    
    const placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO "ITEM"
                    (${insertCols.join(", ")}) 
                    VALUES (${placeholders}) 
                    RETURNING *`;
  
    return {query, value: insertValues};
};

export const handleInventoryOrListingInsert = async (columns: string[], values: any[]) => {
    const insertCols = [...columns];
    const insertValues = [...values];
  
    const characterIdx = columns.indexOf("character_name");
    if(characterIdx === -1) {
      throw new Error("Character could not be found");
    }
    const characterName = values[characterIdx];
    const characterId = await getCharacterId(characterName);
    insertCols[characterIdx] = "character_id";
    insertValues[characterIdx] = characterId;
  
    const itemIdx = columns.indexOf("item_name");
    if(itemIdx === -1) {
      throw new Error("Item could not be found");
    }
    const itemName = values[itemIdx];
    const itemId = await getItemId(itemName);
    insertCols[itemIdx] = "item_id";
    insertValues[itemIdx] = itemId;
  
    const placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO "${insertCols.includes("listing_date") ? "LISTING" : "IN_INVENTORY"}"
                    (${insertCols.join(", ")}) 
                    VALUES (${placeholders}) 
                    RETURNING *`;
    return {query, value: insertValues};
};

export const handleTransactionInsert = async (columns: string[], values: any[]) => {
    const insertCols = [...columns];
    const insertValues = [...values];
  
    const listingIdx = columns.indexOf("listing_id");
    if(listingIdx === -1) {
      throw new Error("Listing ID could not be found");
    }
    const listingId = values[listingIdx];
  
    const sellerIdx = columns.indexOf("seller");
    if(sellerIdx === -1) {
      throw new Error("Seller could not be found");
    }
    const sellerName = values[sellerIdx];
    const sellerId = await getCharacterId(sellerName);
    insertCols[sellerIdx] = "seller_id";
    insertValues[sellerIdx] = sellerId;
  
    const buyerIdx = columns.indexOf("buyer");
    if(buyerIdx === -1) {
      throw new Error("Buyer could not be found");
    }
    const buyerName = values[buyerIdx];
    const buyerId = await getCharacterId(buyerName);
    insertCols[buyerIdx] = "buyer_id";
    insertValues[buyerIdx] = buyerId;
  
    // Check if the seller is on the LISTING table
    const listCheck = `SELECT 1 FROM "LISTING" WHERE character_id = $1 and listing_id = $2`
    const listRes = await pool.query(listCheck, [sellerId, listingId]);
    if(listRes.rowCount === 0) {
      throw new Error(`Seller ${sellerName} is not listed in the LISTING table`);
    }
  
    const placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO "TRANSACTION"
                    (${insertCols.join(", ")}) 
                    VALUES (${placeholders}) 
                    RETURNING *`;
    return {query, value: insertValues};
  };
  
export const handleItemClassInsert = async (tableName: string, columns: string[], values: any[], data: Record<string, any>) => {
    if(tableName === "ITEM") {
      const classesIdx = columns.indexOf("allowed_classes");
      if(classesIdx !== -1) {
        const classes = values[classesIdx];
        const insertClasses = classes.map(async (className) => {
          const classId = await getClassId(className);
          return pool.query(`INSERT INTO "ITEM_CLASS" (item_id, class_id) VALUES ($1, $2)`, [data.item_id, classId]);
        });
        await Promise.all(insertClasses);
      }
    }
};
  
