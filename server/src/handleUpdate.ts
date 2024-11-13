import pool from "./dbConfig";
import {getUserId, getCharacterId, getClassId, getLeaderId, getItemId, getCategoryId, getRarityId} from "./getId";

export const handleListingUpdate = async (columns: string[], values: any[]) => {
    const insertCols = [...columns];
    const insertValues = [...values];

    const listingIdx = columns.indexOf("listing_id");
    if(listingIdx === -1) {
        throw new Error("listing_id is required for update");
    }   
    const listingId = insertValues[listingIdx];

    insertCols.forEach((col, idx) => {
        if(insertValues[idx] === null || insertValues[idx] === undefined) {
            insertCols.splice(idx, 1);
            insertValues.splice(idx, 1);
        }
    });

    if(insertCols.length === 1 && insertCols[0] === "listing_id") {
        throw new Error("No field to update. At least one value other than listing_id must be provided");
    }

    console.log(`COLUMNS: ${insertCols}`);
    console.log(`VALUES: ${insertValues}`);

    const itemIdx = insertCols.indexOf("item_name");
    if(itemIdx !== -1) {
        const itemName = insertValues[itemIdx];
        const itemId = await getItemId(itemName);
        insertCols[itemIdx] = "item_id";
        insertValues[itemIdx] = itemId;
    }

    


    insertCols.shift();
    insertValues.shift();

    const clause = insertCols
                    .map((col, i) => `"${col}" = $${i + 1}`)
                    .join(", ");    
    insertValues.push(listingId);
    
    const query = `UPDATE "LISTING"
                    SET ${clause}
                    WHERE "listing_id" = $${insertValues.length}
                    RETURNING *`;

    return {query, value: insertValues};
};