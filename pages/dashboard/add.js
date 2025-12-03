// client/pages/dashboard/add.js
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Image } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { toWaLink, stripPhone } from '../../utils/helpers';

// Validation schema
const schema = z.object({
  name: z.string().min(3),
  category: z.string().min(2),
  description: z.string().min(10),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  whatsappPhone: z.string().optional(),
  whatsappLink: z.string().url().optional().or(z.literal('')),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
});

// Client-only Map component
const BusinessMap = dynamic(
  () =>
    import('../../components/BusinessMapClient').then((mod) => mod.BusinessMapClient),
  { ssr: false }
);

export default function AddBusiness() {
  const { token, ensureAuthed } = useAuth();
  const [pos, setPos] = useState([4.0511, 9.7679]); // Default Douala
  const [files, setFiles] = useState([]);

  useEffect(() => { ensureAuthed(); }, []);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } =
    useForm({
      resolver: zodResolver(schema),
      defaultValues: { lat: pos[0], lng: pos[1] },
    });

  useEffect(() => {
    setValue('lat', pos[0]);
    setValue('lng', pos[1]);
  }, [pos, setValue]);

  const onFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length + files.length > 3) {
      toast.warn('Max 3 images allowed');
      return;
    }
    setFiles(prev => [...prev, ...selected.slice(0, 3 - prev.length)]);
  };

  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const onSubmit = async (data) => {
    try {
      const fd = new FormData();
      fd.append('name', data.name);
      fd.append('category', data.category);
      fd.append('description', data.description);
      if (data.phone) fd.append('phone', data.phone);
      if (data.email) fd.append('email', data.email);
      if (data.website) fd.append('website', data.website);

      const explicit = (data.whatsappLink || '').trim();
      const derived = data.whatsappPhone ? toWaLink(stripPhone(data.whatsappPhone)) : '';
      fd.append('whatsappLink', explicit || derived || '');

      const loc = { type: 'Point', coordinates: [Number(data.lng), Number(data.lat)] };
      fd.append('location', JSON.stringify(loc));

      files.forEach(f => fd.append('images', f));

      await api.post('/businesses', fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Business created successfully!');
      window.location.href = '/dashboard';
    } catch (e) {
      toast.error(e?.response?.data?.msg || 'Create failed');
    }
  };

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm">
        <h3 className="mb-3">Add Business</h3>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="g-3">

            {/* Name & Category */}
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control {...register('name')} isInvalid={!!errors.name} />
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Category</Form.Label>
                <Form.Select {...register('category')} isInvalid={!!errors.category}>
                  <option value="">Select a category</option>
                    <option value="Restaurant">Restaurant / Cafe</option>
                    <option value="Grocery">Grocery / Supermarket</option>
                    <option value="Clothing">Clothing / Fashion</option>
                    <option value="Electronics">Electronics / Gadgets</option>
                    <option value="Health">Health / Pharmacy</option>
                    <option value="Fitness">Fitness / Gym</option>
                    <option value="Salon">Beauty / Salon</option>
                    <option value="Education">Education / Training</option>
                    <option value="Finance">Finance / Banking</option>
                    <option value="Real Estate">Real Estate / Property</option>
                    <option value="Automotive">Automotive / Car Services</option>
                    <option value="Travel">Travel / Tourism</option>
                    <option value="Entertainment">Entertainment / Leisure</option>
                    <option value="IT">IT / Software / Tech</option>
                    <option value="Home Services">Home Services / Repairs</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Legal">Legal / Consulting</option>
                    <option value="Logistics">Logistics / Delivery</option>
                    <option value="Arts & Crafts">Arts & Crafts</option>
                    <option value="Other">Other</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.category?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Description */}
            <Col md={12}>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} {...register('description')} isInvalid={!!errors.description} />
                <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Phone & Email */}
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Phone</Form.Label>
                <Form.Control {...register('phone')} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control {...register('email')} isInvalid={!!errors.email} />
                <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Website & WhatsApp */}
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Website</Form.Label>
                <Form.Control {...register('website')} isInvalid={!!errors.website} />
                <Form.Control.Feedback type="invalid">{errors.website?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>WhatsApp Phone</Form.Label>
                <Form.Control {...register('whatsappPhone')} />
              </Form.Group>
            </Col>

            {/* Coordinates */}
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Latitude</Form.Label>
                <Form.Control
                  type="number" step="any"
                  {...register('lat', { valueAsNumber: true })}
                  onChange={(e) => setPos([Number(e.target.value), pos[1]])}
                  isInvalid={!!errors.lat}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Longitude</Form.Label>
                <Form.Control
                  type="number" step="any"
                  {...register('lng', { valueAsNumber: true })}
                  onChange={(e) => setPos([pos[0], Number(e.target.value)])}
                  isInvalid={!!errors.lng}
                />
              </Form.Group>
            </Col>

            {/* Map */}
            <Col md={12} style={{ height: 320 }}>
              <BusinessMap position={pos} setPos={setPos} />
              <small className="text-muted">Click on the map to set coordinates.</small>
            </Col>

            {/* Images */}
            <Col md={12}>
              <Form.Group className="mb-2">
                <Form.Label>Images (max 3)</Form.Label>
                <Form.Control type="file" multiple accept="image/*" onChange={onFiles} />
              </Form.Group>
              <div className="d-flex gap-3 flex-wrap">
                {files.map((f, i) => (
                  <div key={i} className="position-relative">
                    <Image
                      src={URL.createObjectURL(f)}
                      alt="preview"
                      thumbnail
                      style={{ width: 120, height: 120, objectFit: 'cover' }}
                    />
                    <Button
                      size="sm"
                      variant="danger"
                      className="position-absolute top-0 end-0"
                      onClick={() => removeFile(i)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </Col>

            {/* Submit */}
            <Col md={12} className="mt-2">
              <Button type="submit" disabled={isSubmitting}>Create</Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  );
}
