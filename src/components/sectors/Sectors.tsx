import React, { useState, useEffect, useRef } from "react";
import Canva_2D from "../canva-2d/Canva_2D";
import Canva_3D from "../canva-3d/Canva_3D";
import SwitchButton from "../buttons/switch/Switch";
import FieldsData from "../fieldsData/Fields";
import Popup from "../popup/Popup";
import { parse as parse2, eval as eval2 } from "expression-eval";
import "./Sectors.css";
import SaveLoad from "../buttons/save_load/SaveLoad";

type FunctionType = "function" | "equation";

interface FunctionEntry {
  type: FunctionType;
  function: string;
  equation: string;
  range_from: number;
  range_to: number;
  step: number;
  color: string;
  label?: string;
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
    {
      type: "function",
      function: "",
      equation: "",
      range_from: -20,
      range_to: 20,
      step: 0.01,
      color: "blue",
      label: "",
    },
  ]);
  const [switchT, setSwitchT] = useState<"2D" | "3D">("2D");
  const [showPopup, setShowPopup] = useState(false);
  const [plotData, setPlotData] = useState<any[]>([]);
  const [yRange, setYRange] = useState<[number, number]>([0, 1]);
  const [ymin, setYmin] = useState<number | "">("");
  const [ymax, setYmax] = useState<number | "">("");
  const [xAxisTitle, setXAxisTitle] = useState<string>("");
  const [yAxisTitle, setYAxisTitle] = useState<string>("");
  const [annotations, setAnnotations] = useState<
    { x: number; y: number; text: string }[]
  >([]);


  const customReplacements: Array<{
    regex: RegExp;
    replacer: (m: string, ...g: string[]) => string;
  }> = [
    {
      regex: /(\([^()]*\)|[A-Za-z0-9_.]+)\s*\^\s*([A-Za-z0-9_.]+|\([^()]*\))/g,
      replacer: (_m, base, exp) => `pow(${base},${exp})`,
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
    { regex: /\)(?=[A-Za-z_\(])/g, replacer: () => ")*" },
    { regex: /\bpi\b/gi, replacer: () => "PI" },
    { regex: /\be\b/gi, replacer: () => "E" },
    { regex: /(\d+(?:\.\d+)?|\b[a-zA-Z_]\w*\b|\))\s+(\(?[a-zA-Z_]\w*\b|\()/g, replacer: (_m, left, right) => `${left}*${right}` },
    { regex: /([a-zA-Z_])\s+([a-zA-Z_])/g, replacer: (_m, left, right) => `${left}*${right}` },
  ];

  const regexFunctionPairs = [
    { name: "sin", regex: /\bsin\s*\(/, fn: Math.sin },
    { name: "cos", regex: /\bcos\s*\(/, fn: Math.cos },
    { name: "tan", regex: /\btan\s*\(/, fn: Math.tan },
    { name: "log", regex: /\blog\s*\(/, fn: Math.log },
    { name: "exp", regex: /\bexp\s*\(/, fn: Math.exp },
    { name: "sqrt", regex: /\bsqrt\s*\(/, fn: Math.sqrt },
    { name: "abs", regex: /\babs\s*\(/, fn: Math.abs },
    { name: "pow", regex: /\bpow\s*\(/, fn: Math.pow },
  ];

  useEffect(() => {
    const traces: any[] = [];
    let globalYmin = Number.POSITIVE_INFINITY;
    let globalYmax = Number.NEGATIVE_INFINITY;

    functionsData.forEach((entry, idx) => {
      const { type, function: inputFunc, equation, range_from, range_to, step, color, label } = entry;
      const traceName = label?.trim() || (type === "function" ? inputFunc : equation);

      if (type === "function" && inputFunc.trim()) {
        let expr = inputFunc;
        for (const { regex, replacer } of customReplacements) {
          expr = expr.replace(regex, replacer as any);
        }
        const isNumber = !isNaN(Number(expr.trim()));
        let ast: any;
        if (!isNumber) {
          try { ast = parse2(expr); }
          catch { return; }
        }
        const ctx: Record<string, any> = { PI: Math.PI, E: Math.E };
        regexFunctionPairs
          .filter(p => p.regex.test(expr))
          .forEach(p => (ctx[p.name] = p.fn));

        const N = 1000;
        const xs = linspace(range_from, range_to, N);
        const ys = xs.map(x => {
          if (isNumber) return Number(expr);
          try { return eval2(ast, { x, ...ctx }); }
          catch { return NaN; }
        });

        const finite = ys.filter(v => isFinite(v));
        if (finite.length) {
          globalYmin = Math.min(globalYmin, Math.min(...finite));
          globalYmax = Math.max(globalYmax, Math.max(...finite));
        }

        traces.push({
          x: xs,
          y: ys,
          type: "scatter",
          mode: "lines",
          name: traceName,
          marker: { color },
          line: {
        color,
        shape: 'spline',    
        smoothing: 1.3 ,
        simplify: false 
  },
          hovertemplate:                  
      'x: %{x:.3f}<br>y: %{y:.3f}<extra></extra>',
        });
      }

      if (type === "equation" && equation.trim()) {
        const opMatch = equation.match(/(<=|>=|<|>|=)/);
        if (!opMatch) return;
        const op = opMatch[1];
        const [lhs0, rhs0] = equation.split(op);
        let lhs = lhs0.trim(), rhs = rhs0.trim();
        for (const { regex, replacer } of customReplacements) {
          lhs = lhs.replace(regex as any, replacer as any);
          rhs = rhs.replace(regex as any, replacer as any);
        }
        let astL: any, astR: any;
        try { astL = parse2(lhs); astR = parse2(rhs); }
        catch { return; }

        const ctxBase: Record<string, any> = { PI: Math.PI, E: Math.E };
        regexFunctionPairs
          .filter(p => p.regex.test(lhs + rhs))
          .forEach(p => (ctxBase[p.name] = p.fn));

        const N = 500;
        const xArr = linspace(range_from, range_to, N);
        const yArr = linspace(range_from, range_to, N);

        const Z = yArr.map(y =>
          xArr.map(x => {
            let vL = NaN, vR = NaN;
            try { vL = eval2(astL, { x, y, ...ctxBase }); } catch {}
            try { vR = eval2(astR, { x, y, ...ctxBase }); } catch {}
            return vL - vR;
          })
        );

        const lg = `ineq-${idx}`;
        if (op === "=") {
          traces.push({
            x: xArr, y: yArr, z: Z,
            type: "contour",
            contours: { start: 0, end: 0, size: 1, coloring: "none" },
            line: { color, width: 2 },
            showscale: false,
            name: traceName,
            legendgroup: lg,
            showlegend: true,
            hovertemplate:                  
      'x: %{x:.3f}<br>y: %{y:.3f}<extra></extra>',
          });
        } else {
          const mask = Z.map(row =>
            row.map(v => {
              switch (op) {
                case "<":  return v <  0 ? 1 : 0;
                case "<=": return v <= 0 ? 1 : 0;
                case ">":  return v >  0 ? 1 : 0;
                case ">=": return v >= 0 ? 1 : 0;
              }
            })
          );
          traces.push({
            x: xArr, y: yArr, z: mask,
            type: "heatmap",
            zsmooth: "best",
            colorscale: [
              [0, "rgba(0,0,0,0)"],
              [1, color]
            ],
            showscale: false,
            name: `${traceName} ${op}`,
            legendgroup: lg,
            showlegend: false,
            hovertemplate:                  
      'x: %{x:.3f}<br>y: %{y:.3f}<extra></extra>',
          });
          traces.push({
            x: xArr, y: yArr, z: Z,
            type: "contour",
            contours: { start: 0, end: 0, size: 1, coloring: "none" },
            line: { color, width: 2 },
            showscale: false,
            name: traceName,
            legendgroup: lg,
            showlegend: true,
            hovertemplate:                  
      'x: %{x:.3f}<br>y: %{y:.3f}<extra></extra>',
          });
        }

        globalYmin = Math.min(globalYmin, range_from);
        globalYmax = Math.max(globalYmax, range_to);
      }
    });

    setYRange([
      ymin !== "" ? Number(ymin) : isFinite(globalYmin) ? globalYmin : 0,
      ymax !== "" ? Number(ymax) : isFinite(globalYmax) ? globalYmax : 1,
    ]);
    setPlotData(traces);
  }, [functionsData, ymin, ymax]);



  const handleConfirmSwitch = () => {
    setSwitchT((prev) => (prev === "2D" ? "3D" : "2D"));
    setShowPopup(false);
  };

  function handleFieldChange(idx: number, field: string, raw: string) {
  setFunctionsData(data =>
    data.map((fn, i) =>
      i === idx
        ? {
            ...fn,
            [field]:
              field === "range_from" || field === "range_to" || field === "step"
                ? raw 
                : raw,
          }
        : fn
    )
  );
}


  const addFunction = () => {
    setFunctionsData((data) => [
      ...data,
      {
        type: "function" as const,
        function: "",
        equation: "",
        range_from: -20,
        range_to: 20,
        step: 0.01,
        color: "blue",
        label: "",
      },
    ]);
  };

  const removeFunction = (idx: number) => {
    setFunctionsData((data) =>
      data.length > 1 ? data.filter((_, i) => i !== idx) : data
    );
  };


  const xMin = Math.min(...functionsData.map(f => f.range_from))
  const xMax = Math.max(...functionsData.map(f => f.range_to))

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const payload = {
      functionsData,
      ymin, ymax,
      xAxisTitle, yAxisTitle,
      annotations,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plot-data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const json = JSON.parse(ev.target?.result as string);

        if (Array.isArray(json.functionsData)) setFunctionsData(json.functionsData);
        if (typeof json.ymin !== "undefined") setYmin(json.ymin);
        if (typeof json.ymax !== "undefined") setYmax(json.ymax);
        if (typeof json.xAxisTitle === "string") setXAxisTitle(json.xAxisTitle);
        if (typeof json.yAxisTitle === "string") setYAxisTitle(json.yAxisTitle);
        if (Array.isArray(json.annotations)) setAnnotations(json.annotations);
      } catch {
        alert("Nieprawidłowy format pliku JSON.");
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  return (
    <div className="sectors">
      <div className="sector-1">
        <div className="plot-section">
          {switchT === "2D" ? (
            <Canva_2D
              data={plotData}
              layout={{
                autosize: true,
                hovermode: 'closest',
                legend: { orientation: "h", x: 0, y: 1.1 },
                xaxis:{
          title: { text: xAxisTitle || undefined },
          range: [ xMin, xMax ],
          scaleanchor: 'y',
          scaleratio: 1
        },
        yaxis:{
          title: { text: yAxisTitle || undefined },
          range: yRange,
          scaleratio: 1
        },
                annotations: annotations.map(a => ({
                  x: a.x, y: a.y, text: a.text, xref: 'x', yref: 'y',
                  showarrow: true, arrowhead: 2
                }))
              }}
            />
          ) : (
            <Canva_3D data={[]} />
          )}
        </div>
      </div>
      <div className="sector-2">
        <SwitchButton text_switch={switchT} onClick={() => setShowPopup(true)} />
        <FieldsData
          functionsData={functionsData}
          onFieldChange={handleFieldChange}
          onAddFunction={addFunction}
          onRemoveFunction={removeFunction}
          ymin={ymin}
          ymax={ymax}
          setYmin={setYmin}
          setYmax={setYmax}
          xAxisTitle={xAxisTitle}
          yAxisTitle={yAxisTitle}
          setXAxisTitle={setXAxisTitle}
          setYAxisTitle={setYAxisTitle}
          annotations={annotations}
          setAnnotations={setAnnotations}
        />
        <div style={{ marginTop: 16 }}>
          <SaveLoad onClick={handleExport} style={{ marginRight: 10, marginBottom: 20 }} title={"💾 Save…"}/>
          <SaveLoad title={"📂 Load…"} onClick={() => fileInputRef.current?.click()}/>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            style={{ display: "none", marginBottom: 20 }}
            onChange={handleFileChosen}
          />
        </div>
      </div>
      {showPopup && (
        <Popup
          title={`Switch to ${switchT === "2D" ? "3D" : "2D"}?`}
          content="Current plot will be cleared. (3D mode is not yet implemented.)"
          onClose={() => setShowPopup(false)}
          onConfirm={handleConfirmSwitch}
        />
      )}
    </div>
  );
};

export default Sectors;

