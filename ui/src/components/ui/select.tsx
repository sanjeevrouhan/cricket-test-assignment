import React from "react";

interface Option {
  _id?: string;
  name: string;
  value: string;
}

interface SelectProps {
  id: string;
  label: string;
  options: Option[];
  selected: string;
  onChange: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({ id, label, options, selected, onChange }) => {
  return (
    <>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <select
        id={id && Math.random().toString()}
        className="form-select"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option?._id ?? option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default Select;
