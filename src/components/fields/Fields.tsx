import React from 'react';
import './Fields.css'

interface Props {
    title: string,
    placeholder: string,
    width: number;
}

export const Fields: React.FC<Props> = ({title, placeholder, width}) => {

    return (
        <div className='label'>
            <label htmlFor="">{title}</label>
            <input style={{width: width}} type="text" placeholder={placeholder} />
        </div>
    )
}
export default Fields;