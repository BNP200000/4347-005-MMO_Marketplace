"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";
import { Col, Container, Row, Form, Button } from "react-bootstrap";

const PORT = process.env.PORT || 5001;

// TODO: Rename this whole file

export default function ListingHeader() {
  const params = useParams<{ listingId: string }>();
  const [listingId, setListingId] = useState(params.listingId);
  const [characterName, setCharacterName] = useState("bingus");
  const [category, setCategory] = useState("");

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
      setCharacterName(res.data.listing.character_id);
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
          <p>Rarity</p>
          <p>Price</p>
          <p>Allowed Classes</p>
        </Col>
        <Col>
          <p>funny image here later</p>
        </Col>
      </Row>
    </Container>
  );
}
