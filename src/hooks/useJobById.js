import { useEffect, useState } from 'react';
import { jobsService } from '@/services/jobs.service';

export const useJobById = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchJob = async () => {
      if (!id) {
        setData(null);
        return;
      }

      setLoading(true);
      setError(null);
      const result = await jobsService.getJobById(id);
      if (!isMounted) return;

      if (result?.success) {
        setData(result.data || null);
      } else {
        setData(null);
        setError(result?.error || 'No se pudo cargar el detalle.');
      }
      setLoading(false);
    };

    fetchJob();

    return () => {
      isMounted = false;
    };
  }, [id, refreshKey]);

  const refetch = () => setRefreshKey((current) => current + 1);

  return { data, loading, error, refetch };
};
