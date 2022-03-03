import React, { useState, useCallback } from 'react';

export type TodoItemProps = {
  title: string;
  index: number;
  submitTodo: (title: string, index: number) => void;
}

export type TodoItemType = {
  title: string;
}

function TodoItem({ title, index, submitTodo }: TodoItemProps) {
  const [currentTitle, setTitle] = useState<string>(title);
  const [editing, setEditing] = useState<boolean>(false);

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
