import React from "react";
import './Switch.css';

interface SwitchProps {
    text_switch: string,
    onClick: () => void
}

export const Switch: React.FC<SwitchProps> = ({text_switch, onClick}) => {

    return (
        <>
            <button
                className='button'
                onClick={onClick}
            >
            {text_switch}
            </button>
        </>
    );
};

export default Switch;