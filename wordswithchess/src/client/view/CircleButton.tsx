
interface CircleButtonProps {
  onClick: (() => any),
  content: any
}

function CircleButton({onClick, content}: CircleButtonProps) {

  const buttonStyle: React.CSSProperties = {
    width: "35px",          // same width & height
    height: "35px",
    fontSize: "1.2em",
    fontWeight: "bold",
    color: "black",
    backgroundColor: "#ffffffff", // picked a blue (since #ffffffff was invalid)
    border: "none",
    borderRadius: "50%",    // makes it a circle
    cursor: "pointer",
    display: "flex",        // center content
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.37)",
    transition: "background-color 0.3s, box-shadow 0.3s",
  };

  return (
    <button style={buttonStyle} onClick={onClick}>
          {content}
    </button>
  );
}

export {CircleButton}