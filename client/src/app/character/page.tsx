import { Col, Container, Row } from "react-bootstrap";
import style from "./styles.module.css";
import Link from "next/link";

export default function CharacterListingsPage() {
  return (
    <div className={style.col}>
      <h1>Character Listings</h1>
      <Container>
        <Row>
          <Col>
            <p>hello</p>
            <p>this page is temporary</p>
            <p>after you click the link to the right, you can directly change the URL for other characters</p>
          </Col>
          <Col>
            <Link href="/character/1a2b3c456/listings">Click for Listings for Character 1a2b3c456</Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
