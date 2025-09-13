import React from "react";

interface CountdownCircleProps {
  count: number;
}

function CountdownCircle({ count }: CountdownCircleProps) {
  const isGo = count === 1;

  return (
    <div
      className={`flex items-center justify-center rounded-full border-8 w-40 h-40 text-6xl font-bold`}
      style={{
        borderColor: isGo ? "green" : "grey",
        color: isGo ? "green" : "grey",
      }}
    >
      {isGo ? "GO!" : count-1}
    </div>
  );
}

export {CountdownCircle};
