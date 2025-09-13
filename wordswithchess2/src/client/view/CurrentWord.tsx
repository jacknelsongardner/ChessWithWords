import {GameController} from "../control/Control"

function CurrentWord() {

    const currentWordStyle: React.CSSProperties = {

        fontSize: '1.5em',
        fontWeight: 'bold',
        color: 'black',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '8px',
        textAlign: 'center' as const,
        minWidth: '150px',
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'pre-wrap' as const,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.37)",
        userSelect: "none", // prevent text selection

    }

    return (
        <div style={currentWordStyle}>
            <span style={{ fontFamily: "Franklin Gothic, sans-serif"}}>
                  {GameController.getWordToGet()?.split("").map((letter, index) => {
                        const currentWordLength = GameController.getCurrentWord().length;
                        let cursor = false;

                        if (currentWordLength === index) {
                        cursor = true;
                        }

                        return (
                        <span key={index} style={{ color: currentWordLength > index ? "black" : "grey" }}>
                            {cursor && <span className="cursor" style={{marginRight:"-5px", marginLeft:"-5px", color: "black"}}>|</span>}
                            {letter}
                        </span>
                        );
                    })}
            </span>
            
            
        </div>
    );
}

export {CurrentWord}