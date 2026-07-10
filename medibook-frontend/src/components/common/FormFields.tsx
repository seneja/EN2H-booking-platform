import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="form-field">
        {label && (
          <label className="form-label" htmlFor={inputId}>
            {label}
            {props.required && <span className="form-required">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`form-input ${error ? 'form-input--error' : ''} ${className}`}
          {...props}
        />
        {error && <p className="form-error">{error}</p>}
        {hint && !error && <p className="form-hint">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="form-field">
        {label && (
          <label className="form-label" htmlFor={inputId}>
            {label}
            {props.required && <span className="form-required">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`form-input form-textarea ${error ? 'form-input--error' : ''} ${className}`}
          {...props}
        />
        {error && <p className="form-error">{error}</p>}
        {hint && !error && <p className="form-hint">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="form-field">
        {label && (
          <label className="form-label" htmlFor={inputId}>
            {label}
            {props.required && <span className="form-required">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={`form-input form-select ${error ? 'form-input--error' : ''} ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="form-error">{error}</p>}
        {hint && !error && <p className="form-hint">{hint}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
