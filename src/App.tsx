import { useState, useMemo } from 'react';
import { useTodos } from './hooks/useTodos';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { Todo, TodoFilter as TodoFilterType } from './types/todo';
import './App.css';

function App() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleComplete, reorderTodos, filterTodos } = useTodos();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<TodoFilterType>({
    completed: 'all',
    priority: 'all',
  });

  // フィルタリングされたタスク一覧
  const filteredTodos = useMemo(() => {
    return filterTodos(filter);
  }, [todos, filter, filterTodos]);

  const handleAddOrUpdate = (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, todoData);
      setEditingTodo(null);
    } else {
      addTodo(todoData);
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    // フォームまでスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('このタスクを削除しますか？')) {
      deleteTodo(id);
      if (editingTodo?.id === id) {
        setEditingTodo(null);
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>ToDoアプリ</h1>
      </header>

      <main className="app-main">
        <div className="container">
          <section className="form-section">
            <TodoForm
              editingTodo={editingTodo}
              onSubmit={handleAddOrUpdate}
              onCancel={handleCancelEdit}
            />
          </section>

          <section className="list-section">
            <div className="list-header">
              <h2>タスク一覧</h2>
              <span className="task-count">
                {todos.filter(t => !t.completed).length} / {todos.length} 件
              </span>
            </div>
            <TodoFilter filter={filter} onChange={setFilter} />
            <TodoList
              todos={filteredTodos}
              onToggle={toggleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReorder={reorderTodos}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
