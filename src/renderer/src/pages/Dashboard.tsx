import React, { useEffect, useState } from 'react';
import type { DashboardData } from '@renderer/types';
import FocusDayCard from '@renderer/components/dashboard/FocusDayCard';
import TaskStatus from '@renderer/components/dashboard/TaskStatus';
import Heatmap from '@renderer/components/dashboard/Heatmap';
import {
  DASHBOARD_STRINGS
} from '@renderer/config/dashboardConfig';
const Dashboard = (): React.JSX.Element => {
  const [data, setData] = useState<DashboardData | null>(null);
  const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
  const [loading, setLoading] = useState(() => Boolean(storedToken));
  const [error, setError] = useState(() => (storedToken ? '' : DASHBOARD_STRINGS.authError));
  const [focusRange] = useState<'week' | 'month' | 'year'>('week');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!storedToken) {
      return;
    }

    window.api.auth
      .verifyToken(storedToken)
      .then((response) => {
        if (response.success && response.data?.userId) {
          setUserId(response.data.userId);
        } else {
          setError(response.error || DASHBOARD_STRINGS.tokenError);
          setLoading(false);
        }
      })
      .catch(() => {
        setError(DASHBOARD_STRINGS.tokenError);
        setLoading(false);
      });
  }, [storedToken]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const loadDashboard = async (): Promise<void> => {
      setLoading(true);
      try {
        const response = await window.api.dashboard.getStats(userId, focusRange);
        if (response.success && response.data) {
          setData(response.data as DashboardData);
          setError('');
        } else {
          setError(response.error || DASHBOARD_STRINGS.fetchError);
        }
      } catch {
        setError(DASHBOARD_STRINGS.fetchError);
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, [userId, focusRange]);

  /* ── Derived values ── */
  const todayFocusHours = data?.focusHours?.length
    ? data.focusHours[data.focusHours.length - 1].hours
    : 0;

  /* ── Guard states ── */
  if (loading) {
    return <div className="text-sm text-[var(--color-muted)]"></div>;
  }

  if (error) {
    return <div className="text-sm text-[var(--color-error)]">{error}</div>;
  }

  if (!data) {
    return <div className="text-sm text-[var(--color-muted)]">{DASHBOARD_STRINGS.noData}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Row 1: Focus‑Day Card + Task‑Status Donut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FocusDayCard todayFocusHours={todayFocusHours} />

        <TaskStatus taskStats={data.taskStats} />
      </div>

      {/* ── Row 2: Heatmap 365 ngày ── */}
      <Heatmap startDate={data.activity.startDate} values={data.activity.values} />
    </div>
  );
};

export default Dashboard;
