"use client";

import { useEffect, useState } from "react";
import { Property } from "@/types";
import { Building } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";

interface PropertyMapProps {
  properties: Property[];
}

interface MapProperty extends Property {
  lat?: number;
  lng?: number;
}

export default function PropertyMap({ properties }: PropertyMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const mapProperties = properties as MapProperty[];

  const validProperties = mapProperties.filter(
    (p) => typeof p.lat === 'number' && typeof p.lng === 'number'
  );

  const center: [number, number] = validProperties.length > 0
    ? [validProperties[0].lat as number, validProperties[0].lng as number]
    : [23.8103, 90.4125];

  return (
    <div className="w-full h-150 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg flex flex-col items-center justify-start p-6">
      <div className="flex flex-row items-center justify-center gap-3 mb-2">
        <h3 className="text-2xl font-bold text-slate-800">Interactive Map View</h3>
        <div className="bg-sky-100 p-2 rounded-full">
          <Building className="h-6 w-6 text-sky-600" />
        </div>
      </div>
      <p className="text-slate-500 text-center max-w-md mb-6">
        Showing {properties.length} properties on the map. Explore locations and neighborhood stats interactively.
      </p>

      <div className="w-full h-112.5 rounded-2xl overflow-hidden border border-slate-200">
        <MapContainer center={center} zoom={12} scrollWheelZoom={true} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {validProperties.map((p) => (
            <Marker key={p.id} position={[p.lat as number, p.lng as number]} icon={defaultIcon}>
              <Popup>
                <div className="flex flex-col gap-2 w-48">
                  <img src={p.image || "/placeholder.jpg"} alt={p.title} className="w-full h-24 object-cover rounded-lg" />
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">{p.title}</h4>
                  <p className="text-xs text-sky-600 font-semibold">${p.price}/month</p>
                  <p className="text-xs text-slate-500 truncate">{p.location}</p>
                  <Link href={`/properties/${p.id}`} className="text-xs bg-sky-500 text-white text-center py-1 rounded-md mt-1">
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}