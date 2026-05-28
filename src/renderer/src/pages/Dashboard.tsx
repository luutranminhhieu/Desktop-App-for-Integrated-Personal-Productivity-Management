import React, { useEffect, useState } from 'react';
import type { DashboardData } from '@renderer/types';
import FocusDayCard from '@renderer/components/dashboard/FocusDayCard';
import TaskStatus from '@renderer/components/dashboard/TaskStatus';
import Heatmap from '@renderer/components/dashboard/Heatmap';

const formatDeadline = (value?: string): string => {
  if (!value) {
    return 'Không có hạn';
  }
  const date = new Date(value);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const Dashboard = (): React.JSX.Element => {
  const [data, setData] = useState<DashboardData | null>(null);
  const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
  const [loading, setLoading] = useState(() => Boolean(storedToken));
  const [error, setError] = useState(() => (storedToken ? '' : 'Thiếu token xác thực.'));
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
          setError(response.error || 'Không thể xác thực token.');
          setLoading(false);
        }
      })
      .catch(() => {
        setError('Không thể xác thực token.');
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
          setError(response.error || 'Không thể tải dữ liệu dashboard.');
        }
      } catch {
        setError('Không thể tải dữ liệu dashboard.');
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
  const focusGoal = 6;

  /* ── Guard states ── */
  if (loading) {
    return <div className="text-sm text-[var(--color-muted)]"></div>;
  }

  if (error) {
    return <div className="text-sm text-[var(--color-error)]">{error}</div>;
  }

  if (!data) {
    return <div className="text-sm text-[var(--color-muted)]">No data.</div>;
  }

  return (
    <div>
      {/* ── Row 1: Focus‑Day Card + Task‑Status Donut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <FocusDayCard
          todayFocusHours={todayFocusHours}
          focusGoal={focusGoal}
          pomodoroCompleted={data.pomodoroStats.completed}
          pomodoroTarget={data.pomodoroStats.target}
        />

        <TaskStatus taskStats={data.taskStats} />
      </div>

      {/* ── Urgent tasks ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {data.urgentTasks.slice(0, 3).map((task) => {
          const isUrgent = task.priority === 'urgent';
          const borderColor = isUrgent ? 'var(--color-error)' : 'var(--color-warning)';
          return (
            <div
              key={task._id}
              className="bg-[var(--color-bg)] p-4 rounded-lg border border-[var(--color-border)] shadow-sm"
              style={{ borderLeft: `4px solid ${borderColor}` }}
            >
              <div className="flex justify-between items-start mb-3">
                <span
                  className="px-2 py-1 text-[11px] font-semibold rounded uppercase"
                  style={{ backgroundColor: isUrgent ? 'var(--color-error-light)' : 'var(--color-warning-light)', color: isUrgent ? 'var(--color-error)' : 'var(--color-warning)' }}
                >
                  {isUrgent ? 'URGENT' : 'HIGH'}
                </span>
                <span className="material-symbols-outlined text-[var(--color-muted)] text-lg">flag</span>
              </div>
              <h3 className="text-[15px] font-medium text-[var(--color-text)] mb-1">{task.title}</h3>
              <p className="text-xs text-[var(--color-muted)]">Deadline: {formatDeadline(task.dueDate)}</p>
            </div>
          );
        })}
      </div>

      {/* ── Row 2: Heatmap 365 ngày ── */}
      <Heatmap startDate={data.activity.startDate} values={data.activity.values} />
    </div>
  );
};

export default Dashboard;
