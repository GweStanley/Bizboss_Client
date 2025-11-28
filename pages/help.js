// pages/help.js
import { Container, Row, Col, Card, Accordion } from "react-bootstrap";
import Link from "next/link";
import styles from "../styles/Help.module.css";

export default function HelpPage() {
  return (
    <main>
      <Container className="py-5">
        <Row className={styles["help-heading"]}>
          <Col>
            <h1>Help & Support</h1>
            <p>Everything you need to know about using <strong>BizHarbor</strong></p>
          </Col>
        </Row>

        {/* Getting Started */}
        <Row className="mb-4">
          <Col md={{ span: 8, offset: 2 }}>
            <Card className={`${styles["card-help"]} shadow-sm`}>
              <Card.Body>
                <h3 className="h5 fw-bold">🚀 Getting Started</h3>
                <p>
                  <strong>Sign Up:</strong> Click{" "}
                  <Link href="/register" className="text-primary">
                    Get Started
                  </Link>{" "}
                  to create a free account.
                </p>
                <p>
                  <strong>Login:</strong> Already have an account? Use{" "}
                  <Link href="/login" className="text-primary">
                    Login
                  </Link>{" "}
                  with your email and password.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Accordion for FAQs */}
        <Row className="mb-5">
          <Col md={{ span: 8, offset: 2 }}>
            <Accordion defaultActiveKey="0" alwaysOpen>
              <Accordion.Item eventKey="0">
                <Accordion.Header className={styles["accordion-button"]}>🏢 Browsing Businesses</Accordion.Header>
                <Accordion.Body>
                  - Use <strong>Discover</strong> to explore businesses by category or location. <br />
                  - Search & filter by category (Food, Services, Tech, etc.). <br />
                  - Click <strong>View on Map</strong> on a business to open Google Maps directions.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1">
                <Accordion.Header className={styles["accordion-button"]}>➕ Adding Your Business</Accordion.Header>
                <Accordion.Body>
                  1. Go to your <strong>Dashboard</strong>. <br />
                  2. Click <strong>Add Business</strong>. <br />
                  3. Enter details: name, category, contact info, and location. <br />
                  4. Save to publish instantly.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2">
                <Accordion.Header className={styles["accordion-button"]}>👤 Managing Your Dashboard</Accordion.Header>
                <Accordion.Body>
                  - See and edit your listed businesses. <br />
                  - Update info anytime. <br />
                  - Delete listings that are no longer active.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="3">
                <Accordion.Header className={styles["accordion-button"]}>🔐 Account & Security</Accordion.Header>
                <Accordion.Body>
                  - Update profile info in <strong>Profile Settings</strong>. <br />
                  - Logout using the top-right menu. <br />
                  - Forgot password? Use{" "}
                  <Link href="/forgot-password" className="text-primary">
                    Forgot Password
                  </Link>{" "}
                  to reset.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="4">
                <Accordion.Header className={styles["accordion-button"]}>❓ FAQs</Accordion.Header>
                <Accordion.Body>
                  <p>
                    <strong>Is BizHarbor free?</strong> Yes, browsing and adding businesses are free.
                  </p>
                  <p>
                    <strong>How do I update my business location?</strong> Go to Dashboard → Edit Business → Update Location.
                  </p>
                  <p>
                    <strong>Can I delete my account?</strong> Contact support to remove your account permanently.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>

        {/* Contact Section */}
        <Row>
          <Col md={{ span: 8, offset: 2 }} className={styles["contact-section"]}>
            <h4>📩 Need More Help?</h4>
            <p>Reach us anytime at{" "}
              <a href="mailto:pathfinderlabs1@gmail.com" className="text-primary">
                support@bizharbor.com
              </a>
            </p>
            <Link href="/contact" className="btn btn-primary">
              Contact Form
            </Link>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
