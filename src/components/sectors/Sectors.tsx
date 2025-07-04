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
        {
            regex: /(\w+|\d+(\.\d+)?|\))\s*\^\s*(\w+|\d+(\.\d+)?|\()/g,
            replacer: (_match, g1, _g2, g3) => `pow(${g1},${g3})`,
        },
        {
            regex: /(\d+(\.\d+)?)([a-zA-Z(])/g,
            replacer: (_match, num, _g2, variable) => `${num}*${variable}`,
        },
    ];

    const functionDict: Record<string, (...args: number[]) => number> = {
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        log: Math.log,
        exp: Math.exp,
        sqrt: Math.sqrt,
        abs: Math.abs,
        pow: Math.pow,
    };

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
        const length_from = Number(formJson.range_from || 0);
        const length_to = Number(formJson.range_to || 100);
        const step = Number(formJson.step || 0.1);
        let inputFunction = formJson.function || '';

        for (const { regex, replacer } of customReplacements) {
            inputFunction = inputFunction.replace(regex, replacer as any);
        }

        let parsedFunction;
        try {
            parsedFunction = parse2(inputFunction);
        } catch (e) {
            setData([]);
            return;
        }

        const usedFunctions = regexFunctionPairs.filter(pair => pair.regex.test(inputFunction));

        const context: Record<string, any> = {};
        usedFunctions.forEach(pair => {
            context[pair.name] = pair.fn;
        });

        const newData = Array.from(
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

    const Component = switchT === '2D' ? Canvas_2D : Canvas_3D;
    const change = switchT === '2D' ? "3D" : "2D";

    return (
        <div className="sectors">
            <div className="sector-1">
                {/* Left Sector Canvas */}
                <Component data={data ?? []}/>
            </div>
            <div className="sector-2">
                {/* Right Sector Fields, Inputs, Buttons, etc. */}
                <SwitchButton text_switch={switchT} onClick={handleShowPopup}/>
                <FieldsData handleSumbit={handleSumbit}/>
            </div>
            {showPopup && (
                <Popup
                    title={`Are your sure you want to change to '${change}' mode?`}
                    content="Your data will be lost"
                    onClose={handleClosePopup}
                    onConfirm={handleConfirmSwitch}
                />
            )}
        </div>
    );
};

export default Sectors;