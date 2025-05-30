import { useRef, useEffect} from "react";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


interface CollectedTrajectoryProps {
  data: number[][];
  animate: boolean;
  clearAnimation: boolean;
  color: string;
}

function CollectedTrajectory({ data, animate, clearAnimation, color }: CollectedTrajectoryProps) {
    const map = useMap();
    const indexRef = useRef(0);
    const circlesRef = useRef<L.Circle[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
    useEffect(() => {
      if (clearAnimation) {
        circlesRef.current.forEach(circle => map.removeLayer(circle));
        circlesRef.current = [];
        indexRef.current = 0;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, [map, clearAnimation]);
  
    useEffect(() => {
      if (map && data.length > 0 && data[0].length>0 && animate) {
        const interval = setInterval(() => {
          if (indexRef.current < data.length) {
            const [lon, lat] = data[indexRef.current];
            const circle:L.Circle = L.circle([lat, lon], {
              radius: 4,
              interactive: false,
              fillOpacity: 0.5,
              color: color,
              stroke: false
            }).addTo(map);
            circlesRef.current.push(circle);
            indexRef.current += 1;
          }
  
          // Fade out and remove circles
          circlesRef.current = circlesRef.current.filter(circle => {
            let opacity:(number|undefined) = circle.options.fillOpacity;
            if (opacity === undefined) {
              opacity = 0.5;
              return true;
            } else if (opacity > 0.02) {
              opacity -= 0.02;
              circle.setStyle({ fillOpacity: opacity });
              return true;
            } else {
              map.removeLayer(circle);
              return false;
            }
          });
  
          if (indexRef.current >= data.length && circlesRef.current.length === 0) {
            clearInterval(interval);
          }
        }, 1);
  
        intervalRef.current = interval;
  
        return () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      }
    }, [map, data, animate, color]);
  
    return null;
  };
  
  export default CollectedTrajectory;