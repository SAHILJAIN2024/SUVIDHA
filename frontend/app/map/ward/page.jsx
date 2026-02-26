import WardMap from "@/components/WardMap";

export default function WardPage({ params }) {
  return (
    <WardMap
      stateSlug={params.state}
      districtSlug={params.district}
    />
  );
}