import React, { useState, useCallback } from 'react';

import { withTracing } from '../utilities/tracing';

import TodoItem, { TodoItemProps, TodoItemType } from './TodoItem';

import './Todo.css';

function TodoApp() {
  const [todos, setTodos] = useState<TodoItemType[]>([{ title: 'Default Todo #1' }, { title: 'Default Todo #2'}]);
  const [currentTodo, setTodo] = useState<string>('');

  const editTodo = useCallback(
    (e) => {
      setTodo(e.target.value);
    },
    [setTodo],
  );

  const maybeSubmit = useCallback(
    (e) => {
      if (e.key !== 'Enter') return;

      withTracing('create_todo', async () => {
        const newTodos = [
          { title: currentTodo },
          ...todos
        ];
        await setTodos(newTodos);
        await setTodo('');
      });
    },
    [todos, setTodos, currentTodo, setTodo]
  )

  const submitTodo = useCallback(
    (title: string, index: number) => {
      const newTodos = [
        ...todos.slice(0, index),
        { title },
        ...todos.slice(index + 1)
      ]
      setTodos(newTodos);
    },
    [setTodos, todos]
  )

  return (
    <div className="todo-app flex-column-center">
      <div>
        <input
          value={currentTodo}
          onChange={editTodo}
          onKeyPress={maybeSubmit} />
      </div>
      <div>
        {todos.map((todo, index) => {
          return (
            <TodoItem
              key={`${todo.title}-${index}`}
              index={index}
              submitTodo={submitTodo}
              {...todo} />
          )
        })}
      </div>
    </div>
  );
}

export default TodoApp;
