import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Todo, TodoFilter } from '../types/todo';
import { isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';

const STORAGE_KEY = 'todo-app-tasks';

export function useTodos() {
  const [todos, setTodos] = useLocalStorage<Todo[]>(STORAGE_KEY, []);

  /**
   * タスクを追加
   */
  const addTodo = (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => {
    const now = new Date().toISOString();
    const newTodo: Todo = {
      ...todo,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      order: todos.length,
    };
    setTodos([...todos, newTodo]);
  };

  /**
   * タスクを更新
   */
  const updateTodo = (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
        : todo
    ));
  };

  /**
   * タスクを削除
   */
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  /**
   * 完了状態を切り替え
   */
  const toggleComplete = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
        : todo
    ));
  };

  /**
   * タスクを並び替え
   */
  const reorderTodos = (oldIndex: number, newIndex: number) => {
    const newTodos = [...todos];
    const [moved] = newTodos.splice(oldIndex, 1);
    newTodos.splice(newIndex, 0, moved);

    // orderプロパティを更新
    const reorderedTodos = newTodos.map((todo, index) => ({
      ...todo,
      order: index,
      updatedAt: new Date().toISOString(),
    }));

    setTodos(reorderedTodos);
  };

  /**
   * タスクをフィルタリング
   */
  const filterTodos = (filter: TodoFilter): Todo[] => {
    return todos.filter(todo => {
      // 完了状態フィルタ
      if (filter.completed !== undefined && filter.completed !== 'all') {
        if (todo.completed !== filter.completed) return false;
      }

      // 優先度フィルタ
      if (filter.priority && filter.priority !== 'all') {
        if (todo.priority !== filter.priority) return false;
      }

      // 期限フィルタ
      if (filter.dueDateRange) {
        if (!todo.dueDate) return false;

        const dueDate = new Date(todo.dueDate);

        if (filter.dueDateRange.start) {
          const start = new Date(filter.dueDateRange.start);
          if (isBefore(dueDate, startOfDay(start))) return false;
        }

        if (filter.dueDateRange.end) {
          const end = new Date(filter.dueDateRange.end);
          if (isAfter(dueDate, endOfDay(end))) return false;
        }
      }

      return true;
    });
  };

  // orderでソート
  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => a.order - b.order);
  }, [todos]);

  return {
    todos: sortedTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    reorderTodos,
    filterTodos,
  };
}
