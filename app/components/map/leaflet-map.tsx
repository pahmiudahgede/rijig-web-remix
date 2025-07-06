import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

interface Location {
  id: string;
  name: string;
  type: string;
  address: string;
  coordinates: [number, number];
  status: string;
  capacity: number;
  currentLoad: number;
  lastPickup: string;
  coverage: string;
  population: number;
  schedule: string;
}

interface MapComponentProps {
  locations: Location[];
  onLocationSelect: (location: Location) => void;
}

export function LeafletMap({ locations, onLocationSelect }: MapComponentProps) {
  const [mapComponents, setMapComponents] = useState<any>(null);
  const [leaflet, setLeaflet] = useState<any>(null);

  useEffect(() => {
    const loadMapComponents = async () => {
      try {
        const [{ MapContainer, TileLayer, Marker, Popup }, L] =
          await Promise.all([import("react-leaflet"), import("leaflet")]);

        delete (L as any).Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
        });

        setMapComponents({ MapContainer, TileLayer, Marker, Popup });
        setLeaflet(L);
      } catch (error) {
        console.error("Error loading map components:", error);
      }
    };

    loadMapComponents();
  }, []);

  // Custom icon function
  const getMarkerIcon = (type: string, status: string) => {
    if (!leaflet) return undefined;

    const color =
      status === "active"
        ? "#10b981"
        : status === "maintenance"
        ? "#f59e0b"
        : "#ef4444";

    return leaflet.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background-color: white;
            border-radius: 50%;
          "></div>
        </div>
      `,
      className: "custom-div-icon",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
  };

  if (!mapComponents || !leaflet) {
    return (
      <div className="h-[600px] w-full bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = mapComponents;

  return (
    <MapContainer
      center={[-6.1944, 106.8229]} // Jakarta Pusat
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "600px", width: "100%" }}
      className="rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.coordinates[0], location.coordinates[1]]}
          icon={getMarkerIcon(location.type, location.status)}
          eventHandlers={{
            click: () => onLocationSelect(location)
          }}
        >
          <Popup>
            <div className="p-2 min-w-[250px]">
              <h3 className="font-semibold text-sm mb-1">{location.name}</h3>
              <p className="text-xs text-gray-600 mb-3">{location.address}</p>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      location.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {location.status}
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="font-medium">Load:</span>
                  <span>
                    {Math.round(
                      (location.currentLoad / location.capacity) * 100
                    )}
                    %
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all"
                    style={{
                      width: `${
                        (location.currentLoad / location.capacity) * 100
                      }%`
                    }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="font-medium">Population:</span>
                  <span>{location.population.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="font-medium">Last Pickup:</span>
                  <span>{location.lastPickup}</span>
                </div>
              </div>

              <button
                className="w-full mt-3 px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                onClick={() => onLocationSelect(location)}
              >
                View Details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
