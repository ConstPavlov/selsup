import React from 'react';
import type { ParamInputProps } from '../../types';
import { StringParamInput } from './StringParamInput';

export const getParamInputComponent = (
  type: string
): React.FC<ParamInputProps> => {
  switch (type) {
    case 'string':
      return StringParamInput;
    default:
      return StringParamInput;
  }
};

export { StringParamInput };
