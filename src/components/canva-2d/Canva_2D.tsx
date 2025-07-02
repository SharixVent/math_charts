import React, { useState, useRef } from 'react';
import { 
    LineChart, Line,
    CartesianGrid, 
    ResponsiveContainer, 
    Tooltip, 
    XAxis, YAxis, 
    Legend, 
    Bar, BarChart 
} from 'recharts';

export const Canvas_2D: React.FC = () => {

    const data = Array.from({ length: 100 }, (_,index) => {
        const x: number = index * 0.1;
        const y: number = Math.sin(x);
        return {x, y}
    })

    return (
        <ResponsiveContainer width="80%" height={600}>  
            <LineChart data={data} margin={{top: 100, right: 10, left: 50, bottom: 20}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="x"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
                <Line type="monotone" dataKey="y" fill="#8884d8"/>
            </LineChart>
        </ResponsiveContainer>
    );
};

export default Canvas_2D;