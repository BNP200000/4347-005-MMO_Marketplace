"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";
import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";

import DefaultImage from "../app/item_images/placehold_item_image.png";
import ConsumableImage from "../app/item_images/temp_consumable_item.png";
import WeaponImage from "../app/item_images/temp_weapon_item.png";
import ArmorImage from "../app/item_images/temp_armor_item.png";
import AccessoryImage from "../app/item_images/temp_accessory_item.png";
import ShieldImage from "../app/item_images/temp_shield_item.png";
import HeadgearImage from "../app/item_images/temp_headgear_item.png";
import UnknownImage from "../app/item_images/temp_unknown_item.png";

const PORT = process.env.PORT || 5001;

// TODO: Rename this whole file

export default function ListingHeader() {
  const params = useParams<{ listingId: string }>();
  const [listingId, setListingId] = useState(params.listingId);
  // Info to be displayed on the page
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [rarity, setRarity] = useState("");
  const [price, setPrice] = useState("");
  const [allowedClasses, setAllowedClasses] = useState("");

  const [image, setImage] = useState(DefaultImage);

  const importInfo = async () => {

  try {
    const res = await axios.get(`http://localhost:${PORT}/listing`, {
      params: {listingId}
    });
    // Check for error message in response
    // TODO note: for some reason, an invalid listing ID doesn't return res.data.error but instead leads to a catch
    // I thought it might be because of status 401 but seemingly not? idk
    if (res.data.error) {
      // Setting item name as a terrible type of debugging
      // Will change this to implement an actual error display
      setName(res.data.error);
      return res.data.error;
    // No error
    } else {
      // Set the page's displayed info
      setName(res.data.listing.item_name);
      setCategory(res.data.listing.item_category);
      setRarity(res.data.listing.item_rarity);
      setPrice(res.data.listing.sale_price);
      setAllowedClasses(res.data.listing.item_allowed_classes);

      // Set the image
      switch(res.data.listing.item_category) {
      case "Consumable":
        setImage(ConsumableImage); break;
      case "Weapon":
        setImage(WeaponImage); break;
      case "Armor":
        setImage(ArmorImage); break;
      case "Accessory":
        setImage(AccessoryImage); break;
      case "Shield":
        setImage(ShieldImage); break;
      case "Headgear":
        setImage(HeadgearImage); break;
      default:
        setImage(UnknownImage);
      }

      return res.data.listing;
    }
  } catch {
    // setError("An error occurred. Please try again.");
    setImage(UnknownImage);
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
          <p>Name: {name}</p>
          <p>Category: {category}</p>
          <p>Rarity: {rarity}</p>
          <p>Listed price: {price}</p>
          <p>Allowed Classes: {allowedClasses}</p>
        </Col>
        <Col>
          <Image
            src={image}
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
