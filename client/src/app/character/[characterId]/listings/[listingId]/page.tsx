import { Col, Container, Row } from "react-bootstrap";
import ListingDisplay from "@/components/SingleListingSection";

export default function ListingPage() {
  return (
    <Container>
      <Row>
        <Col>
          <ListingDisplay />
        </Col>
      </Row>
    </Container>
  );
}