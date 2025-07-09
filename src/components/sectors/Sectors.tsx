import React, { useState, useEffect } from 'react';
import Canva_2D from '../canva-2d/Canva_2D';
import Canva_3D from '../canva-3d/Canva_3D';
import SwitchButton from '../buttons/switch/Switch';
import FieldsData from '../fieldsData/Fields';
import Popup from '../popup/Popup';
import { parse as parse2, eval as eval2 } from 'expression-eval';
import './Sectors.css';

type FunctionType = 'function' | 'equation';

interface FunctionEntry {
  type: FunctionType;
  function: string;
  equation: string;
  range_from: number;
  range_to: number;
  step: number;
  color: string;
}

function linspace(start: number, end: number, n: number): number[] {
  const arr: number[] = [];
  if (n <= 1) return [start];
  const step = (end - start) / (n - 1);
  for (let i = 0; i < n; i++) arr.push(start + i * step);
  return arr;
}

export const Sectors: React.FC = () => {
  const [functionsData, setFunctionsData] = useState<FunctionEntry[]>([
    { type: 'function', function: '', equation: '', range_from: -10, range_to: 10, step: 0.1, color: 'blue' }
  ]);
  const [switchT, setSwitchT] = useState<"2D" | "3D">("2D");
  const [showPopup, setShowPopup] = useState(false);
  const [plotData, setPlotData] = useState<any[]>([]);
  const [yRange, setYRange] = useState<[number, number]>([0, 1]);
  const [ymin, setYmin] = useState<number | ''>('');
  const [ymax, setYmax] = useState<number | ''>('');

  const customReplacements: Array<{ regex: RegExp; replacer: (m: string, ...g: string[]) => string }> = [
    {
  regex: /(\([^()]*\)|[A-Za-z0-9_.]+)\s*\^\s*([A-Za-z0-9_.]+|\([^()]*\))/g,
  replacer: (_m, base, exp) => `pow(${base},${exp})`
},

    {
  regex: /([A-Za-z0-9_.]+|\([^\)]+\))\s*\^\s*([A-Za-z0-9_.]+|\([^\)]+\))/g,
  replacer: (_m, base, exp) => `pow(${base},${exp})`
},

    { regex: /\blog(\d+)\s*\(\s*([^)]+?)\s*\)/g, replacer: (_m, base, expr) => `(log(${expr})/log(${base}))` },
    { regex: /(?<!log\d)\blog\s*\(\s*([^)]+?)\s*\)/g, replacer: (_m, expr) => `(log(${expr})/log(10))` },
    { regex: /\bln\s*\(\s*([^)]+?)\s*\)/g, replacer: (_m, expr) => `log(${expr})` },
    { regex: /\bsin\s*\(\s*([^)]+?)\s*\)/g, replacer: (_m, e) => `sin(${e})` },
    { regex: /\bcos\s*\(\s*([^)]+?)\s*\)/g, replacer: (_m, e) => `cos(${e})` },
    { regex: /\btan\s*\(\s*([^)]+?)\s*\)/g, replacer: (_m, e) => `tan(${e})` },
    { regex: /\bsqrt\s*\(\s*([^)]+?)\s*\)/g, replacer: (_m, e) => `sqrt(${e})` },
    { regex: /\babs\s*\(\s*([^)]+?)\s*\)/g, replacer: (_m, e) => `abs(${e})` },
    { regex: /\bsec\s*\(\s*([^)]+?)\s*\)/g, replacer: (_m, e) => `1/cos(${e})` },
    { regex: /\bcsc\s*\(\s*([^)]+?)\s*\)/g, replacer: (_m, e) => `1/sin(${e})` },
    { regex: /\bcot\s*\(\s*([^)]+?)\s*\)/g, replacer: (_m, e) => `1/tan(${e})` },
    { regex: /\bexp\s*\(\s*([^)]+?)\s*\)/g, replacer: (_m, e) => `exp(${e})` },
    { regex: /(?<![A-Za-z0-9_])(\d+(?:\.\d+)?)(?=[A-Za-z_\(])/g, replacer: (_m, num) => `${num}*` },
    { regex: /\)(?=[A-Za-z_\(])/g, replacer: () => ')*' },
    { regex: /\bpi\b/gi, replacer: () => 'PI' },
    { regex: /\be\b/gi, replacer: () => 'E' },
    // 1. liczba lub zamknięty nawias przed literą lub otwartym nawiasem, np. 3x, 2(y+1), (x+1)(y-1), 5sin(x)
    { 
    regex: /(\d+(?:\.\d+)?|\b[a-zA-Z_]\w*\b|\))\s+(\(?[a-zA-Z_]\w*\b|\()/g, 
    replacer: (_m, left, right) => `${left}*${right}`
    },
    // 2. litera przed literą (x y -> x*y)
    {
    regex: /([a-zA-Z_])\s+([a-zA-Z_])/g,
    replacer: (_m, left, right) => `${left}*${right}`
    },
  


  ];

  const regexFunctionPairs = [
    { name: 'sin', regex: /\bsin\s*\(/, fn: Math.sin },
    { name: 'cos', regex: /\bcos\s*\(/, fn: Math.cos },
    { name: 'tan', regex: /\btan\s*\(/, fn: Math.tan },
    { name: 'log', regex: /\blog\s*\(/, fn: Math.log },
    { name: 'exp', regex: /\bexp\s*\(/, fn: Math.exp },
    { name: 'sqrt', regex: /\bsqrt\s*\(/, fn: Math.sqrt },
    { name: 'abs', regex: /\babs\s*\(/, fn: Math.abs },
    { name: 'pow', regex: /\bpow\s*\(/, fn: Math.pow },
  ];

  useEffect(() => {
    const traces: any[] = [];
    let globalYmin = Number.POSITIVE_INFINITY;
    let globalYmax = Number.NEGATIVE_INFINITY;

    functionsData.forEach((entry) => {
      const { type, function: inputFunc, equation, range_from, range_to, step, color } = entry;

      // FUNKCJE y = f(x)
      if (type === 'function' && inputFunc) {
        let inputFunction = inputFunc;
        for (const { regex, replacer } of customReplacements) {
          inputFunction = inputFunction.replace(regex, replacer as any);
        }
        const isNumber = !isNaN(Number(inputFunction.trim()));
        let parsedFunction: any;
        if (!isNumber) {
          try { parsedFunction = parse2(inputFunction); } catch (e) { return; }
        }
        const usedFunctions = regexFunctionPairs.filter(pair => pair.regex.test(inputFunction));
        const context: Record<string, any> = {};
        usedFunctions.forEach(pair => { context[pair.name] = pair.fn; });
        context.E = Math.E; context.PI = Math.PI;

        let x: number[] = [];
        let y: number[] = [];
        if (isNumber) {
          const yValue = Number(inputFunction.trim());
          const length = Math.floor((range_to - range_from) / step) + 1;
          x = Array.from({ length }, (_, i) => range_from + i * step);
          y = Array.from({ length }, () => yValue);
        } else {
          const length = Math.floor((range_to - range_from) / step) + 1;
          x = Array.from({ length }, (_, i) => range_from + i * step);
          y = x.map(xVal => {
            context.x = xVal;
            let yVal = NaN;
            try { yVal = eval2(parsedFunction, context); } catch { yVal = NaN; }
            return yVal;
          });
        }
        const finiteY = y.filter(v => Number.isFinite(v));
        const minY = finiteY.length ? Math.min(...finiteY) : 0;
        const maxY = finiteY.length ? Math.max(...finiteY) : 0;
        globalYmin = Math.min(globalYmin, minY);
        globalYmax = Math.max(globalYmax, maxY);

        traces.push({
          x,
          y,
          type: 'scatter',
          mode: 'lines',
          name: inputFunc,
          marker: { color: color || 'blue' }
        });
      }

      // RÓWNANIA & NIERÓWNOŚCI (implicit)
      if (type === 'equation' && equation) {
        // Rozpoznaj operator
        let operator = '';
        let split = [];
        if (equation.includes('>=')) { operator = '>='; split = equation.split('>='); }
        else if (equation.includes('<=')) { operator = '<='; split = equation.split('<='); }
        else if (equation.includes('>')) { operator = '>'; split = equation.split('>'); }
        else if (equation.includes('<')) { operator = '<'; split = equation.split('<'); }
        else if (equation.includes('=')) { operator = '='; split = equation.split('='); }
        else return;

        let lhs = split[0], rhs = split[1];
        for (const { regex, replacer } of customReplacements) {
          lhs = lhs.replace(regex, replacer as any);
          rhs = rhs.replace(regex, replacer as any);
        }
        let parsedLHS, parsedRHS;
        try {
          parsedLHS = parse2(lhs);
          parsedRHS = parse2(rhs);
        } catch (e) { return; }

        const usedFunctions = regexFunctionPairs.filter(pair => pair.regex.test(lhs + rhs));
        const context: Record<string, any> = {};
        usedFunctions.forEach(pair => { context[pair.name] = pair.fn; });
        context.E = Math.E; context.PI = Math.PI;

        const N = 800;
        const xArr = linspace(range_from, range_to, N);
        const yArr = linspace(range_from, range_to, N);

        if (operator && operator !== '=') {
          // Obsługa nierówności: generuj maskę
          const mask = yArr.map(y =>
            xArr.map(x => {
              const ctx = { x, y, ...context };
              let v1 = NaN, v2 = NaN;
              try { v1 = eval2(parsedLHS, ctx); } catch {}
              try { v2 = eval2(parsedRHS, ctx); } catch {}
              switch (operator) {
                case '>': return v1 > v2 ? 1 : 0;
                case '<': return v1 < v2 ? 1 : 0;
                case '>=': return v1 >= v2 ? 1 : 0;
                case '<=': return v1 <= v2 ? 1 : 0;
                default: return 0;
              }
            })
          );
          globalYmin = Math.min(globalYmin, range_from);
          globalYmax = Math.max(globalYmax, range_to);

          traces.push({
            x: xArr,
            y: yArr,
            z: mask,
            type: 'heatmap',
            colorscale: [
              [0, 'rgba(0,0,0,0)'],
              [1, color || 'blue']
            ],
            showscale: false,
            name: equation,
            showlegend: true,
            hovertemplate: 'x: %{x}<br>y: %{y}<br>%{name}<extra></extra>'
          });
          return; // NIE idź dalej dla contour
        }

        // Standardowe równanie (implicit, np. okrąg, elipsa)
        const z = yArr.map(y =>
          xArr.map(x => {
            const ctx = { x, y, ...context };
            let v1 = NaN, v2 = NaN;
            try { v1 = eval2(parsedLHS, ctx); } catch {}
            try { v2 = eval2(parsedRHS, ctx); } catch {}
            return v1 - v2;
          })
        );

        globalYmin = Math.min(globalYmin, range_from);
        globalYmax = Math.max(globalYmax, range_to);

        traces.push({
          x: xArr,
          y: yArr,
          z,
          type: 'contour',
          contours: {
            coloring: 'none',
            start: 0,
            end: 0,
            size: 1,
            showlabels: false
          },
          line: { color: color || 'blue', width: 2 },
          name: equation,
          showlegend: true,
          showscale: false,
          autocolorscale: false,
          hovertemplate: 'x: %{x}<br>y: %{y}<br>%{name}<extra></extra>'
        });
      }
    });

    setYRange([
      ymin !== '' && ymin !== undefined ? Number(ymin) : (isFinite(globalYmin) ? globalYmin : 0),
      ymax !== '' && ymax !== undefined ? Number(ymax) : (isFinite(globalYmax) ? globalYmax : 1)
    ]);
    setPlotData(traces);
  }, [functionsData, ymin, ymax]);

  const handleConfirmSwitch = () => {
    setSwitchT(prev => prev === '2D' ? "3D" : "2D");
    setShowPopup(false);
  };
  const handleShowPopup = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

  const handleFieldChange = (idx: number, field: string, value: any) => {
    setFunctionsData(data =>
      data.map((item, i) =>
        i === idx
          ? { ...item, [field]: field === 'type' ? value as FunctionType : value }
          : item
      )
    );
  };

  const addFunction = () => {
    setFunctionsData(data => [
      ...data,
      { type: 'function' as const, function: '', equation: '', range_from: -10, range_to: 10, step: 0.1, color: 'blue' }
    ]);
  };

  const removeFunction = (idx: number) => {
    setFunctionsData(data => data.length > 1 ? data.filter((_, i) => i !== idx) : data);
  };

  const changeMode = switchT === '2D' ? "3D" : "2D";

  return (
    <div className="sectors">
      <div className="sector-1">
        <div className="plot-section">
          {switchT === '2D' ? (
            <Canva_2D
              data={plotData}
              layout={{
                autosize: true,
                legend: { orientation: 'h', x: 0, y: 1.1 },
                yaxis: { range: yRange, scaleanchor: 'x', scaleratio: 1 },
                xaxis: { scaleanchor: 'y', scaleratio: 1 }
              }}
            />
          ) : (
            <Canva_3D data={[]} />
          )}
        </div>
      </div>
      <div className="sector-2">
        <SwitchButton text_switch={switchT} onClick={handleShowPopup} />
        <FieldsData
          functionsData={functionsData}
          onFieldChange={handleFieldChange}
          onAddFunction={addFunction}
          onRemoveFunction={removeFunction}
          ymin={ymin}
          ymax={ymax}
          setYmin={setYmin}
          setYmax={setYmax}
        />
      </div>
      {showPopup && (
        <Popup
          title={`Are you sure you want to change to '${changeMode}' mode?`}
          content="Your data will be lost."
          onClose={handleClosePopup}
          onConfirm={handleConfirmSwitch}
        />
      )}
    </div>
  );
};

export default Sectors;
