import React from 'react';
import type { ParamInputProps } from '../../types';
import styles from '../ParamEditor.module.css';

export const StringParamInput: React.FC<ParamInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <input
      type="text"
      className={styles.input}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};
