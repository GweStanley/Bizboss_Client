import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import dynamic from 'next/dynamic';

// SSR-safe Leaflet imports
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });

export default function BusinessDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [business, setBusiness] = useState(null);
  const [position, setPosition] = useState([4.0511, 9.7679]); // Default: Douala

  // Convert backend paths to full URLs
  const resolveUrl = (src) => {
    if (!src) return '';
    if (src.startsWith('http')) return src;
    const base = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000').replace(/\/api$/, '');
    return `${base}${src.startsWith('/') ? '' : '/'}${src}`;
  };

  // Open Google Maps with directions from user location
  const openDirections = () => {
    if (!business?.location?.coordinates) return;

    const [lng, lat] = business.location.coordinates;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const origin = `${pos.coords.latitude},${pos.coords.longitude}`;
          const destination = `${lat},${lng}`;
          const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
          window.open(url, '_blank');
        },
        (err) => {
          console.warn('Geolocation failed, opening directions without origin.', err);
          const destination = `${lat},${lng}`;
          const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
          window.open(url, '_blank');
        }
      );
    } else {
      // Fallback if geolocation not supported
      const destination = `${lat},${lng}`;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    if (!id) return;

    const loadBusiness = async () => {
      try {
        const res = await api.get(`/businesses/${id}`);
        const b = res.data;
        setBusiness(b);

        if (b?.location?.coordinates?.length === 2) {
          const [lng, lat] = b.location.coordinates;
          setPosition([lat, lng]);
        }
      } catch (err) {
        console.error('Failed to load business:', err);
      }
    };

    loadBusiness();
  }, [id]);

  if (!business) return <Container className="py-5">Loading...</Container>;

  return (
    <Container className="py-4">
      <Row>
        {/* Left: Images + Details */}
        <Col md={7}>
          <Card className="mb-3 p-3">
            {business.images?.length ? (
              <Carousel>
                {business.images.map((src, i) => {
                  const url = resolveUrl(src);
                  return (
                    <Carousel.Item key={i}>
                      {url && (
                        <img
                          className="d-block w-100"
                          style={{ maxHeight: 420, objectFit: 'cover' }}
                          src={url}
                          alt={`Business Image ${i + 1}`}
                        />
                      )}
                    </Carousel.Item>
                  );
                })}
              </Carousel>
            ) : (
              <p>No images available</p>
            )}

            <h3 className="mt-3">{business.name}</h3>
            <p className="text-muted">{business.category}</p>
            <p>{business.description}</p>

            <div className="d-flex gap-3 flex-wrap">
              {business.phone && <span>📞 {business.phone}</span>}
              {business.email && <span>✉️ {business.email}</span>}
              {business.website && (
                <a href={business.website} target="_blank" rel="noreferrer">🌐 Website</a>
              )}
            </div>

            <div className="mt-3 d-flex gap-2 flex-wrap">
              {business.whatsappLink && (
                <Button as="a" href={business.whatsappLink} target="_blank" rel="noreferrer">
                  Chat on WhatsApp
                </Button>
              )}
              <Button variant="success" onClick={openDirections}>
                Get Directions
              </Button>
            </div>
          </Card>
        </Col>

        {/* Right: Map */}
        <Col md={5}>
          <Card className="p-3">
            <h5>Location</h5>
            <div style={{ height: 320 }}>
              {typeof window !== 'undefined' && (
                <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={position} />
                </MapContainer>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
