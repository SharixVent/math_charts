import React, { useState, useEffect } from 'react';
import Canvas_2D from '../canva-2d/Canva_2D';
import Canvas_3D from '../canva-3d/Canva_3D'; 
import SwitchButton from '../buttons/switch/Switch';
import FieldsData from '../fieldsData/Fields';
import Popup from '../popup/Popup';
import { parse as parse2, eval as eval2} from 'expression-eval';
import './Sectors.css'

export const Sectors: React.FC = () => {

    const [formJson, setFormJson] = useState<{ [key: string]: any }>({});
    const [switchT, setSwitchT] = useState<"2D" | "3D">("2D");
    const [showPopup, setShowPopup] = useState(false);
    const [data, setData] = useState<{x: number; y: number}[]>();

    const customReplacements: Array<{
    regex: RegExp;
    replacer: (match: string, ...groups: string[]) => string;
    }> = [
    // log(x) => log(x)/log(10)
    {
        regex: /(?<!log\d*)\blog\s*\(\s*([^)]+?)\s*\)/g,
        replacer: (_match, expr) => `(log(${expr})/log(10))`,
    },
    // log base b: log2(x) => log(x)/log(2)
    {
        regex: /log(\d+)\s*\(\s*([^)]+?)\s*\)/g,
        replacer: (_match, base, expr) => `(log(${expr})/log(${base}))`,
    },
    // ln(x) => log(x) (natural logarithm, JS Math.log is natural log)
    {
        regex: /ln\s*\(\s*([^)]+?)\s*\)/g,
        replacer: (_match, expr) => `(log(${expr}))`,
    },
    // exponentiation: x^2 => pow(x, 2)
    {
        regex: /(\w+|\d+(\.\d+)?|\))\s*\^\s*(\([^)]+\)|\w+|\d+(\.\d+)?)/g,
        replacer: (_match, base, _g2, exponent) => `pow(${base},${exponent})`,
    },
    // sin(x)
    {
        regex: /sin\s*\(\s*([^)]+?)\s*\)/g,
        replacer: (_match, expr) => `sin(${expr})`,
    },
    // cos(x)
    {
        regex: /cos\s*\(\s*([^)]+?)\s*\)/g,
        replacer: (_match, expr) => `cos(${expr})`,
    },
    // tan(x)
    {
        regex: /tan\s*\(\s*([^)]+?)\s*\)/g,
        replacer: (_match, expr) => `tan(${expr})`,
    },
    // sqrt(x)
    {
        regex: /sqrt\s*\(\s*([^)]+?)\s*\)/g,
        replacer: (_match, expr) => `sqrt(${expr})`,
    },
    // abs(x)
    {
        regex: /abs\s*\(\s*([^)]+?)\s*\)/g,
        replacer: (_match, expr) => `abs(${expr})`,
    },
    // sec(x)
    {
        regex: /sec\s*\(\s*([^)]+?)\s*\)/g,
        replacer: (_match, expr) => `1/cos(${expr})`,
    },
    // csc(x)
    {
        regex: /csc\s*\(\s*([^)]+?)\s*\)/g,
        replacer: (_match, expr) => `1/sin(${expr})`,
    },
    // cot(x)
    {
        regex: /cot\s*\(\s*([^)]+?)\s*\)/g,
        replacer: (_match, expr) => `1/tan(${expr})`,
    },
    //  3x => 3*x, 2(x+1) => 2*(x+1)
    {
        regex: /(?<![a-zA-Z])(\d+(\.\d+)?)([a-zA-Z(])/g,
        replacer: (_match, num, _g2, variable) => `${num}*${variable}`,
    },
    //  x(x+1) => x*(x+1)
    {
        regex: /\b(?!sin|cos|tan|log|ln|sqrt|abs|pow|sec|csc|cot)([a-zA-Z])\s*(\()/g,
        replacer: (_match, varName, paren) => `${varName}*${paren}`,
    },
    // pi => Math.PI
    {
        regex: /\bpi\b/gi,
        replacer: () => `PI`,
    },
    // e => Math.E
    {
        regex: /\be\b/g,
        replacer: () => `E`,
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
        const length_from = Number(formJson.range_from || -10);
        const length_to = Number(formJson.range_to || 10);
        const step = Number(formJson.step || 0.1);
        let inputFunction = formJson.function || '';

        for (const { regex, replacer } of customReplacements) {
            inputFunction = inputFunction.replace(regex, replacer as any);
        }
        console.log('Processed input:', inputFunction);

        const isNumber = !isNaN(Number(inputFunction.trim()));

        let parsedFunction: any;
        if (!isNumber) {
            try {
                parsedFunction = parse2(inputFunction);
            } catch (e) {
                setData([]);
                return;
            }
        }

        const usedFunctions = regexFunctionPairs.filter(pair => pair.regex.test(inputFunction));

        const context: Record<string, any> = {};
        usedFunctions.forEach(pair => {
            context[pair.name] = pair.fn;
        });
        context.E = Math.E;
        context.PI = Math.PI;

        let newData;
        if (isNumber) {
            const yValue = Number(inputFunction.trim());
            newData = Array.from(
                { length: Math.floor((length_to - length_from) / step) + 1 },
                (_, index) => {
                    const x = length_from + index * step;
                    return { x, y: yValue };
                }
            );
        } else {
            newData = Array.from(
                { length: Math.floor((length_to - length_from) / step) + 1 },
                (_, index) => {
                    const x = length_from + index * step;
                    context.x = x;
                    let y = NaN;
                    try {
                        y = eval2(parsedFunction, context);
                    } catch {
                        y = NaN;
                    }
                    return { x, y };
                }
            );
        }
        setData(newData);
    }, [formJson]);


    const handleConfirmSwitch = () => {
        setSwitchT(prev => prev === '2D' ? "3D" : "2D");
        setShowPopup(false);
    };

    const handleShowPopup = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    function handleSumbit(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const formJson = Object.fromEntries(formData.entries());
        setFormJson(formJson)
    }

    const changeMode = switchT === '2D' ? "3D" : "2D";

     const yMinOverride =
    formJson.ymin !== undefined && formJson.ymin !== ''
      ? Number(formJson.ymin)
      : undefined;
  const yMaxOverride =
    formJson.ymax !== undefined && formJson.ymax !== ''
      ? Number(formJson.ymax)
      : undefined;

    return (
        <div className="sectors">
            <div className="sector-1">
                {/* Left Sector Canvas */}
                <div className="plot-section">
                    {switchT === '2D' ? (
                        <Canvas_2D
                            data={data ?? []}
                            yMinOverride={yMinOverride}
                            yMaxOverride={yMaxOverride}
                        />
                        ) : (
                        <Canvas_3D
                            data={data ?? []}
                            yMinOverride={yMinOverride}
                            yMaxOverride={yMaxOverride}
                        />
                    )}
                </div>
            </div>  
            <div className="sector-2">
                {/* Right Sector Fields, Inputs, Buttons, etc. */}
                <SwitchButton text_switch={switchT} onClick={handleShowPopup}/>
                <FieldsData handleSumbit={handleSumbit}/>
            </div>
            {showPopup && (
                <Popup
                    title={`Are your sure you want to change to '${changeMode}' mode?`}
                    content="Your data will be lost."
                    onClose={handleClosePopup}
                    onConfirm={handleConfirmSwitch}
                />
            )}
        </div>
    );
};

export default Sectors;