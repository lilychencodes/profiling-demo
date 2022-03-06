import React, { useState, useCallback, useEffect } from 'react';
import opentelemetry from '@opentelemetry/api';

import { getTracer, reportSpan } from '../utilities/tracing';

import './Todo.css';

export type TodoItemProps = {
  title: string;
  index: number;
  submitTodo: (title: string, index: number) => void;
  rootSpan: any;
}

export type TodoItemType = {
  title: string;
}

const tracer = getTracer();

function TodoItem({ title, index, submitTodo, rootSpan }: TodoItemProps) {
  const [currentTitle, setTitle] = useState<string>(title);
  const [editing, setEditing] = useState<boolean>(false);

  let todoItemSpan: any;

  if (rootSpan) {
    const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), rootSpan);
    todoItemSpan = tracer.startSpan(`TodoItem-Render: ${title}`, undefined, ctx);
  }

  const editTitle = useCallback(
    (e) => {
      setTitle(e.target.value);
    },
    [setTitle]
  );

  const submit = useCallback(
    () => {
      submitTodo(currentTitle, index);
    },
    [currentTitle, submitTodo, index]
  );

  useEffect(() => {
    if (todoItemSpan) {
      console.log('Todo item rendered!', title);
      todoItemSpan.end();
      reportSpan(todoItemSpan);
    }
  }, [todoItemSpan]);

  return (
    <div className="todo-item">
      {editing && <div>
        <input
          value={currentTitle}
          onChange={editTitle}
          onBlur={submit} />
      </div>}
      {!editing && <div onClick={() => setEditing(true)}>
        {currentTitle}
      </div>}
    </div>
  );
}

export default TodoItem;
