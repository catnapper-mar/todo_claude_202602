export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;                 // UUID
  title: string;              // タスクタイトル
  description?: string;       // 詳細説明（オプション）
  completed: boolean;         // 完了状態
  priority: Priority;         // 優先度
  dueDate?: string;           // 期限（ISO 8601形式）
  createdAt: string;          // 作成日時
  updatedAt: string;          // 更新日時
  order: number;              // 並び順
}

export interface TodoFilter {
  completed?: boolean | 'all';
  priority?: Priority | 'all';
  dueDateRange?: {
    start?: string;
    end?: string;
  };
}
