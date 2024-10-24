"use client"; // this is important

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Container, Button } from "react-bootstrap";
import DummyComponent from "./DummyComponent";

export default function Demo() {
  const [message, setMessage] = useState("");
  const [err, setError] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:5001/")
      .then((res) => setMessage(res.data))
      .catch((err) => {
        console.error(err);
        setError(err);
      });
  }, []);

  return (
    <div
      style={{
        padding: "24px",
        display: "flex",
        gap: "16px",
        flexDirection: "column",
      }}
    >
      <h5 style={{ color: err ? "red" : message ? "green" : "black" }}>
        {err
          ? "Backend server not running! Please start it."
          : message
          ? `The message from Backend is: "${message}"`
          : "Asking backend for message..."}
      </h5>
      <h5>Now for some demo components..</h5>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Container>
        <Row>
          <Col>1 of 2</Col>
          <Col>2 of 2</Col>
          <Col>3 of 3</Col>
          <Col>4 of 4</Col>
        </Row>
      </Container>
      <DummyComponent />
    </div>
  );
}
