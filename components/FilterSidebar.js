import { Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';

export default function FilterSidebar({ value, onChange }) {
  const [name, setName] = useState(value.name || '');
  const [category, setCategory] = useState(value.category || '');
  const [location, setLocation] = useState(value.location || ''); // new state for location

  useEffect(() => {
    setName(value.name || '');
    setCategory(value.category || '');
    setLocation(value.location || '');
  }, [value]);

  const apply = (e) => {
    e.preventDefault();
    onChange({ name, category, location }); // include location
  };

  const clear = () => onChange({ name: '', category: '', location: '' });

  return (
    <Form onSubmit={apply} className="border rounded p-3">
      <Form.Group className="mb-3">
        <Form.Label>Search by name</Form.Label>
        <Form.Control
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Pizza"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
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
      </Form.Group>

      {/* New Location Filter */}
      <Form.Group className="mb-3">
        <Form.Label>Location</Form.Label>
        <Form.Control
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter country or town"
        />
      </Form.Group>

      <div className="d-flex gap-2">
        <Button type="submit">Apply</Button>
        <Button variant="outline-secondary" type="button" onClick={clear}>
          Clear
        </Button>
      </div>
    </Form>
  );
}
