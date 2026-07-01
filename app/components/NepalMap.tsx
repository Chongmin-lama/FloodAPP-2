"use client";

import L from "leaflet";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";

// fix default icon paths broken by webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const severityColor: Record<string, string> = {
  critical: "#ef4444",
  high:     "#f97316",
  medium:   "#eab308",
  low:      "#3b82f6",
};

const severityRadius: Record<string, number> = {
  critical: 14,
  high:     11,
  medium:   9,
  low:      7,
};

// Nepal district approximate centroids — used as fallback when lat/lng is null
const districtCoords: Record<string, [number, number]> = {
  "Kathmandu":       [27.7172, 85.3240],
  "Lalitpur":        [27.6588, 85.3247],
  "Bhaktapur":       [27.6710, 85.4298],
  "Chitwan":         [27.5291, 84.3542],
  "Pokhara":         [28.2096, 83.9856],
  "Kaski":           [28.2096, 83.9856],
  "Morang":          [26.6530, 87.3380],
  "Sunsari":         [26.6854, 87.1714],
  "Jhapa":           [26.5449, 87.8974],
  "Rupandehi":       [27.5600, 83.4500],
  "Bara":            [27.0154, 85.0163],
  "Parsa":           [27.0543, 84.7853],
  "Nawalpur":        [27.6900, 84.1050],
  "Dang":            [28.0500, 82.3000],
  "Banke":           [28.0667, 81.6167],
  "Bardiya":         [28.3500, 81.5000],
  "Kailali":         [28.6200, 80.9000],
  "Kanchanpur":      [28.9500, 80.3500],
  "Sindhupalchok":   [27.9500, 85.6800],
  "Sarlahi":         [27.0154, 85.5810],
  "Rautahat":        [27.0000, 85.2500],
  "Makwanpur":       [27.4167, 84.9167],
  "Dhading":         [27.8752, 84.9022],
  "Nuwakot":         [27.9667, 85.1667],
  "Gorkha":          [28.0000, 84.6333],
  "Lamjung":         [28.1667, 84.3500],
  "Tanahu":          [27.9167, 84.5000],
  "Syangja":         [28.0833, 83.8833],
  "Palpa":           [27.8667, 83.5500],
  "Gulmi":           [28.0833, 83.2667],
  "Arghakhanchi":    [27.9667, 83.1667],
  "Kapilvastu":      [27.5500, 83.0500],
  "Nawalparasi East":[27.7000, 83.9000],
  "Solukhumbu":      [27.8000, 86.7000],
  "Okhaldhunga":     [27.3000, 86.5000],
  "Khotang":         [27.1667, 86.8333],
  "Udayapur":        [26.9500, 86.5167],
  "Dhankuta":        [26.9833, 87.3333],
  "Terhathum":       [27.1167, 87.5500],
  "Taplejung":       [27.3500, 87.6667],
  "Panchthar":       [27.1500, 87.8000],
  "Ilam":            [26.9000, 87.9333],
  "Sankhuwasabha":   [27.3500, 87.1167],
  "Bhojpur":         [27.1667, 87.0500],
  "Ramechhap":       [27.3333, 86.0833],
  "Dolakha":         [27.7333, 86.1500],
  "Sindhuli":        [27.2500, 85.9667],
  "Kavrepalanchok":  [27.5833, 85.6833],
  "Rasuwa":          [28.1667, 85.3833],
  "Saptari":         [26.6000, 86.7667],
  "Siraha":          [26.6167, 86.2167],
  "Dhanusha":        [26.8000, 85.9167],
  "Mahottari":       [26.6500, 85.6500],
  "Manang":          [28.6667, 84.0167],
  "Mustang":         [29.1833, 83.9667],
  "Myagdi":          [28.3500, 83.5667],
  "Baglung":         [28.2667, 83.6000],
  "Parbat":          [28.2333, 83.7167],
  "Rukum East":      [28.6000, 82.6500],
  "Rolpa":           [28.3833, 82.6333],
  "Pyuthan":         [28.1000, 82.8500],
  "Dolpa":           [29.1333, 82.9667],
  "Mugu":            [29.5500, 82.2667],
  "Humla":           [29.9667, 81.9167],
  "Jumla":           [29.2833, 82.1833],
  "Kalikot":         [29.1500, 81.6500],
  "Dailekh":         [28.8500, 81.7167],
  "Jajarkot":        [28.7000, 82.2000],
  "Rukum West":      [28.6833, 82.3167],
  "Salyan":          [28.3833, 82.1667],
  "Surkhet":         [28.6000, 81.6167],
  "Bajura":          [29.5000, 81.3000],
  "Bajhang":         [29.5333, 81.1833],
  "Achham":          [29.1000, 81.2000],
  "Doti":            [29.2667, 80.9667],
  "Dadeldhura":      [29.3000, 80.6000],
  "Baitadi":         [29.5167, 80.5000],
  "Darchula":        [29.8500, 80.5500],
};

// Nepal center & bounds
const NEPAL_CENTER: [number, number] = [28.3949, 84.1240];
const NEPAL_BOUNDS: [[number, number], [number, number]] = [
  [26.3475, 80.0884],
  [30.4227, 88.2018],
];

interface Props {
  alerts: any[];
}

function getCoords(alert: any): [number, number] | null {
  if (alert.district && districtCoords[alert.district])
    return districtCoords[alert.district];
  
  // try case-insensitive match as fallback
  if (alert.district) {
    const key = Object.keys(districtCoords).find(
      (k) => k.toLowerCase() === alert.district.toLowerCase()
    );
    if (key) return districtCoords[key];
  }

  return null;
}

export default function NepalMap({ alerts }: Props) {
  return (
    <MapContainer
      key="nepal-map"
      center={NEPAL_CENTER}
      zoom={7}
      maxBounds={NEPAL_BOUNDS}
      maxBoundsViscosity={0.8}
      minZoom={6}
      style={{ height: "100%", width: "100%", position: "relative", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {alerts.map((alert) => {
        const coords = getCoords(alert);
        if (!coords) return null;

        const color  = severityColor[alert.severity]  ?? severityColor.low;
        const radius = severityRadius[alert.severity] ?? 8;

        return (
          <CircleMarker
            key={alert.alertId}
            center={coords}
            radius={radius}
            pathOptions={{
              color:       color,
              fillColor:   color,
              fillOpacity: 0.85,
              weight:      2,
            }}
          >
            <Tooltip direction="top" offset={[0, -radius]} opacity={1}>
              <div className="text-xs min-w-[160px] max-w-[220px]">
                <p className="font-bold text-gray-900 text-sm mb-1">{alert.title ?? alert.area}</p>
                {(alert.district || alert.area) && (
                  <p className="text-gray-500 mb-1 flex items-center gap-1">
                    <MapPin size={11} className="shrink-0" />
                    {[alert.district, alert.area].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="text-gray-700 leading-snug">{alert.description}</p>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-200">
                  <span
                    className="font-bold capitalize"
                    style={{ color }}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-gray-400">
                    {new Date(alert.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
