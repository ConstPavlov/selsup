import React, { useState } from 'react';
import { ParamEditor } from './components';
import type { Param, Model } from './types';
import './App.css';

const App: React.FC = () => {
  const editorRef = React.useRef<ParamEditor>(null);
  const [result, setResult] = useState<string>('');

  const params: Param[] = [
    { id: 1, name: 'Назначение', type: 'string' },
    { id: 2, name: 'Длина', type: 'string' },
  ];

  const model: Model = {
    paramValues: [
      { paramId: 1, value: 'повседневное' },
      { paramId: 2, value: 'макси' },
    ],
    colors: [],
  };

  const handleGetModel = () => {
    if (editorRef.current) {
      const currentModel = editorRef.current.getModel();
      console.log('Current Model:', currentModel);
      setResult(JSON.stringify(currentModel, null, 2));
    }
  };

  return (
    <div className="app">
      <h1>Редактор параметров</h1>
      <ParamEditor ref={editorRef} params={params} model={model} />
      <button className="button" onClick={handleGetModel}>
        Получить модель (getModel)
      </button>
      {result && (
        <pre className="result">
          {result}
        </pre>
      )}
    </div>
  );
};

export default App;
