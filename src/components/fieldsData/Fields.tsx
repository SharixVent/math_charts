import React, { type Dispatch, type SetStateAction, useState } from 'react';
import Field from "../field/Field.tsx";
import './Fields.css'

interface Props {
    handleSumbit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const FieldsData: React.FC<Props> = ({handleSumbit}) => {

    const [step, setStep] = useState(0.1);

    return (
        <div className="form">
            <form onSubmit={handleSumbit}>
                <Field 
                    title='Function:' 
                    type="text" 
                    placeholder='...' 
                    width={300} 
                    name="function"
                />
                <Field 
                    title='Range from:' 
                    type="number" 
                    placeholder='0' 
                    width={300} 
                    name="range_from"
                />
                <Field 
                    title='Range to:' 
                    type="number" 
                    placeholder='100' 
                    width={300} 
                    name="range_to"
                />
                <Field 
                    title='Steps:' 
                    type="range" 
                    min={0.1} 
                    max={1} 
                    defaultValue={0.1} 
                    step={0.1} 
                    width={300} 
                    name="step"
                    onChange={e => setStep(Number(e.target.value))}
                    />
                <output>{step}</output>
                <button type="submit">Submit form</button>
            </form>
            
        </div>
    );
};


export default FieldsData;