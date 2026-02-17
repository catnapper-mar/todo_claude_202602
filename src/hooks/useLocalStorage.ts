import { useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../utils/storage';

/**
 * ローカルストレージと同期するステートフック
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // ステートの初期化（ローカルストレージから読み込み）
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getFromStorage(key, initialValue);
  });

  // ステートが変更されたらローカルストレージに保存
  useEffect(() => {
    saveToStorage(key, storedValue);
  }, [key, storedValue]);

  // 関数型更新もサポート
  const setValue = (value: T | ((prev: T) => T)) => {
    setStoredValue(prevValue => {
      const newValue = value instanceof Function ? value(prevValue) : value;
      return newValue;
    });
  };

  return [storedValue, setValue];
}
