

function getColorsNested(group, species, compareValue) {
    switch (compareValue) {
        case 'option1':
            switch (group) {
                case 'collected': return 'blue';
                case 'atlarge': return 'orange';
                default: return 'red';
            }
            
        case 'option2':
            switch (species) {
                case 'Coho': return 'blue';
                case 'Chinook': return 'brown';
                case 'Steelhead': return 'green';
                case 'Unknown': return 'gray';
                default: return 'red';
            }
    
        case 'option3':
            switch (species) {
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
                default: return 'red';
            }
        
        case 'option4':
            return 'blue';
        default: return 'red';
    }
}
export default getColorsNested;
