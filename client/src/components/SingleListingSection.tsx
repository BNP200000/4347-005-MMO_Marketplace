"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";
import { Col, Container, Row, Alert, Card } from "react-bootstrap";
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

export default function SingleListingSection() {
  const params = useParams<{ listingId: string }>();
  const [listingId, setListingId] = useState(params.listingId);
  const [error, setError] = useState<string | null>(null);
  // Info to be displayed on the page
  const [name, setName] = useState("Item");
  const [category, setCategory] = useState("");
  const [rarity, setRarity] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [allowedClasses, setAllowedClasses] = useState("");

  const [image, setImage] = useState(DefaultImage);

  const importInfo = async () => {

  try {
    const res = await axios.get(`http://localhost:${PORT}/listing`, {
      params: {listingId}
    });
    // Check for error message in response
    if (res.data.error) {
      setError(res.data.error);
    // No error
    } else {
      // Set the page's displayed info
      setName(res.data.listing.item_name);
      setCategory(res.data.listing.item_category);
      setRarity(res.data.listing.item_rarity);
      setQuantity(res.data.listing.quantity);
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
    setError("An error occurred. Please try again.");
    setImage(UnknownImage);
  }
};

importInfo();

  return(
    <Container><Row><Col>
      {error && <Alert variant="danger">{error}</Alert>}
      <h1>Listing #{params.listingId}</h1>
      <Card style={{ width: '70%' }}>
        <Card.Body className="d-flex justify-content-between align-items-center">
          <Col><div>
            <h4>{name}</h4>
            <p>Category: {category}</p>
            <p>Rarity: {rarity}</p>
            <p>Quantity: {quantity}</p>
            <p>Unit price: {price} gold</p>
            <p>Allowed classes: {allowedClasses}</p>
          </div></Col>
          <Col md="auto">
            <Image
              src={image}
              alt="Item"
              width={220}
              height={220}
              quality={100}
              className="d-inline-block align-center"
              style={{objectFit: "contain", marginLeft: "1.25rem", marginRight: "1.25rem"}}
            />
          </Col>
        </Card.Body>
      </Card>
    </Col></Row></Container>
  );
}
