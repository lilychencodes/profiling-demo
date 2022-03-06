import React, { useState, useCallback, useEffect, useMemo } from 'react';

function MemoizedInput({ createTodo }: { createTodo: (todo: string) => void }) {
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

      createTodo(e.target.value);
      setTodo('');
    },
    []
  )

  return useMemo(() => {
    return (
      <input
        value={currentTodo}
        onChange={editTodo}
        onKeyPress={maybeSubmit}
        className="input"
        placeholder="new todo..." />
    )
  }, [createTodo, currentTodo])
}

export default MemoizedInput;
