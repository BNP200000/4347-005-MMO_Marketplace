const express = require("express");
import { Request, Response } from "express";
import pool from "./dbConfig";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const listingid = req.body.listingId;

  if (!listingid) {
    return res
      .status(400)
      .json({ error: "Listing ID required." });
  }

  try {
    // Fetch the listing and other required attributes from the database
    const result = await pool.query(
      `SELECT
        L.listing_id,
        I.item_name,
        IC.item_category,
        IR.item_rarity,
        L.sale_price,
        STRING_AGG(C.class_name, ', ') AS allowed_classes
      FROM "LISTING" as L
        LEFT JOIN "ITEM" AS I ON L.item_id = I.item_id
        LEFT JOIN "ITEM_CATEGORY" AS IC ON I.category_id = IC.category_id
        LEFT JOIN "ITEM_RARITY" AS IR ON I.rarity_id = IR.rarity_id
        LEFT JOIN "ITEM_CLASS" AS IT ON I.item_id = IT.item_id
        LEFT JOIN "CLASS" AS C ON IT.class_id = C.class_id
      WHERE L.listing_id = $1
      GROUP BY
        L.listing_id,
        I.item_name,
        IC.item_category,
        IR.item_rarity,
        L.sale_price;
      `,
      [listingid]
    );

    // If no listing was found, return an error
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid listing ID." });
    }

    const listing = result.rows[0];

    // Compare the provided password with the stored hashed password
    /*const isMatch = password == user.password;
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password." });
    }*/

    // Listing was found, return all of its info
    // (Not all info may be necessary- reviwe this part)
    // (You might want to send a token instead for a real-world application)
    res.json({
      listing: {
        item_name: listing.item_name,
        item_category: listing.item_category,
        item_rarity: listing.item_rarity,
        sale_price: listing.sale_price,
        item_allowed_classes: listing.allowed_classes,
      },
    });

    // Authentication successful, return the user information
    // (You might want to send a token instead for a real-world application)
    /*res.json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        account_type: user.account_type,
        has_free_chat: user.has_free_chat,
        has_safe_chat: user.has_safe_chat,
        has_safe_server_access: user.has_safe_server_access,
      },
    });*/
  } catch (error) {
    console.error("Error while checking listing:", error);
    res.status(500).json({ error: "An error occurred when viewing a listing." });
  }
});

module.exports = router;
