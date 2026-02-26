"use client";

import { useEffect, useState, useRef } from "react";
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

export default function StateMap({ stateSlug = "assam" }) {
  const [geoData, setGeoData] = useState(null);
  const geoJsonRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/geo/assam.json")
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  // 🎨 Default Style
  const defaultStyle = {
    color: "#000",
    weight: 2,
    fillColor: "#FF5733",
    fillOpacity: 0.4,
  };

  // 🔥 Hover Highlight (Enlarge Effect)
  const highlightFeature = (e) => {
    const layer = e.target;

    layer.setStyle({
      weight: 6,               // thicker border
      color: "#111",
      fillColor: "#FF8A65",    // lighter orange
      fillOpacity: 0.9,
    });

    layer.bringToFront();
    layer.openTooltip();
  };

  const resetHighlight = (e) => {
    if (geoJsonRef.current) {
      geoJsonRef.current.resetStyle(e.target);
    }
    e.target.closeTooltip();
  };

  // 🏷 Per District Logic
  const onEachFeature = (feature, layer) => {
    const districtName =
      feature.properties.district ||
      feature.properties.NAME_3 ||
      feature.properties.AC_NAME ||
      "Unknown District";

    // Tooltip (Hidden by default, shown on hover)
    layer.bindTooltip(districtName, {
      permanent: false,
      direction: "center",
      className: "district-label",
    });

    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: () => {
        const districtSlug = districtName
          .toLowerCase()
          .replace(/\s+/g, "-");

        router.push(`/state/${stateSlug}/${districtSlug}/ward`);
      },
    });
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[26.2, 92.9]}
        zoom={9}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
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

      {/* ✨ Clean Modern Label */}
      <style jsx global>{`
        .district-label {
          font-size: 14px;
          font-weight: 700;
          color: #000;
          background: rgba(255, 255, 255, 0.95);
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}