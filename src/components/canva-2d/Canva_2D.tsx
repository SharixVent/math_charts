import React from 'react';
import Plot from 'react-plotly.js';

interface Props {
    data: {x: number; y: number}[];
    yMinOverride?: number;
    yMaxOverride?: number;
}

export const Canvas_2D: React.FC<Props> = ({data, yMaxOverride, yMinOverride}) => {
    const safeData = Array.isArray(data) ? data : [];
    const x = safeData.map(point => point.x)
    const y = safeData.map(point => point.y)
    const finiteY = y.filter(v => Number.isFinite(v));
    const autoMin = finiteY.length ? Math.min(...finiteY) : 0;
    const autoMax = finiteY.length ? Math.max(...finiteY) : 0;
    
    const yMin = typeof yMinOverride === 'number' ? yMinOverride : autoMin;
    const yMax = typeof yMaxOverride === 'number' ? yMaxOverride : autoMax;
    
    return (
        <Plot
            data={[
                {
                    x,
                    y,
                    type: 'scatter',
                    mode: 'lines',
                    marker: { color: 'blue' },
                },
            ]}
            layout={{ 
                autosize: true,
                yaxis: { range: [yMin, yMax]}
             }}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
            config={{displaylogo: false}}
        />
    );
};

export default Canvas_2D;