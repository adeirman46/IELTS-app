
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "w-full text-white font-bold py-3 px-4 rounded-[16px] transition-all duration-150 ease-in-out uppercase tracking-wider text-base transform active:translate-y-1";
  
  const variantClasses = {
    primary: 'bg-brand-blue text-white border-b-[4px] border-brand-blue-dark hover:bg-sky-400 active:border-b-0',
    secondary: 'bg-brand-gray-200 text-brand-gray-700 border-b-[4px] border-brand-gray-400 hover:bg-brand-gray-300 active:border-b-0',
    success: 'bg-brand-green text-white border-b-[4px] border-brand-green-dark hover:bg-green-500 active:border-b-0',
    danger: 'bg-brand-red text-white border-b-[4px] border-brand-red-dark hover:bg-red-500 active:border-b-0',
  };

  const disabledClasses = "disabled:bg-brand-gray-200 disabled:text-brand-gray-400 disabled:border-b-[4px] disabled:border-brand-gray-300 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none";

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;