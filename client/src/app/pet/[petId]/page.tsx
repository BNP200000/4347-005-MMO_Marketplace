import { Col, Container, Row } from "react-bootstrap";
import PetHeader from "@/components/PetHeader";

export default function PetPage() {
  return (
    <Container>
      <Row>
        <Col>
          <PetHeader />
        </Col>
      </Row>
      <Row>
        <Col>
          <p>hi there</p>
        </Col>
        <Col>
          <p>hello</p>
        </Col>
      </Row>
    </Container>
  );
}
