import React, { useState } from 'react';

interface AccordionFieldProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const AccordionField: React.FC<AccordionFieldProps> = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{
      border: "1px solid #222",
      borderRadius: 4,
      marginBottom: 16,
      width: 1000,
      background: "#fff"
    }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "11px 16px",
          cursor: "pointer",
          fontWeight: 500,
          fontSize: 16,
          userSelect: "none"
        }}
        onClick={() => setOpen(o => !o)}
      >
        {title}
        <span
          style={{
            transition: "transform 0.2s",
            display: "inline-block",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            fontSize: 19,
            marginLeft: 10
          }}
        >▼</span>
      </div>
      {open && (
        <div
          style={{
            borderTop: "1px solid #ddd",
            padding: "18px 24px",
            minHeight: 80,
            fontFamily: "monospace",
            fontSize: 15
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionField;
