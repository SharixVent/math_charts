import React from 'react';
import Plot from 'react-plotly.js';
import type { Layout }  from 'plotly.js'

interface Props {
    data: {x: number; y: number}[];
    yMinOverride?: number;
    yMaxOverride?: number;
}

const layout: Partial<Layout> = {
  title: { text: '3D Spiral' },
  autosize: true,
  scene: {
    xaxis: { title: {text: 'X'} },
    yaxis: { title: {text: 'Y'} },
    zaxis: { title: {text: 'Z'} },
  },
};

export const Canvas_3D: React.FC<Props> = ({data, yMinOverride, yMaxOverride}) => {
    console.log(yMinOverride)
  const linspaceFn = (startValue: number, stopValue: number, cardinality: number): number[] => {
    const arr: number[] = [];
    const step = (stopValue - startValue) / (cardinality - 1);
    for (let i = 0; i < cardinality; i++) {
      arr.push(parseFloat((startValue + step * i).toFixed(3)));
    }
    return arr;
  };

  const t = linspaceFn(0, 20, 100);
  const x = t.map(i => Math.cos(i));
  const y = t.map(i => Math.sin(i));
  const z = t;

  return (
    <Plot
      data={[
        {
          x,
          y,
          z,
          mode: 'markers',
          type: 'scatter3d',
          marker: {
            size: 12,
            color: z,
            colorscale: 'Viridis',
            opacity: 0.8,
          },
        },
      ]}
      layout={layout}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler={true}
      config={{displaylogo: false}}
    />
  );
};

export default Canvas_3D;
