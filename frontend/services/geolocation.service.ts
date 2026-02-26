const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface GeolocationResult {
    latitude: number;
    longitude: number;
    wardNumber: string;
    wardName: string;
    address?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    area?: string;
}

// Map coordinates to ward (mock backend API simulation)
// In production, this would be a real reverse-geocoding + ward-lookup API
async function lookupWardFromCoords(lat: number, lng: number): Promise<GeolocationResult> {
    await delay(800); // Simulate API call

    // Simulated ward mapping based on coordinate ranges
    const wards: {
        minLat: number; maxLat: number; minLng: number; maxLng: number;
        ward: string; name: string; city: string; state: string; pin: string; area: string
    }[] = [
            { minLat: 28.45, maxLat: 28.47, minLng: 77.02, maxLng: 77.04, ward: "Ward 12", name: "Sector 12", city: "Noida", state: "Uttar Pradesh", pin: "201301", area: "Sector 12" },
            { minLat: 28.47, maxLat: 28.49, minLng: 77.00, maxLng: 77.02, ward: "Ward 5", name: "Sector 5", city: "Greater Noida", state: "Uttar Pradesh", pin: "201310", area: "Sector 5" },
            { minLat: 28.60, maxLat: 28.65, minLng: 77.20, maxLng: 77.25, ward: "Ward 3", name: "Connaught Place", city: "New Delhi", state: "Delhi", pin: "110001", area: "CP Block A" },
            { minLat: 28.55, maxLat: 28.60, minLng: 77.18, maxLng: 77.22, ward: "Ward 8", name: "Lodhi Colony", city: "New Delhi", state: "Delhi", pin: "110003", area: "Block 4" },
            { minLat: 28.70, maxLat: 28.75, minLng: 77.10, maxLng: 77.15, ward: "Ward 15", name: "Pitampura", city: "North Delhi", state: "Delhi", pin: "110034", area: "Pitam Pura" },
            { minLat: 28.63, maxLat: 28.68, minLng: 77.05, maxLng: 77.12, ward: "Ward 1", name: "Dwarka", city: "South West Delhi", state: "Delhi", pin: "110075", area: "Sector 6" },
        ];

    const match = wards.find(
        (w) => lat >= w.minLat && lat <= w.maxLat && lng >= w.minLng && lng <= w.maxLng
    );

    if (match) {
        return {
            latitude: lat,
            longitude: lng,
            wardNumber: match.ward,
            wardName: match.name,
            address: `${match.area}, ${match.city}, ${match.state} - ${match.pin}`,
            city: match.city,
            state: match.state,
            pinCode: match.pin,
            area: match.area
        };
    }

    // Default fallback for unmatched coordinates
    return {
        latitude: lat,
        longitude: lng,
        wardNumber: "Ward 12",
        wardName: "Default Ward — Auto Assigned",
        address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
    };
}

export type GeoStatus = "idle" | "requesting" | "fetching" | "success" | "denied" | "unavailable" | "error";

export async function fetchUserLocation(): Promise<{
    status: GeoStatus;
    result?: GeolocationResult;
    error?: string;
}> {
    if (!navigator.geolocation) {
        return { status: "unavailable", error: "Geolocation is not supported by your browser" };
    }

    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const result = await lookupWardFromCoords(
                        position.coords.latitude,
                        position.coords.longitude
                    );
                    resolve({ status: "success", result });
                } catch {
                    resolve({ status: "error", error: "Failed to fetch ward information from server" });
                }
            },
            (err) => {
                if (err.code === err.PERMISSION_DENIED) {
                    resolve({ status: "denied", error: "Location permission denied. Please enter ward manually." });
                } else if (err.code === err.POSITION_UNAVAILABLE) {
                    resolve({ status: "unavailable", error: "Location unavailable. Please enter ward manually." });
                } else {
                    resolve({ status: "error", error: "Location request timed out. Please enter ward manually." });
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            }
        );
    });
}
