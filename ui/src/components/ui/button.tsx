import React from "react";
import { FaCheck } from "react-icons/fa";

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  clicked?: boolean | string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  className,
  style,
  children,
  clicked = false,
}) => {
  return (
    <button onClick={onClick} className={`btn ${className || ""}`} style={style}>
      {children}
      {clicked && <FaCheck className="" style={{ paddingLeft: "5px", right: 5 }} />}
    </button>
  );
};

export default Button;
