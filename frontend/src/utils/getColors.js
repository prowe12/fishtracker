function getColors(category) {
  switch (category) {
      case 'collected': return 'blue';
      case 'atlarge': return 'orange';
    
      case 'Coho': return 'blue';
      case 'Chinook': return 'brown';
      case 'Steelhead': return 'green';
      case 'Unknown': return 'gray';
      
      case 'collected Coho': return 'blue';
      case 'collected Chinook': return 'brown';
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
