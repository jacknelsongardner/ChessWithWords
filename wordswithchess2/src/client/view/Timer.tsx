import {GameController} from "../control/Control"

function Timer() {
        
    const timeStyle: React.CSSProperties = {
        fontSize: '1.2em',
        fontWeight: 'bold',
        color: GameController.getTimeLeft() <= 10 ? 'red' : 'black', // red if 10 seconds or less
        textAlign: 'center' as const,
        backgroundColor: "white",
        padding: '2px',
        borderRadius: '10px',
        minWidth: '80px',
        minHeight: '40px',
        maxWidth: '120px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.37)", // glow effect if 10 seconds or less
    }

    return (
        <div style={{justifyContent: "center"}}>
            <p style={timeStyle}>
                🕚 {GameController.getTimeLeft()}s
            </p>
        </div>
    );
}

export {Timer}