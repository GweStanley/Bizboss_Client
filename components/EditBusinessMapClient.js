import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import React from 'react';

// Handles clicking on map to update position
function ClickToSet({ setPos }) {
  useMapEvents({
    click(e) {
      setPos([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

// Client-only Leaflet map
export default function EditBusinessMapClient({ position, setPos }) {
  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position} />
      <ClickToSet setPos={setPos} />
    </MapContainer>
  );
}
