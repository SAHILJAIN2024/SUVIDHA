"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
    center: [number, number];
    markers: {
        lat: number;
        lng: number;
        label: string;
        complaints: number;
        status: string;
    }[];
    onMarkerClick?: (label: string) => void;
}

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center);
    return null;
}

export default function InteractiveMap({ center, markers, onMarkerClick }: MapProps) {
    return (
        <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={false}
            className="h-full w-full rounded-2xl z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ChangeView center={center} />
            {markers.map((marker, idx) => (
                <Marker
                    key={idx}
                    position={[marker.lat, marker.lng]}
                    eventHandlers={{
                        click: () => onMarkerClick?.(marker.label),
                    }}
                >
                    <Popup>
                        <div className="p-1">
                            <h3 className="font-bold text-sm mb-1">{marker.label}</h3>
                            <p className="text-xs text-slate-600 mb-1">{marker.complaints} active complaints</p>
                            <div className="flex items-center gap-1.5 mt-2">
                                <span className={`w-2 h-2 rounded-full ${marker.status === 'high' ? 'bg-red-500' : marker.status === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
                                <span className="text-[10px] uppercase font-bold text-slate-500">{marker.status} Priority Area</span>
                            </div>
                        </div>
                    </Popup>
                    {/* Simulated Geofencing Circle */}
                    <Circle
                        center={[marker.lat, marker.lng]}
                        radius={500}
                        pathOptions={{
                            color: marker.status === 'high' ? '#ef4444' : marker.status === 'medium' ? '#f59e0b' : '#10b981',
                            fillColor: marker.status === 'high' ? '#ef4444' : marker.status === 'medium' ? '#f59e0b' : '#10b981',
                            fillOpacity: 0.1,
                            weight: 1
                        }}
                    />
                </Marker>
            ))}
        </MapContainer>
    );
}
