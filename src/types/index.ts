export interface Param {
  id: number;
  name: string;
  type: 'string';
}

export interface ParamValue {
  paramId: number;
  value: string;
}

export interface Color {
  id: number;
  name: string;
  code: string;
}

export interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}

export interface ParamEditorProps {
  params: Param[];
  model: Model;
}

export interface ParamEditorState {
  paramValues: Record<number, string>;
}

export interface ParamInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
