import { GameController } from "../control/GameController";
import { context } from '@devvit/web/client';

interface LevelProps {
  textColor: string;
}

function Level({textColor}: LevelProps) {
    
    const containerStyle: React.CSSProperties = {
      display: "flex",
      justifyContent: "flex-end", // push content to the right
      gap: "10px",
      alignItems: "center",
      fontSize: "13px",
      marginBottom: "15px"
    };

    const themeStyle: React.CSSProperties = {
      fontWeight: "bold",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.21)", // shadowed backdrop
      color: textColor,
      fontSize: "13px"

    };

    const difficultyBase: React.CSSProperties = {
      padding: "4px 10px",
      borderRadius: "8px", // rounded square
      fontWeight: "bold",
      color: "white",
      fontSize: "13px"
    };

    const getDifficultyStyle = (difficulty: string): React.CSSProperties => {
      let bg = "gray";
      if (difficulty === "easy") bg = "green";
      else if (difficulty === "medium") bg = "orange";
      else if (difficulty === "hard") bg = "red";
      return { ...difficultyBase, backgroundColor: bg };
    };

    return (
      <div style={containerStyle}>
        <span style={themeStyle}>Puzzle #{String(context.postData!["level"]!)} {" "}
                                    {String(context.postData!["theme"]!)}</span>
        <span style={getDifficultyStyle(String(context.postData!["difficulty"]!))}>
          {String(context.postData!["difficulty"]!)}
        </span>
      </div>
    )
}

export {Level}