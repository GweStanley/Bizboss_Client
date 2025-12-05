import { useEffect, useState } from 'react';
import { Container, Button, Table, Image } from 'react-bootstrap';
import Link from 'next/link';
import api, { buildUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import '../styles/responsive-table.css';


export default function Dashboard() {
  const { user, token, ensureAuthed } = useAuth();
  const [rows, setRows] = useState([]);
  const router = useRouter();

  useEffect(() => { ensureAuthed(); }, [ensureAuthed]);

  useEffect(() => {
    const loadBusinesses = async () => {
      if (!user) return;
      const userId = user._id || user.id;
      if (!userId) return;

      try {
        const res = await api.get(buildUrl(`businesses?ownerId=${encodeURIComponent(userId)}`), {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setRows(res.data || []);
      } catch (err) {
        console.error('Load businesses failed', err);
        toast.error('Failed to load businesses.');
      }
    };

    loadBusinesses();
  }, [user, token]);

  const onDelete = async (id) => {
    if (!confirm('Delete this business?')) return;

    try {
      const res = await api.delete(buildUrl(`businesses/${id}`), {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (res.status === 200) {
        setRows(prev => prev.filter(b => b._id !== id));
        toast.success('Business deleted successfully');
      } else {
        toast.error('Delete failed');
      }
    } catch (err) {
      console.error('Delete failed', err.response?.data || err);
      toast.error(err.response?.data?.msg || 'Delete failed');
    }
  };

  // Utility: resolve image URL from backend uploads
  const resolveUrl = (src) => {
    if (!src) return ''; // no local placeholder
    if (src.startsWith('http')) return src;
    const base = process.env.NEXT_PUBLIC_API_BASE || 'https://bizzboss-server.onrender.com';
    return `${base.replace(/\/$/, '')}${src.startsWith('/') ? '' : '/'}${src}`;
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Your Businesses</h3>
        <Link href="/dashboard/add" className="btn btn-primary">Add Business</Link>
      </div>

<Table responsive bordered hover className="responsive-table">
  <thead>
    <tr>
      <th>Image</th>
      <th>Name</th>
      <th>Category</th>
      <th>Created</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {rows.length ? rows.map(b => (
      <tr key={b._id}>
        <td className="cell-image" data-label="Image" style={{ width: 100 }}>
          {b.images?.length ? (
            <Image
              src={resolveUrl(b.images[0])}
              alt={b.name}
              thumbnail
              style={{ maxWidth: 80, maxHeight: 80, objectFit: 'cover' }}
            />
          ) : (
            <span>No image</span>
          )}
        </td>
        <td data-label="Name">{b.name}</td>
        <td data-label="Category">{b.category}</td>
        <td data-label="Created">{new Date(b.createdAt).toLocaleString()}</td>
        <td className="cell-actions d-flex flex-wrap gap-2" data-label="Actions">
          <Link href={`/dashboard/${b._id}/edit`} className="btn btn-sm btn-outline-secondary">Edit</Link>
          <Button size="sm" variant="outline-danger" onClick={() => onDelete(b._id)}>Delete</Button>
          <Link href={`/business/${b._id}`} className="btn btn-sm btn-outline-primary">View</Link>
          <Link href={`/boost`} className="btn btn-sm btn-outline-primary">Boost</Link>
        </td>
      </tr>
    )) : (
      <tr>
        <td colSpan={5} className="text-center">No businesses yet.</td>
      </tr>
    )}
  </tbody>
</Table>
    </Container>
  );
}
