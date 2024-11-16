import { Col, Container, Row } from "react-bootstrap";
import SingleCharacterSection from "@/components/UserCharactersPage";

export default function UserCharactersPage() {
  return (
    <Container>
      <Row>
        <Col>
          <UserCharacterPage />
        </Col>
      </Row>
    </Container>
  );
}