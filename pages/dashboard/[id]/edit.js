import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Image } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { toWaLink, stripPhone } from '../../../utils/helpers';
import { getPublicBase } from '../../../utils/url';

// Client-only map
const EditBusinessMap = dynamic(
  () => import('../../../components/EditBusinessMapClient'),
  { ssr: false }
);

// Zod schema
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
  lng: z.coerce.number()
});

export default function EditBusiness() {
  const { token, ensureAuthed } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  const [pos, setPos] = useState([4.0511, 9.7679]);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) });

  // Ensure auth
  useEffect(() => { ensureAuthed(); }, []);

  // Load business data
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await api.get(`/businesses/${id}`);
        const b = res.data;

        const coords = b?.location?.coordinates;
        const lat = typeof coords?.[1] === 'number' ? coords[1] : 4.0511;
        const lng = typeof coords?.[0] === 'number' ? coords[0] : 9.7679;

        setPos([lat, lng]);
        setExistingImages(b.images || []);

        reset({
          name: b.name || '',
          category: b.category || '',
          description: b.description || '',
          phone: b.phone || '',
          email: b.email || '',
          website: b.website || '',
          whatsappPhone: '',
          whatsappLink: b.whatsappLink || '',
          lat,
          lng
        });
      } catch (err) {
        console.error('Failed to load business', err);
        toast.error(err?.response?.data?.msg || 'Failed to load business');
      }
    };
    load();
  }, [id, reset]);

  // Sync map → form fields
  useEffect(() => {
    setValue('lat', pos[0]);
    setValue('lng', pos[1]);
  }, [pos, setValue]);

  // File picker
  const onFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 3) selected.length = 3;
    setNewFiles(selected);
  };

  // Submit updated business
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

      if (newFiles.length) newFiles.forEach(f => fd.append('images', f));

      await api.put(`/businesses/${id}`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Updated');
      router.push('/dashboard');

    } catch (e) {
      console.error('Update failed', e);
      toast.error(e?.response?.data?.msg || 'Update failed');
    }
  };

  const publicBase = getPublicBase();

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm">
        <h3 className="mb-3">Edit Business</h3>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="g-3">

            {/* Name */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control {...register("name")} isInvalid={!!errors.name} />
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Category */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Control {...register("category")} isInvalid={!!errors.category} />
                <Form.Control.Feedback type="invalid">{errors.category?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Description */}
            <Col md={12}>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={4} {...register("description")} isInvalid={!!errors.description} />
                <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Phone */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control {...register("phone")} />
              </Form.Group>
            </Col>

            {/* Email */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control {...register("email")} isInvalid={!!errors.email} />
                <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Website */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Website</Form.Label>
                <Form.Control {...register("website")} isInvalid={!!errors.website} />
                <Form.Control.Feedback type="invalid">{errors.website?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* WhatsApp Phone */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>WhatsApp Phone</Form.Label>
                <Form.Control {...register("whatsappPhone")} />
              </Form.Group>
            </Col>

            {/* WhatsApp Link */}
            <Col md={12}>
              <Form.Group>
                <Form.Label>WhatsApp Link (optional)</Form.Label>
                <Form.Control {...register("whatsappLink")} />
              </Form.Group>
            </Col>

            {/* Map */}
            <Col md={12} className="mb-3">
              <div style={{ height: 320 }}>
                <EditBusinessMap position={pos} setPos={setPos} />
              </div>
            </Col>

            {/* Images */}
            <Col md={12}>
              <Form.Group className="mb-2">
                <Form.Label>Replace Images (max 3)</Form.Label>
                <Form.Control type="file" multiple accept="image/*" onChange={onFiles} />
              </Form.Group>

              <div className="d-flex gap-3 flex-wrap">
                {existingImages.map((src, i) => {
                  const full = src.startsWith('http')
                    ? src
                    : `${publicBase}${src.startsWith('/') ? '' : '/'}${src}`;
                  return (
                    <div key={i} className="position-relative">
                      <Image
                        src={full}
                        alt=""
                        thumbnail
                        style={{ width: 120, height: 120, objectFit: 'cover' }}
                      />
                    </div>
                  );
                })}

                {newFiles.map((f, i) => (
                  <Image
                    key={`new-${i}`}
                    src={URL.createObjectURL(f)}
                    alt="new"
                    thumbnail
                    style={{ width: 120, height: 120, objectFit: 'cover' }}
                  />
                ))}
              </div>
            </Col>

            <Col md={12} className="mt-2">
              <Button type="submit" disabled={isSubmitting}>Save Changes</Button>
            </Col>

          </Row>
        </Form>
      </Card>
    </Container>
  );
}
