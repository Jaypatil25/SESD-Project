import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  block = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClass = `btn btn-${variant} btn-${size} ${block ? 'btn-block' : ''} ${disabled ? 'btn-disabled' : ''} ${className}`;
  
  return (
    <button className={baseClass} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export const Input = ({ 
  label, 
  error, 
  helper,
  required = false,
  className = '',
  ...props 
}) => {
  return (
    <div className="input-group">
      {label && (
        <label className={`input-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <input 
        className={`input-field ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="input-error-message">{error}</span>}
      {helper && !error && <span className="input-helper">{helper}</span>}
    </div>
  );
};

export const Card = ({ children, className = '', header, footer, ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">
        {children}
      </div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const statusMap = {
    'allocated': 'active',
    'pending': 'pending',
    'not-allocated': 'inactive',
    'available': 'active',
    'occupied': 'inactive',
  };

  const displayMap = {
    'allocated': 'Allocated',
    'pending': 'Pending',
    'not-allocated': 'Not Allocated',
    'available': 'Available',
    'occupied': 'Occupied',
  };

  return (
    <span className={`status-badge ${statusMap[status] || 'inactive'}`}>
      {displayMap[status] || status}
    </span>
  );
};

export const Select = ({ 
  label, 
  options = [], 
  error, 
  required = false,
  className = '',
  ...props 
}) => {
  return (
    <div className="input-group">
      {label && (
        <label className={`input-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <select 
        className={`input-field ${error ? 'input-error' : ''} ${className}`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export const Textarea = ({ 
  label, 
  error, 
  required = false,
  className = '',
  ...props 
}) => {
  return (
    <div className="input-group">
      {label && (
        <label className={`input-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <textarea 
        className={`input-field ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export const Alert = ({ type = 'info', message, onClose }) => {
  const alertColors = {
    'info': 'badge-info',
    'success': 'badge-success',
    'warning': 'badge-warning',
    'error': 'badge-danger',
  };

  return (
    <div className={`badge ${alertColors[type]}`}>
      {message}
      {onClose && (
        <button 
          onClick={onClose} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '8px' }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export const Loading = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '4px solid rgba(255, 107, 107, 0.2)',
        borderTop: '4px solid #FF6B6B',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export const Empty = ({ message = 'No data available' }) => {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-medium-gray)' }}>
      <svg style={{ width: '64px', height: '64px', opacity: 0.5, marginBottom: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
      </svg>
      <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: '8px' }}>No data</p>
      <p style={{ fontSize: 'var(--font-size-sm)' }}>{message}</p>
    </div>
  );
};
