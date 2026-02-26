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

export default function WardMap({ stateSlug, districtSlug }) {
  const [geoData, setGeoData] = useState(null);
  const router = useRouter();
  useEffect(() => {
    fetch(`/geo/${stateSlug}/${districtSlug}-wards.json`)
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, [stateSlug, districtSlug]);

  const style = () => ({
    color: "black",
    weight: 1,
    fillColor: "#FF9800",
    fillOpacity: 0.7,
  });

  const onEachFeature = (feature, layer) => {
    const wardName =
      feature.properties.ward ||
      feature.properties.NAME ||
      feature.properties.name;

    layer.bindTooltip(wardName, {
      permanent: true,
      direction: "center",
    });
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[26.2, 92.9]}
        zoom={11}
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
    </div>
  );
}