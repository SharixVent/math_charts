import React, { useState } from 'react';
import Field from "../field/Field";
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import './Fields.css';
import AccordionField from '../accordionField/AccordionField';

interface FieldsDataProps {
  functionsData: {
    type: 'function' | 'equation';
    function: string;
    equation: string;
    range_from: number;
    range_to: number;
    step: number;
    color: string;
  }[];
  onFieldChange: (idx: number, field: string, value: any) => void;
  onAddFunction: () => void;
  onRemoveFunction: (idx: number) => void;
  ymin?: number | '';
  ymax?: number | '';
  setYmin: (value: number | '') => void;
  setYmax: (value: number | '') => void;
}

// --- Zaawansowany konwerter "Desmos style" (obsługa nawiasów, dzielenia, implicit multiply, pierwiastków, potęg, abs, spacji itd.) ---
function desmosLikeLatex(expr: string): string {
  let out = expr;

  // Zamień znaki ≤ ≥ ≠ na LaTeX
  out = out.replace(/<=/g, '\\leq');
  out = out.replace(/>=/g, '\\geq');
  out = out.replace(/!=/g, '\\neq');
  out = out.replace(/==/g, '=');

  // |...| na \left|...\right|
  out = out.replace(/\|([^\|]+)\|/g, (_m, inside) => `\\left|${desmosLikeLatex(inside)}\\right|`);

  // sqrt(...) lub √(...) na \sqrt{...}
  out = out.replace(/sqrt\(([^\)]+)\)/g, (_m, inside) => `\\sqrt{${desmosLikeLatex(inside)}}`);
  out = out.replace(/√\(([^\)]+)\)/g, (_m, inside) => `\\sqrt{${desmosLikeLatex(inside)}}`);

  // Funkcje (sin, cos...) na \sin...
  out = out.replace(/\b(sin|cos|tan|log|ln|exp|arcsin|arccos|arctan)\b/g, '\\$1');

  // Pi
  out = out.replace(/\bpi\b/g, '\\pi');
  out = out.replace(/\be\b/g, 'e');

  // --- UŁAMKI ---
  // Najpierw wielkie ułamki: (coś)/(coś)
  // UWAGA: nie łapie zagnieżdżonych nawiasów, ale to bardzo trudny przypadek bez parsera
  out = out.replace(/\(([^\(\)]+)\)\/\(([^\(\)]+)\)/g, (_m, licz, mian) =>
    `\\frac{${desmosLikeLatex(licz)}}{${desmosLikeLatex(mian)}}`
  );

  // Następnie liczba/zmienna/nawias / liczba/zmienna/nawias
  out = out.replace(/([a-zA-Z0-9\}\)]+)\/([a-zA-Z0-9\{\(\\]+)/g, (_m, a, b) =>
    `\\frac{${a}}{${b}}`
  );

  // --- IMPLICIT MULTIPLY ---
  // liczba/zmienna/nawias + spacja + litera/func/nawias
  out = out.replace(/(\d+(?:\.\d+)?|\b[a-zA-Z_]\w*\b|\))\s+(\(?[a-zA-Z_]\w*\b|\()/g,
    (_m, left, right) => `${left} ${right}`
  );

  // litera spacja litera
  out = out.replace(/([a-zA-Z_])\s+([a-zA-Z_])/g,
    (_m, left, right) => `${left} ${right}`
  );

  // --- POTĘGI ---
  // x^(cos(x^2)) na x^{\cos(x^{2})}
  out = out.replace(/(\)|[a-zA-Z0-9_])\^\(([^\)]+)\)/g, (_m, base, exp) =>
    `${base}^{${desmosLikeLatex(exp)}}`
  );
  // x^sin(x) na x^{\sin(x)}
  out = out.replace(/(\)|[a-zA-Z0-9_])\^([a-zA-Z]+)\(([^\)]*)\)/g, (_m, base, func, inside) =>
    `${base}^{\\${func}(${desmosLikeLatex(inside)})}`
  );
  // x^a (a = liczba/zmienna)
  out = out.replace(/(\)|[a-zA-Z0-9_])\^([a-zA-Z0-9]+)/g, (_m, base, exp) => `${base}^{${exp}}`);

  // Usuwanie * (użytkownik może pisać *, ale podgląd desmosowy wyświetla bez)
  out = out.replace(/\*/g, ' ');

  // Spacje przed zmiennymi po liczbie/ułamku: 2x → 2 x, \frac{1}{2}x → \frac{1}{2} x
  out = out.replace(/([0-9\}])([a-zA-Z\(])/g, '$1 $2');

  // Zbędne podwójne nawiasy
  out = out.replace(/\{\{/g, '{').replace(/\}\}/g, '}');
  out = out.replace(/^\((.*)\)$/g, '$1');

  return out;
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
  { value: "pink", label: "Różowy" }
];

