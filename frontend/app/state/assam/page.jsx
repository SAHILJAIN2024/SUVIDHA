import StateMap from "@/components/StateMap";

export default function Home() {
  return (
    <>
      {/* Header Section */}
      <div className="bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4 text-blue-800">
          Assam State Map
        </h1>

        <p className="text-black mb-4">
          Zoom in and explore the districts of Assam. Click on a district to
          see more details about its sectional service distribution.
        </p>

        <p className="text-black mb-4">
          This interactive map allows you to visualize the geographical
          distribution of various data points across the state.
        </p>
      </div>

      {/* Map + Right Panel Layout */}
      <div className="flex h-[85vh]">
        
        {/* LEFT - MAP */}
        <div className="flex-1">
          <StateMap />
        </div>

        {/* RIGHT - INFO PANEL */}
        <div className="w-[350px] bg-white border-l shadow-lg p-6 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Assam State Services
          </h2>

          {/* Electricity */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
            <h3 className="font-semibold text-yellow-600 mb-2">
              ⚡ Electricity
            </h3>
            <p className="text-sm text-gray-700">
              <b>Distribution Company:</b> APDCL
            </p>
            <p className="text-sm text-gray-700">
              <b>Regions distributed:</b> Lower Assam, Upper Assam, Central Assam
            </p>
            <p className="text-sm text-gray-700">
             <b>Number of Zones:</b> 8 zones covering 19 CEOs offices
            </p>
          </div>

          {/* Gas */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
            <h3 className="font-semibold text-red-500 mb-2">
              🔥 Gas Supply
            </h3>
            <p className="text-sm text-gray-700">
              <b>Providers:</b> Indane / Bharat Gas
            </p>
            <p className="text-sm text-gray-700">
              <b>LPG Coverage:</b> 85%
            </p>
            <p className="text-sm text-gray-700">
              <b>PNL Coverage:</b> Limited
            </p>
          </div>

          {/* Municipal */}
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
            <h3 className="font-semibold text-blue-600 mb-2">
              🏛 Municipal Services
            </h3>
            <p className="text-sm text-gray-700">
              <b>Urban Local Bodies:</b> 87
            </p>
            <p className="text-sm text-gray-700">
              <b>Water Supply Coverage:</b> 70%
            </p>
            <p className="text-sm text-gray-700">
              <b>Solid Waste Coverage:</b> 78%
            </p>
          </div>
        </div>
      </div>
    </>
  );
}