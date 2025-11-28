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

// Dynamic import client-only map (SSR disabled)
const EditBusinessMap = dynamic(
  () => import('../../../components/EditBusinessMapClient'),
  { ssr: false }
);

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

  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(schema) });

  useEffect(() => { ensureAuthed(); }, [ensureAuthed]);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const res = await api.get(buildPath(`/businesses/${id}`));
        const b = res.data;

        const coords = b?.location?.coordinates;
        const lng = coords?.[0];
        const lat = coords?.[1];
        const usedLat = (typeof lat === 'number') ? lat : 4.0511;
        const usedLng = (typeof lng === 'number') ? lng : 9.7679;

        setPos([usedLat, usedLng]);
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
          lat: usedLat,
          lng: usedLng
        });
      } catch (err) {
        console.error('Failed to load business', err);
        toast.error(err?.response?.data?.msg || 'Failed to load business');
      }
    };
    load();
  }, [id, reset]);

  useEffect(() => {
    setValue('lat', pos[0]);
    setValue('lng', pos[1]);
  }, [pos, setValue]);

  function buildPath(path) {
    if (!path) return path;
    if (path.startsWith('http')) return path;
    return path.startsWith('/') ? path : `/${path}`;
  }

  const onFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 3) selected.length = 3;
    setNewFiles(selected);
  };

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

      await api.put(buildPath(`/businesses/${id}`), fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
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
            {/* Form fields omitted for brevity, keep your existing code */}

            {/* Map Section */}
            <Col md={12} className="mb-3">
              <div style={{ height: 320 }}>
                <EditBusinessMap position={pos} setPos={setPos} />
              </div>
            </Col>

            {/* Image Upload & Preview */}
            <Col md={12}>
              <Form.Group className="mb-2">
                <Form.Label>Replace Images (max 3)</Form.Label>
                <Form.Control type="file" multiple accept="image/*" onChange={onFiles} />
              </Form.Group>

              <div className="d-flex gap-3 flex-wrap">
                {existingImages.map((src, i) => {
                  const imgUrl = src && src.startsWith('http') ? src : `${publicBase}${src.startsWith('/') ? '' : '/'}${src}`;
                  return (
                    <div key={i} className="position-relative">
                      <Image src={imgUrl} alt="existing" thumbnail style={{ width: 120, height: 120, objectFit: 'cover' }} />
                    </div>
                  );
                })}

                {newFiles.map((f, i) => (
                  <Image key={`new-${i}`} src={URL.createObjectURL(f)} alt="new" thumbnail style={{ width: 120, height: 120, objectFit: 'cover' }} />
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
