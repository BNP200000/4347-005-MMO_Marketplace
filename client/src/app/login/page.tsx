import LoginForm from "@/components/LoginForm";
import { Col, Container, Row } from "react-bootstrap";

export default function LoginPage() {
  return (
    <Container>
      <Row>
        <Col>
          <h1>Login Page</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <LoginForm />
        </Col>
      </Row>
    </Container>
  );
}
