import { Carousel, Container, Button } from 'react-bootstrap';
import Link from 'next/link';

export default function CarouselHome() {
  return (
    <div className="bg-dark">
      <Container className="py-4">
        <Carousel>
          <Carousel.Item>
            <img className="d-block w-100" alt="slide1"
                 src="/images/BOD_room.jpg" />
            <Carousel.Caption>
              <h3>Showcase your business</h3>
              <p>Register and get discovered.</p>
              <Link href="/register" className="btn btn-primary">Get Started</Link>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" alt="slide2"
                 src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1600&auto=format&fit=crop" />
            <Carousel.Caption>
              <h3>Search with filters</h3>
              <p>Category, name, and more.</p>
              <Link href="#businesses" className="btn btn-outline-light">Explore</Link>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" alt="slide3"
                 src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop" />
            <Carousel.Caption>
              <h3>Map coordinates</h3>
              <p>Click the map or type lat/lng.</p>
              <Link href="/register" className="btn btn-primary">Join Now</Link>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </Container>
    </div>
  );
}
