import Link from 'next/link';
import { Card, Button } from 'react-bootstrap';

export default function BusinessCard({ business }) {
  const BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

  // Always resolve first image from backend uploads
  const raw = business.images?.[0] || '';
  const img = raw.startsWith('http')
    ? raw
    : raw
      ? `${BASE}${raw.startsWith('/') ? '' : '/'}${raw}`
      : null; // no placeholder

  return (
    <Card className="h-100 shadow-sm">
      {img && (
        <Card.Img
          variant="top"
          src={img}
          alt={business.name}
          style={{ height: 180, objectFit: 'cover' }}
        />
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Title>{business.name}</Card.Title>
        <Card.Text className="text-muted mb-2">{business.category}</Card.Text>
        <div className="mt-auto d-flex gap-2">
          <Link href={`/business/${business._id}`} className="btn btn-outline-primary btn-sm">
            View
          </Link>
          {business.whatsappLink && (
            <Button
              size="sm"
              as="a"
              href={business.whatsappLink}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
