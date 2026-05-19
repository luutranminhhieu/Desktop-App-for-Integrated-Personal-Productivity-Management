import React, { useEffect, useMemo, useState } from 'react';

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
  focusStreakDays: number;
  weeklyFocusHours: number;
  activity: { startDate: string; values: number[] };
  timelineEvents: TimelineEvent[];
  yearFocusHours?: number;
};

type UserInfo = {
  id: string;
  name: string;
  email: string;
};

const heatmapClasses = ['bg-[#EDE9FF]/20', 'bg-[#EDE9FF]', 'bg-[#4F3CC9]', 'bg-[#3A2D9E]'];
const focusRingCircumference = 301.59;

const dayLabelForDate = (value: string): string => {
  const date = new Date(value);
  const day = date.getDay();
  const labels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return labels[day] ?? 'T2';
};

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

const greetingForNow = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'buổi sáng';
  if (hour < 18) return 'buổi chiều';
  return 'buổi tối';
};

const Dashboard = (): React.JSX.Element => {
  const [data, setData] = useState<DashboardData | null>(null);
  const storedToken = localStorage.getItem('token');
  const [loading, setLoading] = useState(() => Boolean(storedToken));
  const [error, setError] = useState(() => (storedToken ? '' : 'Thiếu token xác thực.'));
  const [userName] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      return '';
    }
    try {
      const parsed = JSON.parse(storedUser) as UserInfo;
      return parsed.name || parsed.email || '';
    } catch {
      return '';
    }
  });
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
        const response = await window.api.dashboard.getStats(userId);
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
  }, [userId]);

  const focusBars = useMemo(() => {
    if (!data?.focusHours?.length) {
      return [] as Array<{ label: string; height: number; active: boolean }>;
    }

    const maxHours = Math.max(8, ...data.focusHours.map((item) => item.hours));
    const lastIndex = data.focusHours.length - 1;

    return data.focusHours.map((item, index) => {
      const scaled = Math.round((item.hours / maxHours) * 224);
      return {
        label: dayLabelForDate(item.date),
        height: Math.max(24, scaled),
        active: index === lastIndex
      };
    });
  }, [data]);

  const todayFocusHours = data?.focusHours?.length
    ? data.focusHours[data.focusHours.length - 1].hours
    : 0;
  const focusGoal = 6;
  const focusPercent = focusGoal > 0 ? Math.min(1, todayFocusHours / focusGoal) : 0;
  const focusOffset = Math.round(focusRingCircumference * (1 - focusPercent) * 100) / 100;

  const todayTasks = data?.todayTasks ?? [];
  const todayCompleted = todayTasks.filter((task) => task.status === 'completed').length;
  const todayPending = todayTasks.filter((task) => task.status !== 'completed' && task.status !== 'canceled').length;
  const todayTotal = todayTasks.length;

  if (loading) {
    return <div className="text-[14px] text-[#6B7280]">Đang tải dashboard...</div>;
  }

  if (error) {
    return <div className="text-[14px] text-[#EF4444]">{error}</div>;
  }

  if (!data) {
    return <div className="text-[14px] text-[#6B7280]">Không có dữ liệu dashboard.</div>;
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-[24px] font-semibold text-[#1A1A2E] mb-1">
          Chào {greetingForNow()}, {userName || 'bạn'}!
        </h1>
        <p className="text-[14px] text-[#6B7280]">
          Hôm nay bạn có <span className="text-[#4F3CC9] font-semibold">{todayPending}</span> công việc cần hoàn thành
          và <span className="text-[#4F3CC9] font-semibold">{data.timelineEvents.length}</span> cuộc họp quan trọng.
        </p>
      </header>

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
              <p className="text-[15px] font-medium text-[#1A1A2E]">8/10</p>
            </div>
            <div className="text-center p-3 bg-[#F5F4FA] rounded-lg">
              <p className="text-[12px] text-[#6B7280] mb-1">Mục tiêu</p>
              <p className="text-[15px] font-medium text-[#1A1A2E]">{focusGoal}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB]">
          <div className="w-full flex justify-between items-center mb-4">
            <h2 className="text-[18px] font-semibold text-[#1A1A2E]">Tasks hôm nay</h2>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-[#10B981]/10 text-[#10B981] text-[11px] font-semibold rounded-full">
                {todayCompleted} XONG
              </span>
              <span className="px-2 py-1 bg-[#F59E0B]/10 text-[#F59E0B] text-[11px] font-semibold rounded-full">
                {todayPending} CÒN
              </span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-[#F6F2FE] rounded-full mb-6 flex overflow-hidden">
            <div
              className="h-full bg-[#10B981]"
              style={{ width: `${todayTotal ? Math.round((todayCompleted / todayTotal) * 100) : 0}%` }}
            ></div>
            <div
              className="h-full bg-[#4F3CC9]"
              style={{ width: `${todayTotal ? Math.round((todayPending / todayTotal) * 100) : 0}%` }}
            ></div>
          </div>
          <div className="space-y-3">
            {data.todayTasks.slice(0, 3).map((task) => (
              <div
                key={task._id}
                className="flex items-center gap-4 p-2 hover:bg-[#EDE9FF]/30 rounded-lg transition-colors group"
              >
                <span className="material-symbols-outlined text-[#6B7280]">radio_button_unchecked</span>
                <div className="flex-1">
                  <p className="text-[14px] text-[#1A1A2E]">{task.title}</p>
                  <p className="text-[12px] text-[#6B7280]">{task.project || 'General'}</p>
                </div>
                {task.priority === 'urgent' ? (
                  <span className="px-2 py-1 bg-[#EF4444]/10 text-[#EF4444] text-[11px] font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    URGENT
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB]">
          <h2 className="text-[18px] font-semibold text-[#1A1A2E] mb-4">Lịch trình</h2>
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

      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-[12px] font-bold tracking-widest text-[#6B7280] uppercase whitespace-nowrap">TỔNG QUAN</h2>
        <div className="h-[1px] w-full bg-[#E5E7EB]"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <span className="material-symbols-outlined" style={{ color: '#4F3CC9' }}>
              task_alt
            </span>
            <span className="text-[12px] text-[#6B7280]">Tasks tháng này</span>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-[28px] font-bold text-[#1A1A2E]">{data.taskStats.tasksThisMonth}</p>
            <span className="text-[#10B981] text-[12px] flex items-center">
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span> 12%
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <span className="material-symbols-outlined" style={{ color: '#7C3AED' }}>
              timer
            </span>
            <span className="text-[12px] text-[#6B7280]">Giờ tập trung tuần</span>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-[28px] font-bold text-[#1A1A2E]">{data.weeklyFocusHours.toFixed(1)}h</p>
            <div className="flex items-end gap-[2px] h-8 pb-1">
              <div className="w-1.5 h-3 bg-[#EDE9FF] rounded-t-full"></div>
              <div className="w-1.5 h-5 bg-[#EDE9FF] rounded-t-full"></div>
              <div className="w-1.5 h-8 bg-[#4F3CC9] rounded-t-full"></div>
              <div className="w-1.5 h-6 bg-[#EDE9FF] rounded-t-full"></div>
              <div className="w-1.5 h-4 bg-[#EDE9FF] rounded-t-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <span className="material-symbols-outlined" style={{ color: '#D97706' }}>
              book
            </span>
            <span className="text-[12px] text-[#6B7280]">Số lượng Sổ tay</span>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-[28px] font-bold text-[#1A1A2E]">{data.noteCount}</p>
            <span className="px-2 py-1 bg-[#EDE9FF] text-[#4F3CC9] text-[11px] font-semibold rounded-md">+2 mới</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <span className="material-symbols-outlined" style={{ color: '#EF4444' }}>
              local_fire_department
            </span>
            <span className="text-[12px] text-[#6B7280]">Chuỗi tập trung</span>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-[28px] font-bold text-[#1A1A2E]">{data.focusStreakDays} ngày</p>
            <p className="text-[12px] text-[#6B7280]">Kỷ lục: {Math.max(22, data.focusStreakDays)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 mb-8">
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-[#E5E7EB]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[18px] font-semibold text-[#1A1A2E]">Thời gian tập trung</h2>
            <div className="flex bg-[#F5F4FA] p-1 rounded-lg">
              <button className="px-4 py-1 text-[11px] font-semibold rounded-md bg-white shadow-sm text-[#4F3CC9]">
                Tuần
              </button>
              <button className="px-4 py-1 text-[11px] font-semibold rounded-md text-[#6B7280] hover:text-[#1A1A2E] transition-colors">
                Tháng
              </button>
              <button className="px-4 py-1 text-[11px] font-semibold rounded-md text-[#6B7280] hover:text-[#1A1A2E] transition-colors">
                Năm
              </button>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-4 relative">
            <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[12px] text-[#6B7280] pb-8">
              <span>8h</span>
              <span>6h</span>
              <span>4h</span>
              <span>2h</span>
              <span>0h</span>
            </div>
            <div className="flex-1 h-full ml-8 border-b border-[#E5E7EB] flex items-end justify-around relative">
              <div className="absolute inset-x-0 top-0 border-t border-[#E5E7EB]/50 h-[1px]"></div>
              <div className="absolute inset-x-0 top-1/4 border-t border-[#E5E7EB]/50 h-[1px]"></div>
              <div className="absolute inset-x-0 top-1/2 border-t border-[#E5E7EB]/50 h-[1px]"></div>
              <div className="absolute inset-x-0 top-3/4 border-t border-[#E5E7EB]/50 h-[1px]"></div>
              {focusBars.map((bar) => (
                <div key={bar.label} className="group relative w-12 flex flex-col items-center">
                  <div
                    className={`${bar.active ? 'bg-[#4F3CC9]' : 'bg-[#EDE9FF] group-hover:bg-[#4F3CC9] transition-colors'} w-3 rounded-t-full`}
                    style={{ height: `${bar.height}px` }}
                  ></div>
                  <span
                    className={`mt-4 text-[12px] uppercase ${bar.active ? 'font-bold text-[#1A1A2E]' : 'text-[#6B7280]'}`}
                  >
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-[#E5E7EB] flex flex-col">
          <h2 className="text-[18px] font-semibold text-[#1A1A2E] mb-8">Trạng thái Task</h2>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="relative w-40 h-40 mb-6">
              <svg className="focus-ring" width="160" height="160">
                <circle cx="80" cy="80" r="70" fill="transparent" stroke="#f0ecf8" strokeWidth="15"></circle>
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="transparent"
                  stroke="#10B981"
                  strokeDasharray="439.82"
                  strokeDashoffset="175.92"
                  strokeLinecap="round"
                  strokeWidth="15"
                ></circle>
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="transparent"
                  stroke="#4F3CC9"
                  strokeDasharray="439.82"
                  strokeDashoffset="351.85"
                  strokeLinecap="round"
                  strokeWidth="15"
                  style={{ transform: 'rotate(216deg)', transformOrigin: 'center' }}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[24px] font-semibold text-[#1A1A2E]">{data.taskStats.total}</span>
                <span className="text-[12px] text-[#6B7280]">Tổng số</span>
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                <span className="text-[14px] text-[#6B7280]">Đã xong</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4F3CC9]"></span>
                <span className="text-[14px] text-[#6B7280]">Đang làm</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
                <span className="text-[14px] text-[#6B7280]">Quá hạn</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]"></span>
                <span className="text-[14px] text-[#6B7280]">Hủy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
