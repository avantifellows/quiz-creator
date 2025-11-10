'use client';

import { Session, STATUS } from '@/types';
import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook to detect and handle stuck PENDING sessions
 * If a session stays PENDING for more than 2 minutes,
 * mark it as FAILED on the server to stop showing spinner
 */
const useStuckPendingTimeout = (data: Session[], onSessionExpired?: (session: Session) => void) => {
  const pendingTimestamps = useRef<Map<number, { timestamp: number; session: Session }>>(new Map());

  const STUCK_TIMEOUT = 3 * 60 * 1000; // 3 minutes

  // Track when sessions enter PENDING state with full session data
  useEffect(() => {
    const now = Date.now();

    data?.forEach((session) => {
      if (session?.id && session?.meta_data?.status === STATUS.PENDING) {
        // First time seeing this session in PENDING
        if (!pendingTimestamps.current.has(session.id)) {
          pendingTimestamps.current.set(session.id, { timestamp: now, session });
        }
      } else if (session?.id) {
        // Session is no longer PENDING, remove from tracking
        pendingTimestamps.current.delete(session.id);
      }
    });
  }, [data]);

  // Check for stuck sessions periodically
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = Date.now();
      const stuckSessions: Session[] = [];

      pendingTimestamps.current.forEach(({ timestamp, session }) => {
        const elapsedTime = now - timestamp;
        if (elapsedTime > STUCK_TIMEOUT) {
          stuckSessions.push(session);
        }
      });

      // Notify about stuck sessions
      stuckSessions.forEach((session) => {
        onSessionExpired?.(session);
        // Remove from tracking so we don't notify again
        pendingTimestamps.current.delete(session.id!);
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkInterval);
  }, [onSessionExpired]);

  return {
    stuckSessions: Array.from(pendingTimestamps.current.keys()),
  };
};

export default useStuckPendingTimeout;
