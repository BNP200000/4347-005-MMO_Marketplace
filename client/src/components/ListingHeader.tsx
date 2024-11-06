"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

// TODO: Rename this whole file

export default function ListingHeader() {
  const params = useParams<{ listingId: string }>();
  const [characterName, setCharacterName] = useState("bingus");

  // Axios.get or something similar using listingId
  // Communicates with index.ts

  // Study how login works
  // Client side, LoginForm.tsx uses axios.post to send a request with username and password
  // (You could do the same here, but with listingId)
  // Then server side, login.ts has a post that handles the request and returns a response
  // login.ts uses queries pretty directly

  return(
    <Container>
      <Row><Col>
        <h1>Listing #{params.listingId}</h1>
        <h2>Item Info</h2>
      </Col></Row>
      <Row>
        <Col>
          <p>Name: {characterName}</p>
          <p>Category</p>
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
