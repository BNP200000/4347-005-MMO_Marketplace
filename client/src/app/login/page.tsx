import LoginForm from "@/components/LoginForm";
import { Col, Container, Row } from "react-bootstrap";

export default function LoginPage() {
  return (
    <Container>
      <Row>
        <Col>
          <LoginForm />
        </Col>
      </Row>
    </Container>
  );
}
