import React from 'react';
import { Todo } from '../types/todo';
import { format, isPast, startOfDay } from 'date-fns';
import { ja } from 'date-fns/locale';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = React.memo(({ todo, onToggle, onEdit, onDelete }) => {
  const isOverdue = todo.dueDate && !todo.completed && isPast(startOfDay(new Date(todo.dueDate)));

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#3b82f6',
  };

  return (
    <div
      className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
      style={{
        borderLeftColor: priorityColors[todo.priority],
      }}
    >
      <div className="todo-item-header">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="todo-checkbox"
        />
        <div className="todo-content">
          <h3 className="todo-title">{todo.title}</h3>
          {todo.description && (
            <p className="todo-description">{todo.description}</p>
          )}
          <div className="todo-meta">
            <span className={`priority-badge priority-${todo.priority}`}>
              {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
            </span>
            {todo.dueDate && (
              <span className="due-date">
                期限: {format(new Date(todo.dueDate), 'yyyy/MM/dd (E)', { locale: ja })}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="todo-actions">
        <button onClick={() => onEdit(todo)} className="btn-edit">
          編集
        </button>
        <button onClick={() => onDelete(todo.id)} className="btn-delete">
          削除
        </button>
      </div>
    </div>
  );
});

TodoItem.displayName = 'TodoItem';
