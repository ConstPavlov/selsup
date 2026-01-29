# Редактор параметров (ParamEditor)

React-компонент для редактирования структуры `Model` на основе списка параметров `params: Param[]`.

## Описание

Компонент позволяет:
- Редактировать структуру `Model` — проставлять значения параметров
- Все параметры отображаются сразу и доступны для редактирования
- Метод `getModel()` возвращает полную структуру `Model` со всеми проставленными значениями

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск тестов
npm test

# Запуск в режиме разработки
npm run dev
```

## Структура проекта

```
src/
├── components/
│   ├── inputs/
│   │   ├── StringParamInput.tsx   # Текстовый редактор параметра
│   │   └── index.ts               # Фабрика компонентов
│   ├── ParamEditor.tsx            # Основной компонент
│   ├── ParamEditor.module.css     # Стили
│   └── index.ts                   # Экспорты
├── types/
│   └── index.ts                   # Все TypeScript типы
├── test/
│   ├── setup.ts                   # Настройка тестов
│   └── ParamEditor.test.tsx       # Unit-тесты
├── App.tsx                        # Демо-приложение
├── App.css                        # Стили приложения
├── main.tsx                       # Точка входа
└── index.ts                       # Публичное API
```

## Использование

```tsx
import { ParamEditor } from './components';
import type { Param, Model } from './types';

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

// В компоненте:
const editorRef = React.useRef<ParamEditor>(null);

<ParamEditor ref={editorRef} params={params} model={model} />

// Получение модели:
const currentModel = editorRef.current?.getModel();
```

## Расширяемость

Для добавления нового типа параметра (например, числового):

1. Создайте новый компонент в `src/components/inputs/`:

```tsx
// NumberParamInput.tsx
export const NumberParamInput: React.FC<ParamInputProps> = ({ value, onChange }) => {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
```

2. Добавьте тип в интерфейс `Param`:

```ts
interface Param {
  id: number;
  name: string;
  type: 'string' | 'number';
}
```

3. Добавьте case в фабрику `getParamInputComponent`:

```ts
case 'number':
  return NumberParamInput;
```

## Тесты

Тесты покрывают:
- Отображение полей по `params`
- Корректную инициализацию из `model.paramValues`
- Корректный результат `getModel()` после изменений

### Вывод тестов

```
 ✓ src/test/ParamEditor.test.tsx (12)
   ✓ ParamEditor (12)
     ✓ Отображение полей по params (3)
       ✓ должен отображать все параметры из params
       ✓ должен отображать правильное количество полей ввода
       ✓ должен отображать поля для пустого списка параметров
     ✓ Корректная инициализация из model.paramValues (3)
       ✓ должен корректно инициализировать значения из model
       ✓ должен корректно обрабатывать пустой model.paramValues
       ✓ должен игнорировать paramValues с несуществующими paramId
     ✓ Корректный результат getModel() после изменений (4)
       ✓ должен возвращать исходные значения без изменений
       ✓ должен возвращать обновленные значения после изменений
       ✓ должен возвращать пустые значения после очистки полей
       ✓ должен сохранять colors из исходной модели
     ✓ Интерактивность (2)
       ✓ должен обновлять значение при вводе
       ✓ должен поддерживать кириллицу

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  ...
   Duration  ...
```

## Технологии

- React 18
- TypeScript 5
- Vite 5
- Vitest + React Testing Library
