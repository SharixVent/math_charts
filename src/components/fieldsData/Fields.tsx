import React, { type Dispatch, type SetStateAction } from 'react';
import Field from "../field/Field.tsx";

interface Props {
    handleSumbit: (e: React.FormEvent<HTMLFormElement>) => void;
    // data: {x: number; y: number}[]
    // setData: Dispatch<SetStateAction<{
    //     x: number;
    //     y: number;
    // }[]>>
}

export const FieldsData: React.FC<Props> = ({handleSumbit}) => {

    return (
        <>
            <form onSubmit={handleSumbit}>
                <Field title='Range:' placeholder='...' width={300} name="range"/>
                <button type="submit">Submit form</button>
            </form>
            
        </>
    );
};


export default FieldsData;