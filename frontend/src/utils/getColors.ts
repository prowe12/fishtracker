/**
 * Returns the color associated with fish group and species
 * 
 * @param category - The category of fish.
 * @returns - The color associated with the category.
 */
// TODO: This code duplicates the getColorsNested.js file. Refactor to use that file.
function getColors(category: string): string {
  switch (category) {
      case 'collected': return 'blue';
      case 'atlarge': return 'orange';
    
      case 'Coho': return 'blue';
      case 'Chinook': return 'brown';
      case 'Steelhead': return 'green';
      case 'Unknown': return 'gray';
      
      case 'collected Coho': return 'blue';
      case 'collected Chinook': return 'purple';
      case 'collected Steelhead': return 'green';

      case 'atlarge Coho': return 'cyan';
      case 'atlarge Chinook': return 'salmon';
      case 'atlarge Steelhead': return 'greenyellow';
      case 'atlarge Unknown': return 'gray';

      case "All Fish": return 'blue';
      default: return 'red';
  }
}

export default getColors;
