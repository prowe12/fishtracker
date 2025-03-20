"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns the color for a group of fish. compareValue determines what groups are
 * contrasted. E.g.
 * Option 1: One color for collected fish, another for at large fish.
 * Option 2: One color for each species.
 * Option 3: One color for each species in collected and at-large.
 *
 * @param group - The group of fish: collected or at-large
 * @param species - The species: Coho, Chinook, Steelhead, or Unknown
 * @param compareValue - The option indicating which groups to color-contrast.
 * @returns {string} The color for the species or group of fish.
 */
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
exports.default = getColorsNested;
