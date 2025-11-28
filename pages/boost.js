// pages/boost.js
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Link from "next/link";
import styles from "../styles/Boost.module.css";

export default function BoostPage() {
  return (
    <main>
      <section className={`${styles.hero} text-center py-5 bg-light`}>
        <Container>
          <h1 className="fw-bold display-5">🚀 Boost Your Business</h1>
          <p className="lead text-muted mt-3">
            Get noticed by more customers on <strong>BizHarbor</strong>.  
            Stand out, rank higher, and grow your brand with targeted promotion.
          </p>
          <Button variant="primary" size="lg" className="mt-3">
            Get Started
          </Button>
        </Container>
      </section>

      {/* Pricing Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-4">
            <Col>
              <h2 className="fw-bold">Choose Your Boost Package</h2>
              <p className="text-muted">Flexible plans for every business size.</p>
            </Col>
          </Row>

          <Row className="g-4">
            {/* Basic Plan */}
            <Col md={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="d-flex flex-column">
                  <h4 className="fw-bold">Basic Boost</h4>
                  <p className="text-muted">Perfect for short promotions.</p>
                  <h3 className="fw-bold my-3">$10</h3>
                  <ul className="list-unstyled text-start flex-grow-1">
                    <li>✔ Top of category results (7 days)</li>
                    <li>✔ Highlighted listing</li>
                  </ul>
                  <Button variant="outline-primary" className="mt-3">
                    Boost Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Standard Plan */}
            <Col md={4}>
              <Card className="shadow-lg border-primary h-100">
                <Card.Body className="d-flex flex-column">
                  <h4 className="fw-bold text-primary">Standard Boost</h4>
                  <p className="text-muted">Best for growing businesses.</p>
                  <h3 className="fw-bold my-3">$30</h3>
                  <ul className="list-unstyled text-start flex-grow-1">
                    <li>✔ All Basic features</li>
                    <li>✔ Homepage spotlight (30 days)</li>
                    <li>✔ Featured in Discover</li>
                  </ul>
                  <Button variant="primary" className="mt-3">
                    Boost Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Premium Plan */}
            <Col md={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="d-flex flex-column">
                  <h4 className="fw-bold">Premium Boost</h4>
                  <p className="text-muted">Maximum reach and visibility.</p>
                  <h3 className="fw-bold my-3">$50</h3>
                  <ul className="list-unstyled text-start flex-grow-1">
                    <li>✔ All Standard features</li>
                    <li>✔ Google Ads integration</li>
                    <li>✔ Highlighted in newsletters (60 days)</li>
                  </ul>
                  <Button variant="outline-primary" className="mt-3">
                    Boost Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-4">
            <Col>
              <h2 className="fw-bold">How It Works</h2>
              <p className="text-muted">Boosting your business is quick and simple.</p>
            </Col>
          </Row>
          <Row className="g-4 text-center">
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <h3>1️⃣</h3>
                  <h5 className="fw-bold">Choose Package</h5>
                  <p>Select the plan that fits your needs.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <h3>2️⃣</h3>
                  <h5 className="fw-bold">Secure Payment</h5>
                  <p>Pay easily with card, PayPal, or mobile money.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <h3>3️⃣</h3>
                  <h5 className="fw-bold">Get Boosted</h5>
                  <p>Your business is promoted instantly.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Support */}
      <section className="py-5 text-center">
        <Container>
          <h4>💬 Need Help Choosing a Package?</h4>
          <p className="text-muted">
            Reach out to us anytime at{" "}
            <a href="mailto:support@bizharbor.com" className="text-primary">
              support@bizharbor.com
            </a>
          </p>
          <Link href="/contact" className="btn btn-outline-primary">
            Contact Support
          </Link>
        </Container>
      </section>
    </main>
  );
}
