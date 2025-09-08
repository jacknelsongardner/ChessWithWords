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
            {GameController.getCurrentWord() || ""}
            <span className="cursor">|</span>
        </div>
    );
}

export {CurrentWord}