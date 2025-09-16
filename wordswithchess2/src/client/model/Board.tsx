import { fillArray, shuffleArray, getUniqueLetters } from "./ArrayHelper";

class Board {

    public content: string[][];

    constructor(sizeX: number, sizeY: number, words: string) {
        this.content = [];
        
        const totalSize: number = sizeX * sizeY;

        let uniqueLetters = fillArray( totalSize,
                            shuffleArray(
                            Array.from(getUniqueLetters(words))));

        if (uniqueLetters!.length > sizeX * sizeY) {
            throw new Error("Too many unique letters for board size");
        }

        for (let i = 0; i < sizeY; i++) {
            let array: string[] = [];
            let arrayRight: boolean[] = [];
            for (let j = 0; j < sizeX; j++) {
                array.push(uniqueLetters.pop()!); 
                arrayRight.push(false);
            }
            this.content.push(array);
        }

    }

    shuffle(wordsToShuffle: string[]): [string[], Record<string, [number, number][]>] {
        // shuffle words

        var wordPaths: Record<string, [number, number][]> = {}; // map from word -> hints

        
        console.log("Shuffle words: " + wordsToShuffle.join(", "));
        var wordsShuffled: string[] = []


        for (var word of wordsToShuffle) {
            console.log(word);


            function shuffleArrayInPlace(array: [number, number][]): void {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    let temp = array[i]!
                    array[i] = array[j]!
                    array[j] = temp!
                }
            }

            let usedSpots: [number, number][] = [];
            for (let x = 0; x < this.content.length; x++) {
                for (let y = 0; y < this.content[0]!.length; y++) {
                    usedSpots.push([x, y]);
                }
            }

            shuffleArrayInPlace(usedSpots); 

            var paths = [];

            while (true) {
                if (word.length === 0) continue; // skip found words
                var spotToTry = usedSpots.pop();

                paths = this.knightPaths([spotToTry![0], spotToTry![1]], word.length);
                
                if (paths.length === 0) {

                    if (usedSpots.length == 0) { break; }
                    console.log("No paths found for word " + word);
                    continue;
                } else {break; }
            }

            if (paths.length === 0) { continue; }

            var path = paths[Math.floor(Math.random() * paths.length)];

            console.log("Path for word " + word + ": " + path?.toString());

            word = word.toUpperCase();

            for (var i = 0; i < word.length; i++) {
                this.content[path![i]![0]]![path![i]![1]] = word[i]!;
            }

            wordsShuffled.push(word);
            wordPaths[word] = path!;

        }

        console.table(this.content);

        return [wordsShuffled, wordPaths];
    }



    knightPaths(start: [number, number], pathLength: number): [number, number][][] {
        const rows = this.content.length;
        const cols = this.content[0]?.length ?? 0;

        const moves: [number, number][] = [
        [2, 1], [1, 2], [-1, 2], [-2, 1],
        [-2, -1], [-1, -2], [1, -2], [2, -1]
        ];

        const paths: [number, number][][] = [];

        const isValid = (x: number, y: number, visited: [number, number][]) => {
            if (x >= 0 && x < rows && y >= 0 && y < cols ) {
                
                var letter = this.content[x]?.[y];
                var upperLetter = letter?.toUpperCase();

                if ((letter != upperLetter &&
                    !visited.some(([vx, vy]) => vx === x && vy === y))) {
                    console.log("valid move")
                    return true;
                }

                console.log("invalid move")
                return false;
            }

            return false;
        };

        const backtrack = (x: number, y: number, visited: [number, number][]) => {
            console.log(`Backtracking at (${x}, ${y}), visited: ${visited.length}`);

            if (visited.length === pathLength) {
                console.log(`Found path: ${JSON.stringify(visited)}`);

                paths.push([...visited]);
                return;
            }

            for (const [dx, dy] of moves) {
                const nx = x + dx;
                const ny = y + dy;
                if (isValid(nx, ny, visited)) {
                    visited.push([nx, ny]);
                    backtrack(nx, ny, visited);
                    visited.pop(); // backtrack
                }
            }
        };

        console.log(`Starting knightPaths from (${start[0]}, ${start[1]}) for length ${pathLength}`);
        if (isValid(start[0], start[1], [])) {
            console.log(paths); 
            console.log("Starting position is valid");
            backtrack(start[0], start[1], [start]);
        }

        console.log(paths);
        return paths;
    }

}

export {Board}