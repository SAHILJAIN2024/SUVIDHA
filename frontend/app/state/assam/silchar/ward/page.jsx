"use client";

import { useState } from "react";
import WardMap from "@/components/WardMap";

export default function WardPage({ params }) {
  const { stateSlug, districtSlug } = params;

  const [selectedWard, setSelectedWard] = useState(null);

  // 🔥 Ward-wise Service Data (Customize This)
  const wardServiceData = {
    "Group 1": {
      electricity: {
        provider: "APDCL – Silchar Division A",
        helpline: "1912",
      },
      gas: {
        provider: "Indane Gas Agency",
        helpline: "1906",
      },
      municipal: {
        authority: "Silchar Municipal Board",
        officer: "Mr. R. Das",
      },
    },

    "Group 2": {
      electricity: {
        provider: "APDCL – Silchar Division B",
        helpline: "1912",
      },
      gas: {
        provider: "Bharat Gas Distributor",
        helpline: "1906",
      },
      municipal: {
        authority: "Silchar Municipal Board",
        officer: "Ms. P. Sharma",
      },
    },

    "Group 3": {
      electricity: {
        provider: "APDCL – Urban Subdivision",
        helpline: "1912",
      },
      gas: {
        provider: "HP Gas Agency",
        helpline: "1906",
      },
      municipal: {
        authority: "Silchar Municipal Board",
        officer: "Mr. A. Laskar",
      },
    },
  };

  const wardDetails = wardServiceData[selectedWard] || null;

  return (
    <>
      {/* Header */}
      <div className="bg-gray-100 p-4">
        <h1 className="text-2xl font-bold text-blue-800 mb-2">
          Ward Service Dashboard
        </h1>
        <p className="text-black">
          Hover over a ward to view its service authorities.
        </p>
      </div>

      <div className="flex h-[85vh]">
        
        {/* LEFT MAP */}
        <div className="flex-1">
          <WardMap
            stateSlug={stateSlug}
            districtSlug={districtSlug}
            onWardHover={setSelectedWard}
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="w-[350px] bg-white border-l shadow-lg p-6 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {selectedWard || "Hover a Ward"}
          </h2>

          {!wardDetails ? (
            <p className="text-gray-500 text-sm">
              Service details will appear here when you hover a ward.
            </p>
          ) : (
            <>
              {/* Electricity */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="font-semibold text-yellow-600 mb-2">
                  ⚡ Electricity Authority
                </h3>
                <p className="text-sm text-gray-700">
                  {wardDetails.electricity.provider}
                </p>
                <p className="text-sm text-gray-700">
                  Helpline: {wardDetails.electricity.helpline}
                </p>
              </div>

              {/* Gas */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="font-semibold text-red-500 mb-2">
                  🔥 Gas Authority
                </h3>
                <p className="text-sm text-gray-700">
                  {wardDetails.gas.provider}
                </p>
                <p className="text-sm text-gray-700">
                  Helpline: {wardDetails.gas.helpline}
                </p>
              </div>

              {/* Municipal */}
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="font-semibold text-blue-600 mb-2">
                  🏛 Municipal Authority
                </h3>
                <p className="text-sm text-gray-700">
                  {wardDetails.municipal.authority}
                </p>
                <p className="text-sm text-gray-700">
                  Officer: {wardDetails.municipal.officer}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}