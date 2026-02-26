"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function IndiaMap() {
  const [geoData, setGeoData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/geo/states.json")
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  const style = () => ({
    color: "black",
    weight: 2,
    fillColor: "#FF9933",
    fillOpacity: 0.6,
  });

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

  const onEachFeature = (feature, layer) => {
    const stateName =
      feature.properties.ST_NM ||
      feature.properties.NAME_1 ||
      feature.properties.state;

    layer.bindTooltip(stateName, {
      permanent: false,
      direction: "center",
    });

    layer.on({
      click: () => {
        const slug = stateName.toLowerCase().replace(/\s+/g, "-");
        router.push(`/state/${slug}`);
      },
    });
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[22.5, 80.5]}
        zoom={5}
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