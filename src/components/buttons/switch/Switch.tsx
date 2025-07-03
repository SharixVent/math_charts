import React from "react";
import './Switch.css';

interface SwitchProps {
    text_switch: string,
    onClick: () => void
}

export const Switch: React.FC<SwitchProps> = ({text_switch, onClick}) => {

    return (
        <>
        {/* <div className='button-cont'> */}
            <button
                className='button-switch'
                onClick={onClick}
            >
            {text_switch}
            </button>
        {/* </div> */}
        </>
    );
};

export default Switch;