import React, { useState, useCallback } from 'react';

import TodoItem, { TodoItemProps, TodoItemType } from './TodoItem';

function TodoApp() {
  const [todos, setTodos] = useState<TodoItemType[]>([]);
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

      const newTodos = [
        { title: currentTodo },
        ...todos
      ]
      setTodos(newTodos);
      setTodo('');
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
    <div className="todo-app">
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
              key={todo.title}
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
