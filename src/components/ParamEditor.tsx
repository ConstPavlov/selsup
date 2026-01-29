import React from 'react';
import type {
  Model,
  Param,
  ParamValue,
  ParamEditorProps,
  ParamEditorState,
} from '../types';
import { getParamInputComponent } from './inputs';
import styles from './ParamEditor.module.css';

class ParamEditor extends React.Component<ParamEditorProps, ParamEditorState> {
  constructor(props: ParamEditorProps) {
    super(props);

    const paramValues: Record<number, string> = {};

    props.params.forEach((param: Param) => {
      paramValues[param.id] = '';
    });

    props.model.paramValues.forEach((pv: ParamValue) => {
      paramValues[pv.paramId] = pv.value;
    });

    this.state = { paramValues };
  }

  private handleParamChange = (paramId: number, value: string): void => {
    this.setState((prevState) => ({
      paramValues: {
        ...prevState.paramValues,
        [paramId]: value,
      },
    }));
  };

  public getModel(): Model {
    const paramValues: ParamValue[] = Object.entries(this.state.paramValues).map(
      ([paramId, value]) => ({
        paramId: Number(paramId),
        value,
      })
    );

    return {
      paramValues,
      colors: this.props.model.colors,
    };
  }

  render() {
    const { params } = this.props;
    const { paramValues } = this.state;

    return (
      <div className={styles.container} data-testid="param-editor">
        {params.map((param: Param) => {
          const InputComponent = getParamInputComponent(param.type);

          return (
            <div key={param.id} className={styles.paramRow}>
              <label className={styles.label}>{param.name}</label>
              <InputComponent
                value={paramValues[param.id] || ''}
                onChange={(value) => this.handleParamChange(param.id, value)}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

export { ParamEditor };
