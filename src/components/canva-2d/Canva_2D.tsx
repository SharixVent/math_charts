import React, { useState, useRef } from 'react';
import Plot from 'react-plotly.js';

interface Props {
    data: {x: number; y: number}[]
}

export const Canvas_2D: React.FC<Props> = ({data}) => {
    const safeData = Array.isArray(data) ? data : [];
    const x = safeData.map(point => point.x)
    const y = safeData.map(point => point.y)

    return (
        <Plot
      data={[
        {
          x,
          y,
          type: 'scatter',
          mode: 'lines',
          marker: {color: 'blue'},
        },
      ]}
      layout={{width: 600, height: 400}}
    />
    );
};

export default Canvas_2D;