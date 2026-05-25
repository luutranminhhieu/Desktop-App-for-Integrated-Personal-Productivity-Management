import React, { useEffect, useState } from 'react';

type FocusDay = {
  date: string;
  hours: number;
};

type TimelineEvent = {
  time: string;
  title: string;
  color: string;
};

type TaskStats = {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  urgent: number;
  canceled: number;
  tasksThisMonth: number;
};

type TodoItem = {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  project?: string;
};

type DashboardData = {
  taskStats: TaskStats;
  focusHours: FocusDay[];
  urgentTasks: TodoItem[];
  todayTasks: TodoItem[];
  noteCount: number;
  newNotesThisMonth: number;
  pomodoroStats: { completed: number; target: number };
  focusStreakDays: number;
  weeklyFocusHours: number;
  activity: { startDate: string; values: number[] };
  timelineEvents: TimelineEvent[];
  yearFocusHours?: number;
};

const focusRingCircumference = 301.59;
const donutCircumference = 439.82;


const formatHours = (hours: number): string => {
  const totalMinutes = Math.round(hours * 60);
  const fullHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${fullHours}:${minutes.toString().padStart(2, '0')}`;
};

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
  const storedToken = localStorage.getItem('token');
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


  const todayFocusHours = data?.focusHours?.length
    ? data.focusHours[data.focusHours.length - 1].hours
    : 0;
  const focusGoal = 6;
  const focusPercent = focusGoal > 0 ? Math.min(1, todayFocusHours / focusGoal) : 0;
  const focusOffset = Math.round(focusRingCircumference * (1 - focusPercent) * 100) / 100;


  if (loading) {
    return <div className="text-[14px] text-[#6B7280]"></div>;
  }

  if (error) {
    return <div className="text-[14px] text-[#EF4444]">{error}</div>;
  }

  if (!data) {
    return <div className="text-[14px] text-[#6B7280]">No data.</div>;
  }

  const overdueCount = Math.max(0, data.taskStats.overdue);
  const pendingCount = Math.max(0, data.taskStats.pending - overdueCount);
  const completedCount = Math.max(0, data.taskStats.completed);
  const canceledCount = Math.max(0, data.taskStats.canceled);
  const donutTotal = completedCount + pendingCount + overdueCount + canceledCount || 1;
  const donutSegments = [
    { key: 'done', color: '#10B981', value: completedCount },
    { key: 'pending', color: '#4F3CC9', value: pendingCount },
    { key: 'overdue', color: '#EF4444', value: overdueCount },
    { key: 'canceled', color: '#E5E7EB', value: canceledCount }
  ];
  let donutRotation = 0;
  const donutPercent = (value: number): number => Math.round((value / donutTotal) * 100);
  const donutChartSegments = donutSegments
    .filter((segment) => segment.value > 0)
    .map((segment) => {
      const percent = segment.value / donutTotal;
      const rotation = donutRotation;
      donutRotation += percent * 360;
      return {
        ...segment,
        percent,
        rotation,
        offset: Math.round(donutCircumference * (1 - percent) * 100) / 100
      };
    });

  return (
    
    <div> 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-4">
            <h2 className="text-[18px] font-semibold text-[#1A1A2E]">Tập trung</h2>
            <span className="material-symbols-outlined text-[#6B7280] cursor-pointer">more_vert</span>
          </div>
          <div className="relative w-[110px] h-[110px] mb-4 flex items-center justify-center">
            <svg className="focus-ring" width="110" height="110">
              <circle cx="55" cy="55" r="48" fill="transparent" stroke="#EDE9FF" strokeWidth="9"></circle>
              <circle
                cx="55"
                cy="55"
                r="48"
                fill="transparent"
                stroke="#4F3CC9"
                strokeDasharray={focusRingCircumference}
                strokeDashoffset={focusOffset}
                strokeLinecap="round"
                strokeWidth="9"
              ></circle>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-[18px] font-semibold text-[#1A1A2E]">{formatHours(todayFocusHours)}</span>
              <span className="text-[11px] text-[#6B7280] uppercase">GIỜ</span>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-3 mt-1">
            <div className="text-center p-3 bg-[#F5F4FA] rounded-lg">
              <p className="text-[12px] text-[#6B7280] mb-1">Pomodoro</p>
              <p className="text-[15px] font-medium text-[#1A1A2E]">
                {data.pomodoroStats.completed}/{data.pomodoroStats.target}
              </p>
            </div>
            <div className="text-center p-3 bg-[#F5F4FA] rounded-lg">
              <p className="text-[12px] text-[#6B7280] mb-1">Mục tiêu</p>
              <p className="text-[15px] font-medium text-[#1A1A2E]">{focusGoal}h</p>
            </div>
          </div>
        </div>

                <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] flex flex-col">
          <h2 className="text-[18px] font-semibold text-[#1A1A2E] mb-8">Trạng thái Task</h2>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="relative w-40 h-40 mb-6">
              <svg className="focus-ring" width="160" height="160">
                <circle cx="80" cy="80" r="70" fill="transparent" stroke="#f0ecf8" strokeWidth="15"></circle>
                {donutChartSegments.map((segment) => (
                  <circle
                    key={segment.key}
                    cx="80"
                    cy="80"
                    r="70"
                    fill="transparent"
                    stroke={segment.color}
                    strokeDasharray={donutCircumference}
                    strokeDashoffset={segment.offset}
                    strokeLinecap="round"
                    strokeWidth="15"
                    style={{ transform: `rotate(${segment.rotation}deg)`, transformOrigin: 'center' }}
                  ></circle>
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[24px] font-semibold text-[#1A1A2E]">{data.taskStats.total}</span>
                <span className="text-[12px] text-[#6B7280]">Tổng số</span>
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                <span className="text-[14px] text-[#6B7280]">Đã xong ({donutPercent(completedCount)}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4F3CC9]"></span>
                <span className="text-[14px] text-[#6B7280]">Đang làm ({donutPercent(pendingCount)}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
                <span className="text-[14px] text-[#6B7280]">Quá hạn ({donutPercent(overdueCount)}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]"></span>
                <span className="text-[14px] text-[#6B7280]">Hủy ({donutPercent(canceledCount)}%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-semibold text-[#1A1A2E]">Lich trinh hom nay</h2>
          </div>
          <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
            <div>
              <h3 className="text-[12px] font-semibold text-[#6B7280] uppercase mb-3">Lich trinh</h3>
              <div className="relative space-y-4 before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-[#E5E7EB]">
                {data.timelineEvents.map((event) => (
                  <div key={event.title} className="relative pl-6">
                    <div
                      className="absolute left-0 top-1.5 w-2 h-2 rounded-full z-10"
                      style={{ backgroundColor: event.color }}
                    ></div>
                    <p className="text-[12px] text-[#6B7280]">{event.time}</p>
                    <p className="text-[14px] font-semibold text-[#1A1A2E]">{event.title}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-[12px] font-semibold text-[#6B7280] uppercase mb-3">Tasks hom nay</h3>
              <div className="space-y-3">
                {data.todayTasks.map((task) => {
                  const isCompleted = task.status === 'completed';
                  const badgeClass = isCompleted
                    ? 'bg-[#10B981]/10 text-[#10B981]'
                    : 'bg-[#F59E0B]/10 text-[#F59E0B]';
                  return (
                    <div
                      key={task._id}
                      className="flex items-center gap-3 p-2 rounded-lg border border-[#E5E7EB]/70"
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${isCompleted ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`}></span>
                      <div className="flex-1">
                        <p className="text-[14px] text-[#1A1A2E]">{task.title}</p>
                        <p className="text-[12px] text-[#6B7280]">{task.project || 'General'}</p>
                      </div>
                      <span className={`px-2 py-1 text-[11px] font-semibold rounded-full ${badgeClass}`}>
                        {isCompleted ? 'DONE' : 'PENDING'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>


      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {data.urgentTasks.slice(0, 3).map((task) => {
          const isUrgent = task.priority === 'urgent';
          const borderColor = isUrgent ? '#EF4444' : '#F59E0B';
          return (
            <div
              key={task._id}
              className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm"
              style={{ borderLeft: `4px solid ${borderColor}` }}
            >
              <div className="flex justify-between items-start mb-3">
                <span
                  className="px-2 py-1 text-[11px] font-semibold rounded uppercase"
                  style={{ backgroundColor: `${borderColor}1A`, color: borderColor }}
                >
                  {isUrgent ? 'URGENT' : 'HIGH'}
                </span>
                <span className="material-symbols-outlined text-[#6B7280] text-[18px]">flag</span>
              </div>
              <h3 className="text-[15px] font-medium text-[#1A1A2E] mb-1">{task.title}</h3>
              <p className="text-[12px] text-[#6B7280]">Deadline: {formatDeadline(task.dueDate)}</p>
            </div>
          );
        })}
      </div>
      <div>
      </div>
      
    </div>
  );
};

export default Dashboard;
