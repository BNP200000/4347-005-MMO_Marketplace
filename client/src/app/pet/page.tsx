import { Col, Container, Row } from "react-bootstrap";
import style from "./styles.module.css";
import Link from "next/link";

export default function PetsPage() {
  return (
    <div className={style.col}>
      <h1>Pets</h1>
      <Container>
        <Row>
          <Col>
            <p>hi there</p>
          </Col>
          <Col>
            <p>hello</p>
          </Col>
          <Col>
            <Link href="/pet/12345">Click to go to Pet#12345 Page</Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
