import {useEffect} from "react";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import getColors from '../utils/getColors';

interface LegendProps {
  groups: string[];
  species: string[];
  compareValue: string;
}

function Legend({groups, species, compareValue}:LegendProps) {
    const map = useMap();
  
    useEffect(() => {
      if (map) {
        var legend = new L.Control({ position: 'topright' });
        legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        var labels = ['<strong>Categories</strong>'];

        var categories:string[] = [];
        if (compareValue === 'option1') {
            // Show one color for each group
            categories = groups;
        } else if (compareValue === 'option2') {
            // Show one color for each species
            categories = species;
        }
        else if (compareValue === 'option3') {
            // Show one color for each group + species
            categories = [];
            groups.forEach(group => {
                species.forEach(species0 => {
                    categories.push(group + ' ' + species0);
                });
            });
        } else {
            // Show one color regardless of groups and species
            categories = ['All Fish'];
        }
          
          for (var i = 0; i < categories.length; i++) {
            labels.push(
              '<i style="background:' + getColors(categories[i]) + '"></i> ' +
              (categories[i] ? categories[i] : '+')
            );
          }
          div.innerHTML = labels.join('<br>');
          return div;
        };
        legend.addTo(map);
  
        return () => {
          legend.remove();
        };
      }
    }, [map, groups, species, compareValue]);
  
    return null;
  };
  
export default Legend;
