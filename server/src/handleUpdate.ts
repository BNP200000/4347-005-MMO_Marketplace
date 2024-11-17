import {getUserId, getCharacterId, getClassId, getLeaderId, getItemId, getCategoryId, getRarityId} from "./getId";

export const handleListingUpdate = async (columns: string[], values: any[]) => {
    const insertCols = [...columns];
    const insertValues = [...values];

    const listingIdx = columns.indexOf("listing_id");
    if(listingIdx === -1) {
        throw new Error("listing_id is required for update");
    }   
    const listingId = insertValues[listingIdx];

    const filteredData = insertCols.reduce(
        (acc: { cols: string[]; values: any[]}, col, idx) => {
            if(insertValues[idx] !== null && insertValues[idx] !== undefined) {
                acc.cols.push(col);
                acc.values.push(insertValues[idx]);
            }
            return acc;
        },
        {cols:[], values:[]}
    );

    const updatedCols = filteredData.cols;
    const updatedValues = filteredData.values;

    if(updatedCols.length === 1 && updatedCols[0] === "listing_id") {
        throw new Error("No field to update. At least one value other than listing_id must be provided");
    }

    const itemIdx = updatedCols.indexOf("item_name");
    if(itemIdx !== -1) {
        const itemName = updatedValues[itemIdx];
        const itemId = await getItemId(itemName);
        updatedCols[itemIdx] = "item_id";
        updatedValues[itemIdx] = itemId;
    }

    const clause = updatedCols
                    .map((col, i) => `"${col}" = $${i + 1}`)
                    .join(", ");    
    updatedValues.push(listingId);
    
    const query = `UPDATE "LISTING"
                    SET ${clause}
                    WHERE "listing_id" = $${updatedValues.length}
                    RETURNING *`;

    return {query, value: updatedValues};
};

