import React from "react";
import { useEffect } from "react";

const containerStyle: React.CSSProperties = {
  width: "300px",
  margin: "20px auto",
  padding: "16px",
  borderRadius: "12px",
  background: "#29293fff",
  color: "white",
  fontFamily: "Arial, sans-serif",
  boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
};

const titleStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "12px",
  fontSize: "20px",
  fontWeight: "bold",
  letterSpacing: "1px",
};

const listStyle: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const itemStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 4px",
  borderBottom: "1px solid rgba(37, 47, 80, 1)",
};

const nameStyle: React.CSSProperties = {
  textAlign: "left",
};

const scoreStyle: React.CSSProperties = {
  textAlign: "right",
  fontWeight: "bold",
};

interface HighScoreProps
{
    scores: {member: string, score: number}[]
}

function HighScores({ scores }: HighScoreProps) {
    
    return (
    <div style={containerStyle}>      

      <h2 style={titleStyle}>High Scores</h2>
      
      
      <ul style={listStyle}>
        {scores.map((entry, index) => (
          <li
            key={index}
            style={{
              ...itemStyle,
              borderBottom:
                index === scores.length - 1
                  ? "none"
                  : itemStyle.borderBottom,
            }}
          >
            <span style={nameStyle}>{entry.member}</span>
            <span style={scoreStyle}>{entry.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export {HighScores};
