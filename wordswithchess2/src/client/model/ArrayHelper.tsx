function shuffleArray(array: string[]): string[] {
    
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // random index 0..i
        [array[i]!, array[j]!] = [array[j]!, array[i]!];   // swap
    }
    return array;
}
 
function getUniqueLetters(words: string): Set<string> {
    const uniqueLetters = new Set<string>();
    for (const char of words) {
        uniqueLetters.add(char);
    }
    return uniqueLetters;
}

function fillArray(sizeTo: number, array: string[], ): string[] {
    
    let left = sizeTo - array.length;

    for (let i = 0; i < left; i++) {
        const j = Math.floor(Math.random() * (i + 1)); // random index 0..i
        array.push(array[j]!);   // fill with random existing letters
    }
    return array;
}

export {shuffleArray, getUniqueLetters, fillArray}