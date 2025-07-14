import React from "react";
import Field from "../field/Field";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import "./Fields.css";
import AccordionField from "../accordionField/AccordionField";
import { parse as mathParse } from "mathjs";


export interface Annotation {
  x: number;
  y: number;
  text: string;
}

interface FieldsDataProps {
  functionsData: {
    type: "function" | "equation";
    function: string;
    equation: string;
    range_from: number;
    range_to: number;
    step: number;
    color: string;
    label?: string;
  }[];
  onFieldChange: (idx: number, field: string, value: any) => void;
  onAddFunction: () => void;
  onRemoveFunction: (idx: number) => void;
  ymin?: number | "";
  ymax?: number | "";
  setYmin: (value: number | "") => void;
  setYmax: (value: number | "") => void;
  xAxisTitle: string;
  yAxisTitle: string;
  setXAxisTitle: (t: string) => void;
  setYAxisTitle: (t: string) => void;
  annotations: Annotation[];
  setAnnotations: React.Dispatch<React.SetStateAction<Annotation[]>>;
}

function toLatex(expr: string): string {
  try {
    const node = mathParse(expr);
    return node.toTex({ parenthesis: "keep", implicit: "show" });
  } catch {
    return expr;
  }
}

function detectCircleParams(equation: string) {
  const eq = equation.replace(/\s+/g, "");
  const re =
    /^(?:\(?x([+-]\d*\.?\d+)\)?\^2|x\^2)\+(?:\(?y([+-]\d*\.?\d+)\)?\^2|y\^2)=([\d.]+)(?:\^2)?$/;
  const m = eq.match(re);
  if (!m) return null;

  const [, sx, sy, rOrR2] = m;

  const centerX = sx ? -parseFloat(sx) : 0;
  const centerY = sy ? -parseFloat(sy) : 0;
  let radius = parseFloat(rOrR2);

  if (!eq.includes(`=${rOrR2}^2`)) {
    radius = Math.sqrt(radius);
  }
  return { centerX, centerY, radius };
}

function parseNumPow(raw: string): number {
  const [base, exp] = raw.split("^").map((s) => parseFloat(s));
  return exp != null ? Math.pow(base, exp) : base;
}

function detectEllipseParams(equation: string) {
  const eq = equation.replace(/\s+/g, "");
  const re =
    /^\(?x([+-]\d+(?:\.\d+)?)?\)\^2\/(\d+(?:\.\d+)?(?:\^\d+(?:\.\d+)?)?)\+\(?y([+-]\d+(?:\.\d+)?)?\)\^2\/(\d+(?:\.\d+)?(?:\^\d+(?:\.\d+)?)?)=(\d+(?:\.\d+)?(?:\^\d+(?:\.\d+)?)?)$/;
  const m = eq.match(re);
  if (!m) return null;
  const [, sx, Araw, sy, Braw, Craw] = m;
  const centerX = sx ? -parseFloat(sx) : 0;
  const centerY = sy ? -parseFloat(sy) : 0;
  const A = parseNumPow(Araw),
    B = parseNumPow(Braw),
    C = parseNumPow(Craw);
  if ([A, B, C].some((v) => isNaN(v) || v <= 0)) return null;

  const a = Math.sqrt(A * C),
    b = Math.sqrt(B * C);
  return { centerX, centerY, a, b };
}

function handleAutoRange(
  idx: number,
  functionsData: FieldsDataProps["functionsData"],
  onFieldChange: FieldsDataProps["onFieldChange"]
) {
  const entry = functionsData[idx];
  if (entry.type !== "equation") return;

   const raw = entry.equation.trim();
  const opMatch = raw.match(/(<=|>=|<|>|=)/);
  if (!opMatch) return;
  const op = opMatch[1];
  const [lhsRaw, rhsRaw] = raw.split(op);
  const lhs = lhsRaw.trim();
  const rhs = rhsRaw.trim();
  
  const eqForDetect = `${lhs}=${rhs}`

  const circ = detectCircleParams(eqForDetect);
  if (circ) {
    const { centerX, centerY, radius } = circ;
    const x0 = centerX - radius,
      x1 = centerX + radius;
    const y0 = centerY - radius,
      y1 = centerY + radius;
    onFieldChange(idx, "range_from", Math.floor(Math.min(x0, y0)) - 1);
    onFieldChange(idx, "range_to", Math.ceil(Math.max(x1, y1)) + 1);
    return;
  }

  const ell = detectEllipseParams(eqForDetect);
  if (ell) {
    const { centerX, centerY, a, b } = ell;
    const pad = Math.max(Math.min(Math.max(a, b) * 0.1, 12), 1.5);
    const x0 = centerX - a - pad,
      x1 = centerX + a + pad;
    const y0 = centerY - b - pad,
      y1 = centerY + b + pad;
    const low = Math.floor(Math.min(x0, y0));
    const high = Math.ceil(Math.max(x1, y1));
    onFieldChange(idx, "range_from", low);
    onFieldChange(idx, "range_to", high);
    return;
  }

  alert("Nie rozpoznano klasycznego okręgu ani elipsy.");
}

