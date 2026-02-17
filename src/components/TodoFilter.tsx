import React from 'react';
import { Priority, TodoFilter as TodoFilterType } from '../types/todo';
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';

interface TodoFilterProps {
  filter: TodoFilterType;
  onChange: (filter: TodoFilterType) => void;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({ filter, onChange }) => {
  const handleCompletedChange = (value: string) => {
    const completed = value === 'all' ? 'all' : value === 'true';
    onChange({ ...filter, completed });
  };

  const handlePriorityChange = (value: string) => {
    const priority = value === 'all' ? 'all' : value as Priority;
    onChange({ ...filter, priority });
  };

  const handleDueDateChange = (preset: string) => {
    const today = new Date();
    let dueDateRange: TodoFilterType['dueDateRange'] = undefined;

    switch (preset) {
      case 'today':
        dueDateRange = {
          start: startOfDay(today).toISOString(),
          end: endOfDay(today).toISOString(),
        };
        break;
      case 'this-week':
        dueDateRange = {
          start: startOfWeek(today, { weekStartsOn: 0 }).toISOString(),
          end: endOfWeek(today, { weekStartsOn: 0 }).toISOString(),
        };
        break;
      case 'overdue':
        dueDateRange = {
          end: startOfDay(today).toISOString(),
        };
        break;
      case 'all':
      default:
        dueDateRange = undefined;
        break;
    }

    onChange({ ...filter, dueDateRange });
  };

  const getCurrentDueDatePreset = (): string => {
    if (!filter.dueDateRange) return 'all';

    const today = new Date();
    const todayStart = startOfDay(today).toISOString();
    const todayEnd = endOfDay(today).toISOString();

    if (
      filter.dueDateRange.start === todayStart &&
      filter.dueDateRange.end === todayEnd
    ) {
      return 'today';
    }

    const weekStart = startOfWeek(today, { weekStartsOn: 0 }).toISOString();
    const weekEnd = endOfWeek(today, { weekStartsOn: 0 }).toISOString();

    if (
      filter.dueDateRange.start === weekStart &&
      filter.dueDateRange.end === weekEnd
    ) {
      return 'this-week';
    }

    if (!filter.dueDateRange.start && filter.dueDateRange.end === todayStart) {
      return 'overdue';
    }

    return 'all';
  };

  return (
    <div className="todo-filter">
      <div className="filter-group">
        <label htmlFor="filter-completed">完了状態:</label>
        <select
          id="filter-completed"
          value={filter.completed === 'all' ? 'all' : String(filter.completed ?? 'all')}
          onChange={(e) => handleCompletedChange(e.target.value)}
        >
          <option value="all">すべて</option>
          <option value="false">未完了のみ</option>
          <option value="true">完了のみ</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-priority">優先度:</label>
        <select
          id="filter-priority"
          value={filter.priority ?? 'all'}
          onChange={(e) => handlePriorityChange(e.target.value)}
        >
          <option value="all">すべて</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-duedate">期限:</label>
        <select
          id="filter-duedate"
          value={getCurrentDueDatePreset()}
          onChange={(e) => handleDueDateChange(e.target.value)}
        >
          <option value="all">すべて</option>
          <option value="today">今日</option>
          <option value="this-week">今週</option>
          <option value="overdue">期限切れ</option>
        </select>
      </div>
    </div>
  );
};
