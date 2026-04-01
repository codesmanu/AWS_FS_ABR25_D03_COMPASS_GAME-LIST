import {
    type ReactNode,
    type ButtonHTMLAttributes,
    type MouseEventHandler,
} from 'react';
import './Button.css';

type ButtonProps = {
    children: ReactNode;
    className?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
    children,
    className = '',
    onClick,
    ...props
}: ButtonProps) => {
    return (
        <>
            <button
                className={`button-global ${className}`}
                onClick={onClick}
                {...props}
            >
                {children}
            </button>
        </>
    );
};

export default Button;
