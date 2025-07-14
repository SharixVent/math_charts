import React from 'react';

interface Props {
    style?: React.CSSProperties;
    onClick?: () => any;
    title?: string;
}

export const SaveLoad: React.FC<Props> = ({ title, style, onClick}) => {

    return (
        <>
            <button onClick={onClick} style={style}>
                {title}
            </button>
        </>
    )
}
export default SaveLoad;