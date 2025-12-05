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
                 src="/images/bussiness_discovery.jpg" />
            <Carousel.Caption>
              <h3>Search with filters</h3>
              <p>Category, name, and more.</p>
              <Link href="#businesses" className="btn btn-outline-secondary">Find Business or Service</Link>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" alt="slide3"
                 src="/images/registration.jpg" />
            <Carousel.Caption>
              <h3>Register Your Business with Map coordinates to Give Customer Google map Directions</h3>
              <p>Click the map or type lat/lng.</p>
              <Link href="/help" className="btn btn-primary">See Help</Link>
            </Carousel.Caption>
          </Carousel.Item>
                    <Carousel.Item>
            <img className="d-block w-100" alt="slide3"
                 src="\images\hands-pc.jpg" />
            <Carousel.Caption>
              <h3>Boost Your Business To Get Seen By More Potential Customers</h3>
              <p>Your Business will be listed first in your category and ran on google ads</p>
              <Link href="/help" className="btn btn-primary">Learn More</Link>
            </Carousel.Caption>
          </Carousel.Item>

        </Carousel>
      </Container>
    </div>
  );
}
