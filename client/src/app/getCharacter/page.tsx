'use client';
import { Col, Container, Row } from "react-bootstrap";
import  UserCharactersPage from "@/components/UserCharactersPage";

export default function CharactersPage() {
  return (
    <Container>
      <Row>
        <Col>
          <UserCharactersPage /> {/* Render the component */}
        </Col>
      </Row>
    </Container>
  );
}