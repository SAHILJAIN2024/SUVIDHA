"use client";

import { useEffect, useState } from "react";
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
  const router = useRouter();

  useEffect(() => {
    fetch("/geo/assam.json")
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  // 🎨 Styling
  const style = () => ({
    color: "black",        // Border color
    weight: 3,             // Bold boundary
    fillColor: "#FF5733",  // District fill
    fillOpacity: 0.6,
  });

  // 🔥 Highlight on hover
  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 4,
      color: "#000",
      fillOpacity: 0.8,
    });
  };

  const resetHighlight = (e) => {
    e.target.setStyle(style());
  };

  // 🏷 Show district name
  const onEachFeature = (feature, layer) => {
    const districtName =
      feature.properties.district ||
      feature.properties.NAME_3 ||
      feature.properties.AC_NAME ||
      "Unknown District";

    // Permanent label on map
    layer.bindTooltip(districtName, {
      permanent: true,
      direction: "center",
      className: "district-label",
    });

    layer.on({
  click: () => {
    const districtSlug = districtName
      .toLowerCase()
      .replace(/\s+/g, "-");

    const stateSlug = "assam"; // since you are loading assam.json

    router.push(
  `/state/${stateSlug}/${districtSlug}/ward`
);
  },
});
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[26.2, 92.9]} // Assam center
        zoom={8}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geoData && (
          <GeoJSON
            data={geoData}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      {/* Label Styling */}
      <style jsx global>{`
        .district-label {
          font-size: 10px;
          font-weight: bold;
          color: black;
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
}