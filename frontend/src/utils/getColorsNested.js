

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
            if (group === "collected") {
                switch (species) {
                    case 'Coho': return 'blue';
                    case 'Chinook': return 'purple';
                    case 'Steelhead': return 'green';
                }
            }
            else if (group === "atlarge") {
                switch (species) {
                case 'Coho': return 'cyan';
                case 'Chinook': return 'pink';
                case 'Steelhead': return 'greenyellow';
                case 'Unknown': return 'gray';
                default: return 'red';
                }
            }
        
        case 'option4':
            return 'blue';
        default: return 'red';
    }
}
export default getColorsNested;
