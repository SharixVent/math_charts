import React from 'react';
import './Field.css'

interface Props {
    title?: string;
    placeholder?: string;
    width: number;
    name: string;
    type: string;
    min?: number;
    max?: number;
    step?: number;
    style?: React.CSSProperties;
    value?: number | string;
    defaultValue?: number | string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const Field: React.FC<Props> = (
    {title, placeholder, width, name, type, 
    min, max, step, value, defaultValue, onChange, style
    }) => {

    return (
        <div className='label'>
            <label>{title}</label>
            <input 
                name={name} 
                style={{width: width, ...style}} 
                type={type} 
                max={max} 
                min={min} 
                step={step}
                value={value ?? ''} 
                defaultValue={defaultValue} 
                placeholder={placeholder}
                onChange={onChange}
            />
        </div>
    )
}
export default Field;