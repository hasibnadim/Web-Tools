'use client'
import { useState, useEffect, useCallback } from 'react';
import { getUserText, importText, togglePrivet, deleteText as deleteTextApi } from './action';
import { toast } from 'sonner';

export interface IUserText {
  id: number;
  text: string;
  language: string;
  createdAt: string;
  userId: string;
  expiresAt: null;
  isPublic: boolean;
}

export function useUserText(initialPage = 1, initialLimit = 10) {
  const [data, setData] = useState<IUserText[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTexts = useCallback(async (pageNum = page, limitNum = limit) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserText(limitNum, pageNum);
      setData(res.data);
      setTotal(res.total);
      setPage(res.page);
      setLimit(res.limit);
    } catch {
      setError('Failed to load texts');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchTexts();
  }, [fetchTexts]);

  const handleImport = useCallback(async (textId: number) => {
    // setLoading(true);
    setError(null);
    try {
      const result = await importText(textId);
      if (result) {
        await fetchTexts();
      }
      return result;
    } catch {
      setError('Failed to import text');
      toast.error('Failed to import text')
      return false;
    } 
  }, [fetchTexts]);

  const handleTogglePrivet = useCallback(async (textId: number) => {
    // setLoading(true);
    setError(null);
    try {
      const result = await togglePrivet(textId);
      if (result !== false) {
        await fetchTexts();
      }
      return result;
    } catch {
      setError('Failed to toggle privacy');
      return false;
    }  
  }, [fetchTexts]);

  const handleDelete = useCallback(async (textId: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteTextApi(textId);
      if (result) {
        await fetchTexts();
      }
      return result;
    } catch {
      setError('Failed to delete text');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTexts]);

  return {
    data,
    total,
    page,
    limit,
    loading,
    error,
    setPage,
    setLimit,
    refresh: fetchTexts,
    importText: handleImport,
    togglePrivet: handleTogglePrivet,
    deleteText: handleDelete,
  };
}
