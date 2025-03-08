import useEffect from "react";
import L from "leaflet";
import "leaflet.heat";
import { useMap } from "react-leaflet";

const HeatmapLayer = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    if (map && L.heatLayer && data.length > 0) {
        const heat = L.heatLayer(data, {
        radius: 10,
        maxZoom: 18,
        gradient: {
          0.1: 'blue',
          0.3: 'lime',
          0.6: 'yellow',
          1.0: 'red'
        }
      }).addTo(map);
    }
  }, [map, data]);
  return null;
};

export default HeatmapLayer;