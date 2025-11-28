import Head from 'next/head';
import { Container, Row, Col } from 'react-bootstrap';
import CarouselHome from '../components/CarouselHome';
import { useEffect, useState } from 'react';
import api from '../services/api';
import BusinessCard from '../components/BusinessCard';
import FilterSidebar from '../components/FilterSidebar';
import { getPublicBase } from '../utils/url'; // ensures backend URL is prepended

export default function Home() {
  const [filters, setFilters] = useState({ name: '', category: '' });
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const base = getPublicBase(); // backend URL

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const params = new URLSearchParams();
        if (filters.name) params.set('name', filters.name);
        if (filters.category) params.set('category', filters.category);

        const path = `/businesses?${params.toString()}`;
        const res = await api.get(path);

        // ensure images always have backend URL
        const businessesWithFullUrls = (res.data || []).map(b => {
          if (Array.isArray(b.images)) {
            b.images = b.images.map(img =>
              img.startsWith('http') ? img : `${base}${img.startsWith('/') ? '' : '/'}${img}`
            );
          }
          return b;
        });

        setBusinesses(businessesWithFullUrls);
      } catch (err) {
        console.error('Failed to load businesses', err);
        setErrorMsg('Failed to load businesses. See console for details.');
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters, base]);

  return (
    <>
      <Head>
        <title>BizHarbor — Find & Manage Businesses</title>
        <meta name="description" content="BizBoss - register and discover local businesses" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <CarouselHome />

        {/* Registered Businesses Section */}
        <Container id="businesses" className="my-5">
          <h2 className="mb-4">Registered Businesses</h2>
          <Row>
            <Col md={3}>
              <FilterSidebar value={filters} onChange={setFilters} />
            </Col>

            <Col md={9}>
              {loading && <p>Loading businesses…</p>}
              {errorMsg && <div className="alert alert-warning">{errorMsg}</div>}

              <Row>
                {!loading && businesses.length === 0 && !errorMsg && (
                  <Col>
                    <p>No businesses found.</p>
                  </Col>
                )}

                {!loading && businesses.map((b) => (
                  <Col md={6} lg={4} className="mb-4" key={b._id}>
                    <BusinessCard business={b} />
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
}
