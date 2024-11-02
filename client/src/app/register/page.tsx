import RegisterForm from "@/components/RegisterForm";
import { Col, Container, Row } from "react-bootstrap";

export default function LoginPage() {
  return (
    <Container>
      <Row>
        <Col>
          <RegisterForm />
        </Col>
      </Row>
    </Container>
  );
}
