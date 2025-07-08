import React, { type Dispatch, type SetStateAction, useState } from 'react';
import Field from "../field/Field.tsx";
import './Fields.css'

interface Props {
    handleSumbit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const FieldsData: React.FC<Props> = ({handleSumbit}) => {

    const [step, setStep] = useState(0.001);

    return (
        <div className="form">
            <form onSubmit={handleSumbit}>
                <Field 
                    title='Function:' 
                    type="text" 
                    placeholder='Enter math function example: x^2' 
                    width={300} 
                    name="function"
                />
                <Field 
                    title='Range from:' 
                    type="number" 
                    placeholder='-10' 
                    width={300} 
                    name="range_from"
                />
                <Field 
                    title='Range to:' 
                    type="number" 
                    placeholder='10' 
                    width={300} 
                    name="range_to"
                />
                <Field 
                    title='Y min:' 
                    type="number" 
                    placeholder='auto' 
                    width={300} 
                    step={0.1}
                    name="ymin"
                />
                <Field 
                   title='Y max:' 
                    type="number" 
                    placeholder='auto' 
                    width={300}
                    step={0.1}
                    name="ymax"
                />
                <Field 
                    title='Steps:' 
                    type="range" 
                    min={0.001} 
                    max={1} 
                    defaultValue={0.001} 
                    step={0.001} 
                    width={300} 
                    name="step"
                    onChange={e => setStep(Number(e.target.value))}
                />
                <Field 
                    type="number" 
                    min={0.001} 
                    max={1} 
                    defaultValue={step} 
                    step={0.001} 
                    width={300} 
                    name="step"
                    onChange={e => setStep(Number(e.target.value))}
                />
                <button style={{marginRight: 200, marginTop: 25}} type="submit">Submit form</button>
                <output>{step}</output>
            </form>
            
        </div>
    );
};


export default FieldsData;