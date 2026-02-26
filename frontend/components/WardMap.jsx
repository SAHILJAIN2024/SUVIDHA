"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const GeoJSON = dynamic(
  () => import("react-leaflet").then((mod) => mod.GeoJSON),
  { ssr: false }
);

export default function WardMap({ stateSlug, districtSlug }) {
  const [geoData, setGeoData] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const geoJsonRef = useRef(null);
  const mapRef = useRef(null);
  const router = useRouter();

  // Fetch GeoJSON
  useEffect(() => {
    fetch(`/geo/ward.json`)
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("GeoJSON Load Error:", err));
  }, []);

  // Auto fit
  useEffect(() => {
    if (geoData && geoJsonRef.current && mapRef.current) {
      const bounds = geoJsonRef.current.getBounds();
      mapRef.current.fitBounds(bounds);
    }
  }, [geoData]);

  // Default style
  const defaultStyle = {
    color: "#1E3A8A",
    weight: 3,
    opacity: 1,
    fillColor: "#E3F2FD",   // very light blue
    fillOpacity: 0.4,
  };

  // Highlight style (selected)
  const selectedStyle = {
    color: "#0D47A1",
    weight: 6,
    fillColor: "#BBDEFB",  // light background
    fillOpacity: 0.8,
  };

  const onEachFeature = (feature, layer) => {
    const name =
      feature.properties?.ward ||
      feature.properties?.NAME ||
      feature.properties?.GROUP ||
      "Group";

    // Center label (hidden by default)
    layer.bindTooltip(name, {
      permanent: false,
      direction: "center",
      className: "district-label",
    });

    layer.on({
      click: () => {
        // Reset previous selected
        if (selectedLayer) {
          selectedLayer.setStyle(defaultStyle);
          selectedLayer.closeTooltip();
        }

        // Set new selected
        layer.setStyle(selectedStyle);
        layer.openTooltip();
        layer.bringToFront();
        setSelectedLayer(layer);

        // Optional: navigate
        const slug = name.toLowerCase().replace(/\s+/g, "-");
        router.push(
          `/state/${stateSlug}/district/${districtSlug}/ward/${slug}`
        );
      },
    });
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[24.83, 92.78]}
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geoData && (
          <GeoJSON
            ref={geoJsonRef}
            data={geoData}
            style={() => defaultStyle}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      <style jsx global>{`
        .district-label {
          font-size: 12px;
          font-weight: bold;
          color: #0d47a1;
          background: rgba(255, 255, 255, 0.8);
          padding: 2px 6px;
          border-radius: 4px;
          border: none;
        }
      `}</style>
    </div>
  );
}