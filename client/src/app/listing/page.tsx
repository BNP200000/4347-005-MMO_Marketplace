import { Col, Container, Row } from "react-bootstrap";
import style from "./styles.module.css";
import Link from "next/link";

export default function ListingsPage() {
  return (
    <div className={style.col}>
      <h1>Listings</h1>
      <Container>
        <Row>
          <Col>
            <p>hello</p>
          </Col>
          <Col>
            <Link href="/listing/1">Click for Listing 1</Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
