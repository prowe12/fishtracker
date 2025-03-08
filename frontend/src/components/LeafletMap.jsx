import React, { useRef, useEffect, useState} from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


import collectedData from "../data/fish_collected.json";
import atlargeData from "../data/fish_atlarge.json";
// import heatmapData from "../data/collected_histxy.json";
// import HeatmapLayer from './HeatmapLayer';

// const showHeatmap = false;
const showTrajectories = true;


const CollectedTrajectory = ({ data }) => {
  const map = useMap();
  const indexRef = useRef(0);
  const circlesRef = useRef([]);

  useEffect(() => {
    if (map && data.length > 0) {
      const interval = setInterval(() => {
        if (indexRef.current < data.length) {
          const [lon, lat] = data[indexRef.current];
          const circle = L.circle([lat, lon], {
            radius: 10,
            interactive: false,
            fillOpacity: 0.5,
            stroke: false
          }).addTo(map);
          circlesRef.current.push(circle);
          indexRef.current += 1;
          console.log(indexRef);
        }

        // Fade out and remove circles
        circlesRef.current = circlesRef.current.filter(circle => {
          let opacity = circle.options.fillOpacity;
          if (opacity > 0.02) {
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
      }, 0);

      return () => clearInterval(interval);
    }
  }, [map, data]);

  return null;
};


const FishLayer = ({ data, color, markersize }) => {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    if (map && data.length > 0) {
      const layerGroup = L.layerGroup();
      data.forEach(row => {
        const [lon, lat] = row;
        L.circle([lat, lon], { 
          color: color,
          radius: markersize, 
          interactive: false, 
          fillOpacity: 0.01, 
          stroke: false
        }).addTo(layerGroup);
      });
      layerGroup.addTo(map);
      layerRef.current = layerGroup;
    }

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [map, data, color, markersize]);

  return null;
};

function getSubset(data, species) {
  return data.filter(row => row[2] === species).map(row => [row[3], row[4]]);
}

function LeafletMap({ compareValue, animate }) {
    // const [heatmapPoints, setHeatmapPoints] = useState([]);
    const [collectedPoints, setCollectedPoints] = useState([]);
    const [atlargePoints, setAtlargePoints] = useState([]);
    const [cohoPoints, setCohoPoints] = useState([]);
    const [chinookPoints, setChinookPoints] = useState([]);
    const [steelheadPoints, setSteelheadPoints] = useState([]);
    const [unkSpeciesPoints, setUnkSpeciesPoints] = useState([]);


    const mapRef = useRef(null);
    const latitude = 47.1555;
    const longitude = -122.683;
  
    // useEffect(() => {
    //   const points = heatmapData.data.map(row => [row[0], row[1], row[2]]);
    //   setHeatmapPoints(points);
    // }, []);

    useEffect(() => {
      const points = collectedData.data.map(row => [row[3], row[4]]);
      setCollectedPoints(points);
    }, []);

    useEffect(() => {
      const points = atlargeData.data.map(row => [row[3], row[4]]);
      setAtlargePoints(points);
    }, []);

    const setPoints = (data, species, setState) => {
      if (data.length > 0) {
        const points = getSubset(data, species);
        setState(prevPoints => [...prevPoints, ...points]);
      }
    };
  
    useEffect(() => {
      setPoints(collectedData.data, 'Coho', setCohoPoints);
      setPoints(atlargeData.data, 'Coho', setCohoPoints);
    }, [collectedPoints, atlargePoints]);
  
    useEffect(() => {
      setPoints(collectedData.data, 'Chinook', setChinookPoints);
      setPoints(atlargeData.data, 'Chinook', setChinookPoints);
    }, [collectedPoints, atlargePoints]);
  
    useEffect(() => {
      setPoints(collectedData.data, 'Steelhead', setSteelheadPoints);
      setPoints(atlargeData.data, 'Steelhead', setSteelheadPoints);
    }, [collectedPoints, atlargePoints]);
  
    useEffect(() => {
      setPoints(collectedData.data, 'unknown', setUnkSpeciesPoints);
      setPoints(atlargeData.data, 'unknown', setUnkSpeciesPoints);
      console.log()
    }, [collectedPoints, atlargePoints]);
  

    return ( 
        <MapContainer center={[latitude, longitude]} zoom={18} ref={mapRef} className = "map-container">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Todo: move this elsewhere */}
          {/* {showHeatmap && <HeatmapLayer data={heatmapData} />} */}
          
          {compareValue === "option1" && (
            <>
              <FishLayer data={collectedPoints} color='blue' markersize={4} />
              <FishLayer data={atlargePoints} color='orange' markersize={2} />
            </>
          )}

          {compareValue === "option2" && (
            <>
            <FishLayer data={cohoPoints} color='blue' markersize={2} />
            <FishLayer data={chinookPoints} color='orange' markersize={4} />
            <FishLayer data={steelheadPoints} color='green' markersize={4} />
            <FishLayer data={unkSpeciesPoints} color='gray' markersize={2} />
            </>
          )}         
            
        </MapContainer>
    );
};

export default LeafletMap;