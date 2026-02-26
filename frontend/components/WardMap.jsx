"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";

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

export default function WardMap({ stateSlug, districtSlug, onWardHover }) {
  const [geoData, setGeoData] = useState(null);
  const geoJsonRef = useRef(null);
  const mapRef = useRef(null);

  // Fetch GeoJSON
  useEffect(() => {
    fetch(`/geo/ward.json`)
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("GeoJSON Load Error:", err));
  }, []);

  // Auto fit bounds
  useEffect(() => {
    if (geoData && geoJsonRef.current && mapRef.current) {
      const bounds = geoJsonRef.current.getBounds();
      mapRef.current.fitBounds(bounds);
    }
  }, [geoData]);

  // 🎨 Default Style
  const defaultStyle = {
    color: "#1E3A8A",
    weight: 2,
    opacity: 1,
    fillColor: "#E3F2FD",
    fillOpacity: 0.4,
  };

  // 🔥 Hover Style (Enlarged Look)
  const hoverStyle = {
    color: "#0D47A1",
    weight: 6,                 // thicker border
    fillColor: "#90CAF9",      // brighter blue
    fillOpacity: 0.9,
  };

  const highlightFeature = (e, name) => {
    const layer = e.target;

    layer.setStyle(hoverStyle);
    layer.bringToFront();
    layer.openTooltip();

    // Send ward name to parent (right panel)
    if (onWardHover) {
      onWardHover(name);
    }
  };

  const resetHighlight = (e) => {
    if (geoJsonRef.current) {
      geoJsonRef.current.resetStyle(e.target);
    }
    e.target.closeTooltip();
  };

  const onEachFeature = (feature, layer) => {
    const name =
      feature.properties?.ward ||
      feature.properties?.NAME ||
      feature.properties?.GROUP ||
      "Group";

    // Tooltip (hidden until hover)
    layer.bindTooltip(name, {
      permanent: false,
      direction: "center",
      className: "ward-label",
    });

    layer.on({
      mouseover: (e) => highlightFeature(e, name),
      mouseout: resetHighlight,
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

      {/* Enhanced Tooltip Styling */}
      <style jsx global>{`
        .ward-label {
          font-size: 14px;
          font-weight: 700;
          color: #0d47a1;
          background: rgba(255, 255, 255, 0.95);
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}