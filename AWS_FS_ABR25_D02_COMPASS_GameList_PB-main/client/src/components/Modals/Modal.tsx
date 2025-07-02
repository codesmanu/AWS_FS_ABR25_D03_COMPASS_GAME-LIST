import { useState, useEffect } from 'react';
import './Modal.css';

// Types for field configuration
export type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'date'
  | 'checkbox'
  | 'imageSrc';

export interface FieldConfig {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { value: string | number; label: string | number }[];
  disabled?: boolean;
  dependsOn?: {
    field: string | number;
    value: any;
    condition: 'equals' | 'notEquals';
  };
}

export type ModalMode = 'add' | 'edit' | 'view';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FieldConfig[];
  mode: ModalMode;
  initialValues?: Record<string, any>;
  onSubmit: (formData: Record<string, any>) => void;
  submitButtonText?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  fields,
  mode,
  initialValues = {},
  onSubmit,
  submitButtonText = 'Save',
}: ModalProps) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleChange = (id: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view';

  const background_style: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgb(0,0,0, 0.7)',
    zIndex: 1000,
  };

  const renderField = (field: FieldConfig) => {
    // Handle conditional fields
    if (field.dependsOn) {
      const { dependsOn } = field;
      const dependentValue = formData[dependsOn.field];

      if (
        dependsOn.condition === 'equals' &&
        dependentValue !== dependsOn.value
      )
        return null;
      if (
        dependsOn.condition === 'notEquals' &&
        dependentValue === dependsOn.value
      )
        return null;
    }

    const disabled = isViewMode || field.disabled;

    switch (field.type) {
      case 'number':
        return (
          <div className="modal-form" key={field.id}>
            <label htmlFor={field.id}>
              {field.label}
              {field.required && <span>*</span>}
            </label>
            <input
              type="number"
              id={field.id}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={disabled}
            />
          </div>
        );

      case 'text':
        return (
          <div className="modal-form" key={field.id}>
            <label htmlFor={field.id}>
              {field.label}
              {field.required && <span>*</span>}
            </label>
            <input
              type="text"
              id={field.id}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={disabled}
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="modal-form" key={field.id}>
            <label htmlFor={field.id}>
              {field.label}
              {field.required && <span>*</span>}
            </label>
            <textarea
              id={field.id}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={disabled}
            ></textarea>
          </div>
        );

      case 'select':
        return (
          <div className="modal-form" key={field.id}>
            <label htmlFor={field.id}>
              {field.label}
              {field.required && <span>*</span>}
            </label>
            <select
              id={field.id}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              required={field.required}
              disabled={disabled}
            >
              <option value="" disabled>
                Select {field.label}
              </option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'date':
        return (
          <div className="modal-form" key={field.id}>
            <label htmlFor={field.id}>
              {field.label}
              {field.required && <span>*</span>}
            </label>
            <input
              type="date"
              id={field.id}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              required={field.required}
              disabled={disabled}
            />
          </div>
        );

      case 'checkbox':
        return (
          <div className="modal-form checkbox-field" key={field.id}>
            <label htmlFor={field.id} className="checkbox-label">
              <input
                type="checkbox"
                id={field.id}
                checked={formData[field.id] || false}
                onChange={(e) => handleChange(field.id, e.target.checked)}
                disabled={disabled}
              />
              {field.label}
            </label>
          </div>
        );

      case 'imageSrc':
        return (
          <div className="modal-form" key={field.id}>
            <label htmlFor={field.id}>
              {field.label}
              {field.required && <span>*</span>}
            </label>
            <input
              type="text"
              id={field.id}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={disabled}
            />
            {formData[field.id] && (
              <div className="image-preview">
                <img src={formData[field.id]} alt="Preview" height={100} />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={background_style} role="dialog">
      <div className="modal-container">
        <div className="box">
          <div className="close" onClick={onClose}>
            X
          </div>

          <div className="modal-header">
            <h2>{title}</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {fields.map(renderField)}

            {!isViewMode && (
              <div className="buttons">
                <button className="button_save" type="submit">
                  {submitButtonText}
                  <span style={{ marginLeft: '5px' }}>+</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
