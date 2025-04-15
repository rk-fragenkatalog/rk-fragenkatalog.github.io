// functions, copied from the internet
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// Randomize array in-place using Durstenfeld shuffle algorithm
export function shuffleArray(array: any): any {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// https://www.30secondsofcode.org/articles/s/javascript-array-comparison
// compare two arrays, neglect order of elements (~set comparison)
export function compareArrays(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    const uniqueValues = new Set([...a, ...b]);
    for (const v of uniqueValues) {
        const aCount = a.filter(e => e === v).length;
        const bCount = b.filter(e => e === v).length;
        if (aCount !== bCount) return false;
    }
    return true;
}