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

  // Axios.get or something similar using listingId
  // Communicates with index.ts

  // Study how login works
  // Client side, LoginForm.tsx uses axios.post to send a request with username and password
  // (You could do the same here, but with listingId)
  // Then server side, login.ts has a post that handles the request and returns a response
  // login.ts uses queries pretty directly

  /*useEffect(() => {
  async function grabCrud (){*/
  const importInfo = async (/*e: React.FormEvent*/) => {
    // e.preventDefault();

  try {
    const res = await axios.post(`http://localhost:${PORT}/listing`, {
      listingId
    });
    // Check for error message in response
    if (res.data.error) {
      // setError(res.data.error);
      setCharacterName(res.data.error);
      return res.data.error;
    } else {
      // Set login data in the cookie
      // setLoginCookie({ username, password });
      // Redirect to the home page
      // router.push("/");
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

/*}
grabCrud();
}, []);*/

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
