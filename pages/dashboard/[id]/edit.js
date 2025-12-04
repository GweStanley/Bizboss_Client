import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Card, Form, Button, Row, Col, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

const BusinessMap = dynamic(() => import("../../../components/BusinessMapClient"), {
  ssr: false,
});

export default function EditBusiness() {
  const router = useRouter();
  const { id } = router.query;
  const { token, ensureAuthed } = useAuth();

  const [loading, setLoading] = useState(true);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [pos, setPos] = useState([4.0511, 9.7679]);

  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    ensureAuthed();
  }, []);

  // FETCH BUSINESS
  useEffect(() => {
    if (!id || !token) return;

    const loadData = async () => {
      try {
        const res = await api.get(`/businesses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const b = res.data;

        // Fill the form
        reset({
          name: b.name,
          category: b.category,
          description: b.description,
          phone: b.phone,
          email: b.email,
          website: b.website,
          whatsappPhone: "",
          lat: b.location?.coordinates[1],
          lng: b.location?.coordinates[0],
        });

        setPos([b.location?.coordinates[1], b.location?.coordinates[0]]);
        setExistingImages(b.images || []);

      } catch (err) {
        toast.error("Could not load business");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, token, reset]);

  const onImages = (e) => {
    const max = 3 - existingImages.length;
    const selected = Array.from(e.target.files).slice(0, max);
    setNewImages((prev) => [...prev, ...selected]);
  };

  const removeNewImage = (i) =>
    setNewImages((prev) => prev.filter((_, index) => index !== i));

  const removeExistingImage = (img) =>
    setExistingImages((prev) => prev.filter((x) => x !== img));

  const onSubmit = async (data) => {
    try {
      const fd = new FormData();
      fd.append("name", data.name);
      fd.append("category", data.category);
      fd.append("description", data.description);
      fd.append("phone", data.phone || "");
      fd.append("email", data.email || "");
      fd.append("website", data.website || "");

      fd.append("imagesToKeep", JSON.stringify(existingImages));

      const loc = {
        type: "Point",
        coordinates: [Number(data.lng), Number(data.lat)],
      };
      fd.append("location", JSON.stringify(loc));

      newImages.forEach((f) => fd.append("images", f));

      await api.put(`/businesses/${id}`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Business updated successfully!");
      router.push("/dashboard");

    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return <p style={{ padding: 50 }}>Loading…</p>;

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm">
        <h3>Edit Business</h3>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="g-3">

            <Col md={6}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control {...register("name")} />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Control {...register("category")} />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} {...register("description")} />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control {...register("phone")} />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control {...register("email")} />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Website</Form.Label>
                <Form.Control {...register("website")} />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Latitude</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  {...register("lat")}
                  onChange={(e) =>
                    setPos([Number(e.target.value), pos[1]])
                  }
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Longitude</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  {...register("lng")}
                  onChange={(e) =>
                    setPos([pos[0], Number(e.target.value)])
                  }
                />
              </Form.Group>
            </Col>

            <Col md={12} style={{ height: 300 }}>
              <BusinessMap position={pos} setPos={setPos} />
            </Col>

            <Col md={12}>
              <Form.Label>Existing Images</Form.Label>
              <div className="d-flex gap-3 flex-wrap">
                {existingImages.map((img, i) => (
                  <div key={i} className="position-relative">
                    <Image
                      src={img}
                      alt=""
                      thumbnail
                      style={{ width: 120, height: 120, objectFit: "cover" }}
                    />
                    <Button
                      size="sm"
                      variant="danger"
                      className="position-absolute top-0 end-0"
                      onClick={() => removeExistingImage(img)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Upload New Images</Form.Label>
                <Form.Control type="file" multiple accept="image/*" onChange={onImages} />
              </Form.Group>
            </Col>

            <Col md={12}>
              <div className="d-flex gap-3 flex-wrap">
                {newImages.map((f, i) => (
                  <div key={i} className="position-relative">
                    <Image
                      src={URL.createObjectURL(f)}
                      thumbnail
                      style={{ width: 120, height: 120, objectFit: "cover" }}
                    />
                    <Button
                      size="sm"
                      variant="danger"
                      className="position-absolute top-0 end-0"
                      onClick={() => removeNewImage(i)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </Col>

            <Col md={12}>
              <Button type="submit">Save Changes</Button>
            </Col>

          </Row>
        </Form>
      </Card>
    </Container>
  );
}
