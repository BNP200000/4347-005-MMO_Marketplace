"use client";
import { useParams, useRouter} from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Col, Container, Row, Alert, Card, Button } from "react-bootstrap";
import Image from "next/image";

import UpdateListingModal from "./UpdateListingModal"; // Import the modal

// import DefaultImage from "../app/item_images/placehold_item_image.png";
import EmptyImage from "../app/item_images/empty_item.png"
import ConsumableImage from "../app/item_images/consumable_item.png";
import WeaponImage from "../app/item_images/weapon_item.png";
import ArmorImage from "../app/item_images/armor_item.png";
import AccessoryImage from "../app/item_images/accessory_item.png";
import AccessoryBleeboImage from "../app/item_images/accessory_bleebo.png"
import ShieldImage from "../app/item_images/shield_item.png";
import HeadgearImage from "../app/item_images/headgear_item.png";
import UnknownImage from "../app/item_images/unknown_item.png";

const PORT = process.env.PORT || 5001;

// Define the correct type for the listing
type ListingType = {
  item_name?: string;
  item_category?: string;
  item_rarity?: string;
  quantity?: number; // Now properly typed as number
  sale_price?: number; // Now properly typed as number
  item_allowed_classes?: string;
};

export default function SingleListingSection() {
  const params = useParams<{ characterId: string, listingId: string }>();
  const router = useRouter();
  const [listingId, setListingId] = useState(params.listingId);
  const [error, setError] = useState<string | null>(null);

  // Use the new type for the `listing` state
  const [listing, setListing] = useState<ListingType>({
    item_name: "Item",
    item_category: "",
    item_rarity: "",
    quantity: undefined, // Start with undefined
    sale_price: undefined, // Start with undefined
    item_allowed_classes: "",
  });

  const [image, setImage] = useState(EmptyImage);
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  // Fetch the listing data and ensure types are correct
  const fetchListing = async () => {
    try {
      const res = await axios.get(`http://localhost:${PORT}/listing`, {
        params: { listingId },
      });

      if (res.data.error) {
        setError(res.data.error);
      } else {
        const data = res.data.listing;
        setListing({
          item_name: data.item_name,
          item_category: data.item_category,
          item_rarity: data.item_rarity,
          quantity: Number(data.quantity), // Convert to number
          sale_price: Number(data.sale_price), // Convert to number
          item_allowed_classes: data.item_allowed_classes,
        });

        // Set the image based on category
        switch (data.item_category) {
          case "Consumable":
            setImage(ConsumableImage);
            break;
          case "Weapon":
            setImage(WeaponImage);
            break;
          case "Armor":
            setImage(ArmorImage);
            break;
          case "Accessory":
            // 1 in 10 chance to display the necklace that Bleebo's soul was trapped in
            if (Math.floor(Math.random() * 10.0) == 0)
            { setImage(AccessoryBleeboImage); }
            else { setImage(AccessoryImage); }
            break;
          case "Shield":
            setImage(ShieldImage);
            break;
          case "Headgear":
            setImage(HeadgearImage);
            break;
          default:
            setImage(UnknownImage);
        }
      }
    } catch {
      setError("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    fetchListing();
  }, [listingId]);

  // Handle updating the listing
  const handleUpdateListing = async (listingId: string, updatedFields: { [key: string]: any }) => {
    updatedFields["listing_id"] = Number(listingId);    
    
    try {
      const res = await axios.put(`http://localhost:${PORT}/table/LISTING`, 
        updatedFields);
      setListing((prevListing) => ({
        ...prevListing,
        ...updatedFields
      }));
      fetchListing();
    } catch(err) {
      console.log(err);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    axios
      .delete(`http://localhost:${PORT}/table/LISTING`, {
        data: {listing_id: Number(listingId)}
      })
      .then((res) => {
        router.push(`http://localhost:3000/character/${params.characterId}/listings`);
      })
      .catch((err) => {
        setError(err);
      });
  };

  return (
    <Container>
      <Row>
        <Col>
          {error && <Alert variant="danger">{error}</Alert>}
          <h1>Listing #{listingId}</h1>
          <Card style={{ width: "70%" }}>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <Col>
                <div>
                  <h4>{listing.item_name}</h4>
                  <p>Category: {listing.item_category}</p>
                  <p>Rarity: {listing.item_rarity}</p>
                  <p>Quantity: {listing.quantity}</p>
                  <p>Unit price: {listing.sale_price} gold</p>
                  <p>Allowed classes: {listing.item_allowed_classes}</p>
                </div>
              </Col>
              <Col md="auto">
                <Image
                  src={image}
                  alt="Item"
                  width={220}
                  height={220}
                  quality={100}
                  className="d-inline-block align-center"
                  style={{ objectFit: "contain", marginLeft: "1.25rem", marginRight: "1.25rem" }}
                />
              </Col>
            </Card.Body>
          </Card>
          {/* Buttons Row */}
          <Row className="mt-3 justify-content-start">
            <Col xs="auto">
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Update
              </Button>
            </Col>
            <Col xs="auto">
              <Button variant="primary" onClick={() => handleDeleteListing(listingId)}>Delete</Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Update Listing Modal */}
      <UpdateListingModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onUpdateListing={handleUpdateListing}
        listingId={listingId}
        initialValues={listing} // Pass the listing state
      />
    </Container>
  );
}
