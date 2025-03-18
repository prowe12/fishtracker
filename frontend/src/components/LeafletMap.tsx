import React, { useRef, useEffect, useState} from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Legend from './Legend';
import getColorsNested from '../utils/getColorsNested';
import CollectedTrajectory from './CollectedTrajectory';
import collectedData from "../data/fish_collected.json";
import atlargeData from "../data/fish_atlarge.json";

interface FishData {
  columns: string[];
  data: (string | number)[][];
}

const collectedDataTyped: FishData = collectedData as FishData;
const atlargeDataTyped: FishData = atlargeData as FishData;


interface FishLayerProps {
  data: number[][],
  color: string,
  markersize: number
};

interface LeafletMapProps {
  compareValue: string,
  showPoints: boolean,
  animate: boolean,
  clearAnimation: boolean,
  groups: string[],
  species: string[]
}

function FishLayer ({ data, color, markersize }: FishLayerProps) {
  const map = useMap();
  const layerRef = useRef<L.LayerGroup | null>(null);

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

function getSubset(data: (string | number)[][], species: string) {
  return data
    .filter(row => row[2] === species)
    .map(row => [Number(row[3]), Number(row[4])]);
}


function LeafletMap({ compareValue, showPoints, animate, clearAnimation, groups, species }: LeafletMapProps) {
    const [collectedPoints, setCollectedPoints] = useState<number[][]>([]);
    const [atlargePoints, setAtlargePoints] = useState<number[][]>([]);
    const [cohoCollPoints, setCohoCollPoints] = useState<number[][]>([]);
    const [chinookCollPoints, setChinookCollPoints] = useState<number[][]>([]);
    const [steelheadCollPoints, setSteelheadCollPoints] = useState<number[][]>([]);
    const [cohoPoints, setCohoPoints] = useState<number[][]>([]);
    const [chinookPoints, setChinookPoints] = useState<number[][]>([]);
    const [steelheadPoints, setSteelheadPoints] = useState<number[][]>([]);
    const [unkSpeciesPoints, setUnkSpeciesPoints] = useState<number[][]>([]);

    const mapRef = useRef(null);
    const latitude = 47.1555;
    const longitude = -122.683;

    function renderFishLayers(groups: string[], species: string[], compareValue: string, getColorsNested: (group: string, species: string, compareValue: string) => string) {
      return groups.map(group => (
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
              color={getColorsNested(group, species0, compareValue)}
              markersize={species0 === "Coho" ? 2 : 4}
            />
          );
        })
      ));
    }

    function renderAnimations(groups: string[], species: string[], compareValue: string, getColorsNested: (group: string, species: string, compareValue: string) => string) {
      return groups.map(group => (
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
            <CollectedTrajectory 
              key={dataKey} 
              data={dataPoints} 
              animate={animate} 
              clearAnimation={clearAnimation} 
              color={getColorsNested(group, species0, compareValue)}/>
          );
        })
      ));
    }
    
    useEffect(() => {
      const points = (collectedData as FishData).data.map(row => [Number(row[3]), Number(row[4])]);
      setCollectedPoints(points);
    }, []);

    useEffect(() => {
      const points = collectedDataTyped.data.map(row => [Number(row[3]), Number(row[4])]);
      setCollectedPoints(points);
    }, []);
    
    useEffect(() => {
      const points = atlargeDataTyped.data.map(row => [Number(row[3]), Number(row[4])]);
      setAtlargePoints(points);
    }, []);

    const setPoints = (data: (string | number)[][], species: string, setState: React.Dispatch<React.SetStateAction<number[][]>>) => {
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
        setPoints(collectedDataTyped.data, species, setState);
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
        setPoints(atlargeDataTyped.data, species, setState);
      });
    }, [atlargePoints]);

  
    return ( 
        <MapContainer center={[latitude, longitude]} zoom={17} ref={mapRef} className = "map-container">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {showPoints && renderFishLayers(groups, species, compareValue, getColorsNested) }
          {renderAnimations(groups, species, compareValue, getColorsNested) }
          
          <Legend groups={groups} species={species} compareValue={compareValue} />
        
        </MapContainer>
    );
};

export default LeafletMap;