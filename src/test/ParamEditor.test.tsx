import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ParamEditor } from '../components/ParamEditor';
import type { Param, Model } from '../types';

describe('ParamEditor', () => {
  // Тестовые данные
  const params: Param[] = [
    { id: 1, name: 'Назначение', type: 'string' },
    { id: 2, name: 'Длина', type: 'string' },
    { id: 3, name: 'Материал', type: 'string' },
  ];

  const model: Model = {
    paramValues: [
      { paramId: 1, value: 'повседневное' },
      { paramId: 2, value: 'макси' },
    ],
    colors: [{ id: 1, name: 'Красный', code: '#FF0000' }],
  };

  describe('Отображение полей по params', () => {
    it('должен отображать все параметры из params', () => {
      render(<ParamEditor params={params} model={model} />);

      // Проверяем, что все labels отображаются
      expect(screen.getByText('Назначение')).toBeInTheDocument();
      expect(screen.getByText('Длина')).toBeInTheDocument();
      expect(screen.getByText('Материал')).toBeInTheDocument();
    });

    it('должен отображать правильное количество полей ввода', () => {
      render(<ParamEditor params={params} model={model} />);

      const inputs = screen.getAllByRole('textbox');
      expect(inputs).toHaveLength(3);
    });

    it('должен отображать поля для пустого списка параметров', () => {
      render(<ParamEditor params={[]} model={{ paramValues: [], colors: [] }} />);

      const inputs = screen.queryAllByRole('textbox');
      expect(inputs).toHaveLength(0);
    });
  });

  describe('Корректная инициализация из model.paramValues', () => {
    it('должен корректно инициализировать значения из model', () => {
      render(<ParamEditor params={params} model={model} />);

      const inputs = screen.getAllByRole('textbox');

      // Проверяем значения
      expect(inputs[0]).toHaveValue('повседневное');
      expect(inputs[1]).toHaveValue('макси');
      expect(inputs[2]).toHaveValue(''); // Материал не задан в model
    });

    it('должен корректно обрабатывать пустой model.paramValues', () => {
      const emptyModel: Model = {
        paramValues: [],
        colors: [],
      };

      render(<ParamEditor params={params} model={emptyModel} />);

      const inputs = screen.getAllByRole('textbox');

      // Все поля должны быть пустыми
      inputs.forEach((input) => {
        expect(input).toHaveValue('');
      });
    });

    it('должен игнорировать paramValues с несуществующими paramId', () => {
      const modelWithExtraValues: Model = {
        paramValues: [
          { paramId: 1, value: 'повседневное' },
          { paramId: 999, value: 'несуществующий' }, // Нет такого параметра
        ],
        colors: [],
      };

      render(<ParamEditor params={params} model={modelWithExtraValues} />);

      const inputs = screen.getAllByRole('textbox');
      expect(inputs[0]).toHaveValue('повседневное');
    });
  });

  describe('Корректный результат getModel() после изменений', () => {
    it('должен возвращать исходные значения без изменений', () => {
      const ref = React.createRef<ParamEditor>();

      render(<ParamEditor ref={ref} params={params} model={model} />);

      const result = ref.current?.getModel();

      expect(result).toBeDefined();
      expect(result?.paramValues).toHaveLength(3);

      // Проверяем значения
      const param1 = result?.paramValues.find((pv) => pv.paramId === 1);
      const param2 = result?.paramValues.find((pv) => pv.paramId === 2);
      const param3 = result?.paramValues.find((pv) => pv.paramId === 3);

      expect(param1?.value).toBe('повседневное');
      expect(param2?.value).toBe('макси');
      expect(param3?.value).toBe('');

      // Проверяем, что colors сохранены
      expect(result?.colors).toEqual(model.colors);
    });

    it('должен возвращать обновленные значения после изменений', async () => {
      const user = userEvent.setup();
      const ref = React.createRef<ParamEditor>();

      render(<ParamEditor ref={ref} params={params} model={model} />);

      const inputs = screen.getAllByRole('textbox');

      // Изменяем первое поле
      await user.clear(inputs[0]);
      await user.type(inputs[0], 'вечернее');

      // Изменяем третье поле (было пустым)
      await user.type(inputs[2], 'шелк');

      const result = ref.current?.getModel();

      const param1 = result?.paramValues.find((pv) => pv.paramId === 1);
      const param2 = result?.paramValues.find((pv) => pv.paramId === 2);
      const param3 = result?.paramValues.find((pv) => pv.paramId === 3);

      expect(param1?.value).toBe('вечернее');
      expect(param2?.value).toBe('макси'); // Не изменилось
      expect(param3?.value).toBe('шелк');
    });

    it('должен возвращать пустые значения после очистки полей', async () => {
      const user = userEvent.setup();
      const ref = React.createRef<ParamEditor>();

      render(<ParamEditor ref={ref} params={params} model={model} />);

      const inputs = screen.getAllByRole('textbox');

      // Очищаем первое поле
      await user.clear(inputs[0]);

      const result = ref.current?.getModel();

      const param1 = result?.paramValues.find((pv) => pv.paramId === 1);
      expect(param1?.value).toBe('');
    });

    it('должен сохранять colors из исходной модели', () => {
      const ref = React.createRef<ParamEditor>();

      const modelWithColors: Model = {
        paramValues: [{ paramId: 1, value: 'test' }],
        colors: [
          { id: 1, name: 'Красный', code: '#FF0000' },
          { id: 2, name: 'Синий', code: '#0000FF' },
        ],
      };

      render(<ParamEditor ref={ref} params={params} model={modelWithColors} />);

      const result = ref.current?.getModel();

      expect(result?.colors).toEqual(modelWithColors.colors);
      expect(result?.colors).toHaveLength(2);
    });
  });

  describe('Интерактивность', () => {
    it('должен обновлять значение при вводе', async () => {
      const user = userEvent.setup();

      render(<ParamEditor params={params} model={model} />);

      const inputs = screen.getAllByRole('textbox');

      await user.clear(inputs[0]);
      await user.type(inputs[0], 'новое значение');

      expect(inputs[0]).toHaveValue('новое значение');
    });

    it('должен поддерживать кириллицу', async () => {
      const user = userEvent.setup();

      render(<ParamEditor params={params} model={model} />);

      const inputs = screen.getAllByRole('textbox');

      await user.clear(inputs[0]);
      await user.type(inputs[0], 'тест кириллицы');

      expect(inputs[0]).toHaveValue('тест кириллицы');
    });
  });
});
