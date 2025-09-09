import {GameController} from "../control/Control"

function WordsToGo() {

    const wordsToGoStyle: React.CSSProperties = {
        columnWidth: "60px",     // target width of each column
        columnGap: "1rem",        // space between columns
        display: "grid",  
        gridTemplateColumns: `repeat(4, 1fr)`,
        gridTemplateRows: `repeat(3, 1fr)`,
        
        whiteSpace: "pre-line",
        color: "white",
        textShadow: "2px 2px 4px #000000",
        textAlign: "center" as const,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.37)",
        backgroundColor: "rgba(0, 0, 0, 0.23)",
        padding: "1px",
        borderRadius: "8px",
        marginTop: "12px",
        marginBottom: "5px",
        userSelect: "none", // prevent text selection
        minHeight: "80px",
        maxHeight: "80px",       // enforce a minimum height before wrapping

    }

    const gottenStyle: React.CSSProperties = {
        color: "darkgrey",
    }

    const toGetStyle: React.CSSProperties = {
        color: "white",
    }


    return (
        <div className="text-base text-center text-gray-600 " style={wordsToGoStyle}>
            {GameController.getWordsToGo().map((word: string, i: number) => {
            
            if (GameController.getWordsGot().includes(word)) {
                return <div style={gottenStyle} key={i}> {`${word}`} </div>
            }
            else {
                return <div style={toGetStyle} key={i}> {`${word}`} </div>
            }
            })}
        </div>
    );

}


export {WordsToGo}