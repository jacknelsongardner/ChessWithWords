
interface CircleButtonProps {
  onClick: (() => any),
  content: any
}

function CircleButton({onClick, content}: CircleButtonProps) {

  const buttonStyle: React.CSSProperties = {
    width: "80px",          // longer than height
    height: "35px",         // shorter height
    fontSize: "1.2em",
    fontWeight: "bold",
    color: "black",
    backgroundColor: "#ffffff",
    border: "none",
    borderRadius: "9999px", // makes sides fully rounded
    cursor: "pointer",
    display: "flex",
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