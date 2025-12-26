'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface TrackingMapProps {
  pickup?: [number, number];
  delivery?: [number, number];
  trackingLogs?: Array<{ lat: number; lng: number }>;
}

export default function TrackingMap({ pickup, delivery, trackingLogs = [] }: TrackingMapProps) {
  // Default center (Dhaka, Bangladesh)
  const defaultCenter: [number, number] = [23.8103, 90.4125];

  const center = pickup || delivery || defaultCenter;

  // Create custom icons
  const pickupIcon = new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const deliveryIcon = new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {pickup && (
          <Marker position={pickup} icon={pickupIcon}>
            <Popup>Pickup Location</Popup>
          </Marker>
        )}

        {delivery && (
          <Marker position={delivery} icon={deliveryIcon}>
            <Popup>Delivery Location</Popup>
          </Marker>
        )}

        {trackingLogs.length > 0 && (
          <>
            <Polyline
              positions={trackingLogs.map(log => [log.lat, log.lng])}
              color="blue"
              weight={3}
              opacity={0.7}
            />
            {trackingLogs.map((log, index) => (
              <Marker key={index} position={[log.lat, log.lng]}>
                <Popup>Location Update {index + 1}</Popup>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
}
