/**
 * Returns the color associated with fish group and species
 * 
 * @param group - The group of fish: collected or atlarge
 * @param species - The species: Coho, Chinook, Steelhead, or Unknown
 * @param compareValue - The option indicating which groups & species to compare by coloring them differently.
 * @returns The color associated with the group and species.
 */
function getColorsNested(group: string, species: string, compareValue: string) {
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
                    default: return 'red';
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
            return 'red';
        
        case 'option4':
            return 'blue';
        default: return 'red';
    }
}
export default getColorsNested;