export const FieldsData: React.FC<FieldsDataProps> = ({
  functionsData,
  onFieldChange,
  onAddFunction,
  onRemoveFunction,
  ymin,
  ymax,
  setYmin,
  setYmax
}) => {
  return (
    <div className="form">
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 10 }}>
        <Field
          title="Y min:"
          type="number"
          placeholder="auto"
          width={120}
          name="ymin"
          value={ymin}
          onChange={e => setYmin(e.target.value !== '' ? Number(e.target.value) : '')}
        />
        <Field
          title="Y max:"
          type="number"
          placeholder="auto"
          width={120}
          name="ymax"
          value={ymax}
          onChange={e => setYmax(e.target.value !== '' ? Number(e.target.value) : '')}
        />
      </div>
      {functionsData.map((item, idx) => (
        <AccordionField key={idx} title={`Funkcja #${idx + 1}`}>
          <div style={{ fontWeight: "bold", marginBottom: 4 }}>
            Typ:{" "}
            <select
              value={item.type}
              onChange={e => onFieldChange(idx, 'type', e.target.value)}
              style={{ minWidth: 180, fontSize: 16, padding: '2px 7px', borderRadius: 7, marginLeft: 8 }}
            >
              <option value="function">Funkcja (np. y=x^2)</option>
              <option value="equation">Równanie/Nierówność (np. x^2+y^2=4)</option>
            </select>
          </div>
          {item.type === 'function' && (
            <>
              <Field
                title="Funkcja:"
                type="text"
                placeholder="np. x^2"
                width={350}
                name="function"
                value={item.function}
                onChange={e => onFieldChange(idx, 'function', e.target.value)}
              />
              <div style={{
                minHeight: 36,
                marginTop: 5,
                marginBottom: 14,
                background: '#f8fafd',
                borderRadius: 5,
                padding: 8,
                fontSize: 20,
                boxShadow: "0 0 2px #eef"
              }}>
                <BlockMath math={desmosLikeLatex(item.function || '')} errorColor="#e02020" />
              </div>
            </>
          )}
          {item.type === 'equation' && (
            <>
              <Field
                title="Równanie:"
                type="text"
                placeholder="np. x^2 + y^2 = 4"
                width={350}
                name="equation"
                value={item.equation}
                onChange={e => onFieldChange(idx, 'equation', e.target.value)}
              />
              <div style={{
                minHeight: 36,
                marginTop: 5,
                marginBottom: 14,
                background: '#f8fafd',
                borderRadius: 5,
                padding: 8,
                fontSize: 20,
                boxShadow: "0 0 2px #eef"
              }}>
                <BlockMath math={desmosLikeLatex(item.equation || '')} errorColor="#e02020" />
              </div>
            </>
          )}
          <Field
            title="Range from:"
            type="number"
            placeholder="-10"
            width={120}
            name="range_from"
            value={item.range_from}
            onChange={e => onFieldChange(idx, 'range_from', e.target.value !== '' ? Number(e.target.value) : undefined)}
          />
          <Field
            title="Range to:"
            type="number"
            placeholder="10"
            width={120}
            name="range_to"
            value={item.range_to}
            onChange={e => onFieldChange(idx, 'range_to', e.target.value !== '' ? Number(e.target.value) : undefined)}
          />
          <Field
            title="Step:"
            type="number"
            min={0.001}
            max={1}
            step={0.001}
            width={80}
            name="step"
            value={item.step}
            onChange={e => onFieldChange(idx, 'step', e.target.value !== '' ? Number(e.target.value) : undefined)}
          />
          <div style={{ marginTop: 8, marginBottom: 8 }}>
            <label style={{ marginRight: 8, fontWeight: 500 }}>Kolor:</label>
            <select
              value={item.color}
              onChange={e => onFieldChange(idx, 'color', e.target.value)}
              style={{
                marginLeft: 4,
                minHeight: 30,
                textAlign: 'center',
                fontSize: 20,
                minWidth: 150,
                backgroundColor: item.color,
                color: 'white'
              }}
            >
              {COLORS.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          {functionsData.length > 1 && (
            <button
              type="button"
              style={{ marginTop: 6, minHeight:35, background: "#fbb", color: "#400", borderRadius: 6 }}
              onClick={() => onRemoveFunction(idx)}
            >
              Usuń tę funkcję
            </button>
          )}
        </AccordionField>
      ))}
      <button
        type="button"
        style={{ marginTop: 12, minHeight:35, marginBottom: 16, background: "#bfb", color: "#040", borderRadius: 6, fontWeight: "bold" }}
        onClick={onAddFunction}
      >
        Dodaj funkcję +
      </button>
    </div>
  );
};

export default FieldsData;
