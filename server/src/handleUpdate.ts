import pool from "./dbConfig";
import {getUserId, getCharacterId, getClassId, getLeaderId, getItemId, getCategoryId, getRarityId} from "./getId";

export const handleListingUpdate = async (columns: string[], values: any[]) => {
    const insertCols = [...columns];
    const insertValues = [...values];

    const itemIdx = columns.indexOf("item_name");
    if(itemIdx !== -1) {
        const itemName = insertValues[itemIdx];
        
        try {
            const itemId = await getItemId(itemName);
            insertCols[itemIdx] = "item_id";
            insertValues[itemIdx] = itemId;
        } catch(error) {
            throw new Error(`Error fetching item_id: ${error}`);
        }
    }

    const listingIdx = columns.indexOf("listing_id");
    if(listingIdx === -1) {
        throw new Error("listing_id is required for update");
    }   
    const listingId = insertValues[listingIdx];


    insertCols.shift();
    const clause = insertCols
                    .map((col, i) => `"${col}" = $${i + 1}`)
                    .join(", ");

    insertValues.shift();
    insertValues.push(listingId);
    

    
    const query = `UPDATE "LISTING"
                    SET ${clause}
                    WHERE "listing_id" = $${insertValues.length}
                    RETURNING *`;

    return {query, value: insertValues};
}