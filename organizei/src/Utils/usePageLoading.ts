import { useEffect } from 'react';
import { useLoading } from '../Contexts/LoadingContext';

export const usePageLoading = (isDataLoading: boolean) => {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(isDataLoading);
  }, [isDataLoading, setLoading]);

  return { setLoading };
}; 