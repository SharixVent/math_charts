import React, { useState, useRef } from 'react';
import { 
    LineChart, Line,
    CartesianGrid, 
    ResponsiveContainer, 
    Tooltip, 
    XAxis, YAxis, 
    Legend, 
    Bar, BarChart,
} from 'recharts';

// import type { TooltipProps } from 'recharts';
// import type {
//     ValueType,
//     NameType,
// } from 'recharts/types/component/DefaultTooltipContent';
// import './Canva_2D.css'

// const CustomTooltip = (props: TooltipProps<ValueType, NameType>) => {
//     const { active, payload, label } = props as any;
//     if (active && payload && payload.length > 0 && label !== undefined) {
//         return (
//             <div className="custom-tooltip">
//                 <p className="label-tooltip">{`${label}`}</p>
//                 <p className="payload-tooltip">{`${payload[0].value}`}</p>
//                 <p className="desc-tooltip">Anything you want can be displayed here.</p>
//             </div>
//         );
//     }
//     return null;
// };

interface Props {
    data: {x: number; y: number}[]
}


export const Canvas_2D: React.FC<Props> = ({data}) => {
    
    return (
        <ResponsiveContainer width="80%" height={600}>  
            <LineChart data={data} margin={{top: 100, right: 10, left: 50, bottom: 20}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="x"/>
                <YAxis/>
                <Tooltip />
                {/* <Tooltip content={<CustomTooltip/>}/> */}
                <Legend/>
                <Line type="monotone" dataKey="y" fill="#8884d8"/>
            </LineChart>
        </ResponsiveContainer>
    );
};

export default Canvas_2D;