'use client';

import { POLLING_INTERVAL } from '@/Constants';
import { Session } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

/**
 * Custom hook for static polling at a fixed interval.
 * @param {Session[]} data - Array of sessions.
 * @param {number} intervalInMinutes - Polling interval in minutes.
 * @return {{isPolling: boolean; pendingSessions: number[]}}
 *  - isPolling: boolean - Indicates if polling is active.
 *  - pendingSessions: number[] - Array of session IDs that are pending.
 */
const usePolling = (data: Session[]) => {
  const router = useRouter();

  const { pendingSessions, stopPolling } = useMemo(() => {
    const pendingSessions =
      data
        ?.filter((session) => session?.meta_data?.status === 'pending')
        ?.map((session) => session?.id as number) ?? [];
    const stopPolling = pendingSessions.length === 0;
    return { pendingSessions, stopPolling };
  }, [data]);

  useEffect(() => {
    if (stopPolling) return;
    const intervalId = setInterval(router.refresh, POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [stopPolling]);

  console.info(`${new Date().toLocaleTimeString()} : `, {
    isPolling: !stopPolling,
    pendingSessions,
  });

  return { isPolling: !stopPolling, pendingSessions };
};

export default usePolling;
