import React, { useState } from 'react';
import './Field.css'

interface Props {
    title: string,
    placeholder: string,
    width: number;
    onSumbit: () => void
}

export const Fields: React.FC<Props> = ({title, placeholder, width}) => {

    const [valueInput, setValueInput] = useState("");

    return (
        <div className='label'>
            <label htmlFor="">{title}</label>
            <input style={{width: width}} type="text" placeholder={placeholder} value={valueInput} />
        </div>
    )
}
export default Fields;