const COLORS = [
  { value: "blue", label: "Niebieski" },
  { value: "red", label: "Czerwony" },
  { value: "green", label: "Zielony" },
  { value: "orange", label: "Pomarańczowy" },
  { value: "purple", label: "Fioletowy" },
  { value: "black", label: "Czarny" },
  { value: "magenta", label: "Magenta" },
  { value: "cyan", label: "Cyjan" },
  { value: "brown", label: "Brązowy" },
  { value: "pink", label: "Różowy" },
];

export const FieldsData: React.FC<FieldsDataProps> = ({
  functionsData,
  onFieldChange,
  onAddFunction,
  onRemoveFunction,
  ymin, ymax, setYmin, setYmax,
  xAxisTitle, yAxisTitle, setXAxisTitle, setYAxisTitle,
  annotations, setAnnotations
}) => (
  <div className="form">
    {/* Y‐min / Y‐max / axis titles */}
    <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 10 }}>
      <Field
        title="Y min:" type="number" placeholder="auto" width={120}
        name="ymin" value={ymin}
        onChange={e => setYmin(e.target.value !== "" ? Number(e.target.value) : "")}
      />
      <Field
        title="Y max:" type="number" placeholder="auto" width={120}
        name="ymax" value={ymax}
        onChange={e => setYmax(e.target.value !== "" ? Number(e.target.value) : "")}
      />
      <Field
        title="X Axis:" type="text" width={200}
        name="xAxis" value={xAxisTitle}
        onChange={e => setXAxisTitle(e.target.value)}
      />
      <Field
        title="Y Axis:" type="text" width={200}
        name="yAxis" value={yAxisTitle}
        onChange={e => setYAxisTitle(e.target.value)}
      />
    </div>

    {functionsData.map((item, idx) => (
      <AccordionField key={idx} title={`Funkcja #${idx+1}`}>
        {/* optional legend label */}
        <Field
          title="Trace Label:" type="text" width={300}
          name="label" value={item.label || ""}
          style={{marginBottom: 30}}
          onChange={e => onFieldChange(idx, "label", e.target.value)}
        />

        {/* type selector */}
        <div style={{ fontWeight: 500, marginBottom: 4 }}>
          Typ:
          <select
            value={item.type}
            onChange={e => onFieldChange(idx, "type", e.target.value)}
            style={{ marginLeft: 8, minWidth: 180, fontSize: 16, padding: "2px 7px", borderRadius: 7 }}
          >
            <option value="function">Funkcja (np. y=x^2)</option>
            <option value="equation">Równanie (np. x^2+y^2=4)</option>
          </select>
        </div>

        {/* function‐input */}
        {item.type === "function" && (
          <>
            <Field
              title="Funkcja:" type="text" placeholder="np. x^2" width={350}
              name="function" value={item.function}
              onChange={e => onFieldChange(idx, "function", e.target.value)}
            />
            {item.function.trim() !== "" && (
              <div style={{
                minHeight: 36, margin: "5px 0 14px",
                background: "#f8fafd", borderRadius: 5,
                padding: 8, fontSize: 20, boxShadow: "0 0 2px #eef"
              }}>
                <BlockMath math={toLatex(item.function)} errorColor="#e02020" />
              </div>
            )}
          </>
        )}

        {/* equation‐input */}
        {item.type === "equation" && (
          <>
            <Field
              title="Równanie:" type="text" placeholder="np. x^2 + y^2 = 4" width={350}
              name="equation" value={item.equation}
              onChange={e => onFieldChange(idx, "equation", e.target.value)}
            />
            {item.equation.trim() !== "" && (
              <div style={{
                minHeight: 36,
                margin: "5px 0 14px",
                background: "#f8fafd",
                borderRadius: 5,
                padding: 8,
                fontSize: 20,
                boxShadow: "0 0 2px #eef",
                display: "flex",
                alignItems: "center",
                gap: 8,
                overflowX: "auto",
                whiteSpace: "nowrap"
              }}>
                {(() => {
                  const parts = item.equation.split(/(<=|>=|<|>|=)/);
                  const [lhsRaw, opRaw, rhsRaw] = parts;
                  if (!opRaw) {
                    return <BlockMath math={toLatex(item.equation)} errorColor="#e02020"/>;
                  }
                  const opTeX: Record<string,string> = {
                    "<":   "\\lt",
                    "<=": "\\leq",
                    ">":   "\\gt",
                    ">=": "\\geq",
                    "=":  "=",
                  };

                  const lhsTeX = toLatex(lhsRaw);
                  const rhsTeX = toLatex(rhsRaw);

                  return (
                    <>
                      <BlockMath math={lhsTeX}          errorColor="#e02020" />
                      <BlockMath math={opTeX[opRaw]}    errorColor="#e02020" />
                      <BlockMath math={rhsTeX}          errorColor="#e02020" />
                    </>
                  );
                })()}
              </div>
            )}



            <button
              type="button"
              style={{ marginLeft: 10, marginTop: 10, fontSize: 13, background: "#eef", color: "#226", borderRadius: 5, padding: "4px 10px" }}
              onClick={() => handleAutoRange(idx, functionsData, onFieldChange)}
            >
              Auto range
            </button>
            {" (Works only for circle and ellipse)"}
          </>
        )}

        {/* range / step / color */}
        <Field
          title="Range from:" type="number" placeholder="-20" width={120}
          name="range_from" value={item.range_from}
          onChange={e => onFieldChange(idx, "range_from", Number(e.target.value))}
        />
        <Field
          title="Range to:" type="number" placeholder="20" width={120}
          name="range_to" value={item.range_to}
          onChange={e => onFieldChange(idx, "range_to", Number(e.target.value))}
        />
        <Field
          title="Step:" type="number" min={0.001} max={1} step={0.001} width={80}
          name="step" defaultValue={item.step} value={item.step}
          onChange={e => onFieldChange(idx, "step", Number(e.target.value))}
        />

        <div style={{ margin: "8px 0" }}>
          <label style={{ marginRight: 8, fontWeight: 500 }}>Kolor:</label>
          <select
            value={item.color}
            onChange={e => onFieldChange(idx, "color", e.target.value)}
            style={{ minHeight: 30, textAlign: "center", fontSize: 20, minWidth: 150, backgroundColor: item.color, color: "white" }}
          >
            {COLORS.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {functionsData.length > 1 && (
          <button
            type="button"
            style={{ marginTop: 6, minHeight: 35, background: "#fbb", color: "#400", borderRadius: 6 }}
            onClick={() => onRemoveFunction(idx)}
          >
            Usuń tę funkcję
          </button>
        )}
      </AccordionField>
    ))}
    <button
      type="button"
      style={{ marginTop: 12, marginBottom: 16, minHeight: 35, background: "#bfb", color: "#040", borderRadius: 6, fontWeight: "bold" }}
      onClick={onAddFunction}
    >
      Dodaj funkcję +
    </button>

    {/* annotations */}
    <div style={{ fontWeight: 500, marginTop: 20 }}>Annotations</div>
    {annotations.map((ann, i) => (
      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <Field
          title="x:" type="number" width={80}
          name={`ann-x-${i}`} value={ann.x}
          onChange={e =>
            setAnnotations(a =>
              a.map((old, j) =>
                j === i
                  ? { ...old, x: Number(e.target.value) }
                  : old
              )
            )
          }
        />

        <Field
          title="y:" type="number" width={80}
          name={`ann-y-${i}`} value={ann.y}
          onChange={e =>
            setAnnotations(a =>
              a.map((old, j) =>
                j === i
                  ? { ...old, y: Number(e.target.value) }
                  : old
              )
            )
          }
        />
        <Field
          title="Text:" type="text" width={200}
          name={`ann-t-${i}`} value={ann.text}
          onChange={e =>
            setAnnotations(a =>
              a.map((old, j) =>
                j === i
                  ? { ...old, text: e.target.value }
                  : old
              )
            )
          }
        />
        <button type="button" onClick={() =>
          setAnnotations(a => a.filter((_, j) => j !== i))
        }>
          Remove
        </button>
      </div>
    ))}
    <button type="button" onClick={() =>
      setAnnotations(a => [...a, { x: 0, y: 0, text: "" }])
    }>
      + Add Annotation
    </button>

  </div>
);

export default FieldsData;