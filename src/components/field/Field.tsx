import React from 'react';
import './Field.css'

interface Props {
    title: string;
    placeholder: string;
    width: number;
    name: string;
}

export const Field: React.FC<Props> = ({title, placeholder, width, name}) => {

    return (
        <div className='label'>
            <label htmlFor="">{title}</label>
            <input name={name} style={{width: width}} type="text" placeholder={placeholder}/>
        </div>
    )
}
export default Field;