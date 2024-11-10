"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";
import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";

import PlaceholderImage from "../app/placehold_item_image.png";
import ConsumableImage from "../app/temp_consumable_item.png";
import WeaponImage from "../app/temp_weapon_item.png";
import ArmorImage from "../app/temp_armor_item.png";
import AccessoryImage from "../app/temp_accessory_item.png";
import ShieldImage from "../app/temp_shield_item.png";
import HeadgearImage from "../app/temp_headgear_item.png";

const PORT = process.env.PORT || 5001;

// TODO: Rename this whole file

export default function ListingHeader() {
  const params = useParams<{ listingId: string }>();
  const [listingId, setListingId] = useState(params.listingId);
  const [characterName, setCharacterName] = useState("William");
  const [category, setCategory] = useState("");
  const [rarity, setRarity] = useState("");
  const [price, setPrice] = useState("");
  const [allowedClasses, setAllowedClasses] = useState(""); // Should maybe be something besides a string?

  const importInfo = async () => {

  try {
    const res = await axios.post(`http://localhost:${PORT}/listing`, {
      listingId
    });
    // Check for error message in response
    if (res.data.error) {
      // Setting character name as a terrible type of debugging
      setCharacterName(res.data.error);
      return res.data.error;
    } else {
      // setCharacterName(res.data.listing.character_id);
      return res.data.listing;
    }
  } catch {
    // setError("An error occurred. Please try again.");
    // setCategory("catch");
  } finally {
    // setLoading(false);
    // setCharacterName(res.data.listing.character_id);
    // setCharacterName("finally");
  }

};

importInfo();

  return(
    <Container>
      <Row><Col>
        <h1>Listing #{params.listingId}</h1>
        <h2>Item Info</h2>
      </Col></Row>
      <Row>
        <Col>
          <p>Name: {characterName}</p>
          <p>Category: {category}</p>
          <p>Rarity: {rarity}</p>
          <p>Price: {price}</p>
          <p>Allowed Classes: {allowedClasses}</p>
        </Col>
        <Col>
          <Image
            src={PlaceholderImage}
            alt="Item"
            width={200}
            height={200}
            quality={100}
            className="d-inline-block align-top"
            style={{objectFit: "contain", marginRight: "0.75rem"}}
          />
        </Col>
      </Row>
    </Container>
  );
}
