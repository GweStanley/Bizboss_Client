import { useState } from 'react';
import Link from 'next/link';
import { Navbar as BsNavbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState(false);

  return (
    <BsNavbar
      bg="light"
      expand="lg"
      className="shadow-sm"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container>
        <Link href="/" className="navbar-brand" onClick={() => setExpanded(false)}>
          BizHarbor
        </Link>
        <BsNavbar.Toggle aria-controls="main-nav" />
        <BsNavbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Link className="nav-link" href="/" onClick={() => setExpanded(false)}>
              Home
            </Link>
            <Nav.Link href="#businesses" onClick={() => setExpanded(false)}>
              Discover
            </Nav.Link>
                        <Nav.Link href="/help" onClick={() => setExpanded(false)}>
              Help
            </Nav.Link>

            {user && (
              <Link
                className="nav-link"
                href="/dashboard"
                onClick={() => setExpanded(false)}
              >
                Dashboard
              </Link>
            )}
          </Nav>
          <Nav>
            {!user ? (
              <>
                <Link className="nav-link" href="/login" onClick={() => setExpanded(false)}>
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn btn-primary ms-2"
                  onClick={() => setExpanded(false)}
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <span className="navbar-text me-2">Hi, {user.name}</span>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    logout();
                    setExpanded(false);
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}
