import React, { useState, type Dispatch, type SetStateAction } from 'react';
import './Field.css'

interface Props {
    title: string,
    placeholder: string,
    width: number;
    data: {x: number; y: number}[]
    setData: Dispatch<SetStateAction<{
        x: number;
        y: number;
    }[]>>
}

export const Field: React.FC<Props> = ({title, placeholder, width, data, setData}) => {

    return (
        <div className='label'>
            <label htmlFor="">{title}</label>
            <input style={{width: width}} type="text" placeholder={placeholder} value={data} {setData}}/>
        </div>
    )
}
export default Field;