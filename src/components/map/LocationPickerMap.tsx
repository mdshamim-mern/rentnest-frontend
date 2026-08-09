"use client";

import { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerMapProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function LocationPickerMap({ initialLat, initialLng, onLocationSelect }: LocationPickerMapProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const markerRef = useRef<L.Marker>(null);

  const defaultCenter: L.LatLngExpression = [23.7937, 90.4066]; 

  useEffect(() => {
    if (initialLat && initialLng) {
      setPosition(new L.LatLng(initialLat, initialLng));
    } else {
       setPosition(new L.LatLng(23.7937, 90.4066));
       onLocationSelect(23.7937, 90.4066);
    }
  }, [initialLat, initialLng]);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setPosition(newPos);
          onLocationSelect(newPos.lat, newPos.lng);
        }
      },
    }),
    [onLocationSelect],
  );

  function MapEvents() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  if (typeof window === 'undefined' || !position) {
    return <div className="h-75 w-full bg-slate-100 animate-pulse rounded-xl" />;
  }

  return (
    <div className="h-87.5 w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer center={position || defaultCenter} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && (
          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
          />
        )}
        <MapEvents />
      </MapContainer>
      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold text-slate-700 shadow-sm border border-slate-200 z-1000 pointer-events-none">
        Drag the marker to pinpoint the exact location
      </div>
    </div>
  );
}