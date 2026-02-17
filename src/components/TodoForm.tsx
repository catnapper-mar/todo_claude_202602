import React, { useState, useEffect } from 'react';
import { Todo, Priority } from '../types/todo';

interface TodoFormProps {
  editingTodo?: Todo | null;
  onSubmit: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void;
  onCancel?: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ editingTodo, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setDescription(editingTodo.description || '');
      setPriority(editingTodo.priority);
      setDueDate(editingTodo.dueDate ? editingTodo.dueDate.split('T')[0] : '');
    } else {
      resetForm();
    }
  }, [editingTodo]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('タイトルを入力してください');
      return;
    }

    const todoData = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      completed: editingTodo?.completed || false,
    };

    onSubmit(todoData);

    if (!editingTodo) {
      resetForm();
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <h2>{editingTodo ? 'タスクを編集' : '新しいタスクを追加'}</h2>

      <div className="form-group">
        <label htmlFor="title">タイトル *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タスクのタイトルを入力"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">説明</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="タスクの詳細説明（任意）"
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority">優先度</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">期限</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit">
          {editingTodo ? '更新' : '追加'}
        </button>
        {editingTodo && (
          <button type="button" onClick={handleCancel} className="btn-cancel">
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
};
