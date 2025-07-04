import React from 'react';
import './Field.css'

interface Props {
    title: string;
    placeholder?: string;
    width: number;
    name: string;
    type: string;
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: number | string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const Field: React.FC<Props> = (
    {title, placeholder, width, name, type, 
    min, max, step, defaultValue, onChange
    }) => {

    return (
        <div className='label'>
            <label htmlFor="">{title}</label>
            <input 
                name={name} 
                style={{width: width}} 
                type={type} 
                max={max} 
                min={min} 
                step={step} 
                defaultValue={defaultValue} 
                placeholder={placeholder}
                onChange={onChange}
            />
        </div>
    )
}
export default Field;