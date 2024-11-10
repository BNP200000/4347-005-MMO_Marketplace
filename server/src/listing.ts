const express = require("express");
import { Request, Response } from "express";
import pool from "./dbConfig";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const listingid = req.body.listingId;

  if (!listingid) {
    console.log("fuck");
    return res
      .status(400)
      .json({ error: "Listing ID required." });
  }

  try {
    // Fetch the listing and other required attributes from the database
    const result = await pool.query(
      `SELECT * FROM "LISTING" WHERE listing_id = $1`,
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
        listing_id: listing.listing_id,
        character_id: listing.character_id,
        item_id: listing.item_id,
        quantity: listing.quantity,
        listing_date: listing.listing_date,
        is_active: listing.is_active,
        sale_price: listing.sale_price,
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
