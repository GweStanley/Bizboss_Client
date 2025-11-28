import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="bg-light mt-5">
      <Container className="py-4">
        <Row>
          <Col md={4}><strong>BizHarbor</strong><div>Find & manage businesses.</div></Col>
          <Col md={4}><div>Contact: support@bizharbor.app</div></Col>
          <Col md={4}><div>© {new Date().getFullYear()} BizHarbor</div></Col>
        </Row>
      </Container>
    </footer>
  );
}
