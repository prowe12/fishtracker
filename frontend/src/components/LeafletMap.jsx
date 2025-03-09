import React, { useRef, useEffect, useState} from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import collectedData from "../data/fish_collected.json";
import atlargeData from "../data/fish_atlarge.json";
import Legend from './Legend';
import getColors from '../utils/getColors';


function CollectedTrajectory({ data, animate, clearAnimation }) {
  const map = useMap();
  const indexRef = useRef(0);
  const circlesRef = useRef([]);
  const intervalRef = useRef(null);

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
    if (map && data.length > 0 && animate) {
      const interval = setInterval(() => {
        if (indexRef.current < data.length) {
          const [lon, lat] = data[indexRef.current];
          const circle = L.circle([lat, lon], {
            radius: 4,
            interactive: false,
            fillOpacity: 0.5,
            stroke: false
          }).addTo(map);
          circlesRef.current.push(circle);
          indexRef.current += 1;
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
      }, 1);

      intervalRef.current = interval;

      return () => clearInterval(interval);
    }
  }, [map, data, animate]);

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

  function LeafletMap({ compareValue, showPoints, animate, clearAnimation, groups, species }) {
    // const [heatmapPoints, setHeatmapPoints] = useState([]);
    const [collectedPoints, setCollectedPoints] = useState([]);
    const [atlargePoints, setAtlargePoints] = useState([]);
    const [cohoCollPoints, setCohoCollPoints] = useState([]);
    const [chinookCollPoints, setChinookCollPoints] = useState([]);
    const [steelheadCollPoints, setSteelheadCollPoints] = useState([]);
    const [cohoPoints, setCohoPoints] = useState([]);
    const [chinookPoints, setChinookPoints] = useState([]);
    const [steelheadPoints, setSteelheadPoints] = useState([]);
    const [unkSpeciesPoints, setUnkSpeciesPoints] = useState([]);

    const mapRef = useRef(null);
    const latitude = 47.1555;
    const longitude = -122.683;

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
      const speciesList = [
        { species: 'Coho', setState: setCohoCollPoints },
        { species: 'Chinook', setState: setChinookCollPoints },
        { species: 'Steelhead', setState: setSteelheadCollPoints },
      ];
      speciesList.forEach(({ species, setState }) => {
        setPoints(collectedData.data, species, setState);
      });
    }, [collectedPoints]);

    useEffect(() => {
      const speciesList = [
        { species: 'Coho', setState: setCohoPoints },
        { species: 'Chinook', setState: setChinookPoints },
        { species: 'Steelhead', setState: setSteelheadPoints },
        { species: 'unknown', setState: setUnkSpeciesPoints },
      ];

      speciesList.forEach(({ species, setState }) => {
        setPoints(atlargeData.data, species, setState);
      });
    }, [atlargePoints]);


    return ( 
        <MapContainer center={[latitude, longitude]} zoom={17} ref={mapRef} className = "map-container">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Show the fish tracks with time */}
          <CollectedTrajectory data={collectedPoints} animate={animate} clearAnimation={clearAnimation} />

          {/* Option 1: Plot fish positions color-coded by group */}
          {showPoints && compareValue === "option1" && (
              <>
              {groups.map(group => (
                species.map(species0 => {
                  const dataKey = `${group} ${species0}`;
                  const dataPoints = {
                    "collected Coho": cohoCollPoints,
                    "collected Chinook": chinookCollPoints,
                    "collected Steelhead": steelheadCollPoints,
                    "atlarge Coho": cohoPoints,
                    "atlarge Chinook": chinookPoints,
                    "atlarge Steelhead": steelheadPoints,
                    "atlarge Unknown": unkSpeciesPoints
                  }[dataKey];
                  return dataPoints && (
                    <FishLayer
                      key={dataKey}
                      data={dataPoints}
                      color={getColors(group)}
                      markersize={species0 === "Coho" ? 2 : 4}
                    />
                  );
                })
              ))}
              </>
            )}

          {/* Option 2: Plot fish positions color-coded by species */}
          {showPoints && compareValue === "option2" && (
            <>
            {groups.map(group => (
                species.map(species0 => {
                  const dataKey = `${group} ${species0}`;
                  const dataPoints = {
                    "collected Coho": cohoCollPoints,
                    "collected Chinook": chinookCollPoints,
                    "collected Steelhead": steelheadCollPoints,
                    "atlarge Coho": cohoPoints,
                    "atlarge Chinook": chinookPoints,
                    "atlarge Steelhead": steelheadPoints,
                    "atlarge Unknown": unkSpeciesPoints
                  }[dataKey];
                  return dataPoints && (
                    <FishLayer
                      key={dataKey}
                      data={dataPoints}
                      color={getColors(species0)}
                      markersize={species0 === "Coho" ? 2 : 4}
                    />
                  );
                })
              ))}
            </>
          )}

          {/* Option 3: Plot fish positions color-coded by group and species */}
          {showPoints && compareValue === "option3" && (
            <>
              {groups.map(group => (
                species.map(species0 => {
                  const dataKey = `${group} ${species0}`;
                  const dataPoints = {
                    "collected Coho": cohoCollPoints,
                    "collected Chinook": chinookCollPoints,
                    "collected Steelhead": steelheadCollPoints,
                    "atlarge Coho": cohoPoints,
                    "atlarge Chinook": chinookPoints,
                    "atlarge Steelhead": steelheadPoints,
                    "atlarge Unknown": unkSpeciesPoints
                  }[dataKey];
                  return dataPoints && (
                    <FishLayer
                      key={dataKey}
                      data={dataPoints}
                      color={getColors(dataKey)}
                      markersize={species0 === "Coho" ? 2 : 4}
                    />
                  );
                })
              ))}
            </>
          )}

          {/* Option 4: Plot fish positions with no color-coding */}
          {showPoints && compareValue === "option4" && (
            <>
            {groups.map(group => (
                species.map(species0 => {
                  const dataKey = `${group} ${species0}`;
                  const dataPoints = {
                    "collected Coho": cohoCollPoints,
                    "collected Chinook": chinookCollPoints,
                    "collected Steelhead": steelheadCollPoints,
                    "atlarge Coho": cohoPoints,
                    "atlarge Chinook": chinookPoints,
                    "atlarge Steelhead": steelheadPoints,
                    "atlarge Unknown": unkSpeciesPoints
                  }[dataKey];
                  return dataPoints && (
                    <FishLayer
                      key={dataKey}
                      data={dataPoints}
                      color={getColors('All Fish')}
                      markersize={species0 === "Coho" ? 2 : 4}
                    />
                  );
                })
              ))}
            </>
          )}     
        <Legend groups={groups} species={species} compareValue={compareValue} />
        </MapContainer>
    );
};

export default LeafletMap;