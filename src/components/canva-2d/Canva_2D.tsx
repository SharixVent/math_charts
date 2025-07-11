import React from 'react';
import Plot from 'react-plotly.js';

interface Props {
    data: any[];
    layout?: any;
}

export const Canvas_2D: React.FC<Props> = ({ data, layout }) => {
    return (
        <Plot
            data={data}
            layout={layout}
            style={{ width: '100%', height: '150%' }}
            useResizeHandler={true}
            config={{ displaylogo: false }}
        />
    );
};

export default Canvas_2D;
