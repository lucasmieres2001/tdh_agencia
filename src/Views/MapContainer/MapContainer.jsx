
import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px', // ajusta altura a tu diseño
  borderRadius: '12px',
  marginTop: '1rem'
};

export default function MapContainer({ apiKey, location }) {
  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location}
        zoom={16}
      >
        <Marker position={location} />
      </GoogleMap>
    </LoadScript>
  );
}
