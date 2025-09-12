import React, { useState, useEffect } from "react";
import {GameController} from "../control/Control";

interface UIProps {
    children?: React.ReactNode; 
    style?: React.CSSProperties;
    subscribe: string;
}

function UI({ children, style, subscribe }: UIProps) {
    const [render, setRender] = useState(0);
  
    useEffect(() => {
        const callback = () => {
            setRender(prev => prev+1);
            console.log("rendering");
        }

        GameController.subscribe(subscribe, callback);
        console.log("attempted subscribe");
    }, []);

    return <div style={style}>
        <React.Fragment key={render}>
            {children}
        </React.Fragment>
    </div>;
}

export {UI}