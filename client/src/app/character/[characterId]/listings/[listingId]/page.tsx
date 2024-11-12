import { Col, Container, Row } from "react-bootstrap";
import ListingHeader from "@/components/ListingHeader";

export default function ListingPage() {
  return (
    <Container>
      <Row>
        <Col>
          <ListingHeader />
        </Col>
      </Row>
    </Container>
  );
}