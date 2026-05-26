import React from 'react';
import { TaskStats } from '@renderer/types';

interface TodoStatsProps {
  stats: TaskStats;
}

const TodoStats: React.FC<TodoStatsProps> = ({ stats }) => {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  
  return (
    <div className="bg-white p-6 rounded-xl border border-[#E5E7EB]">
      <h2 className="text-[18px] font-semibold text-[#1A1A2E] mb-6">Thống kê công việc</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-[#F6F2FE] rounded-lg">
          <p className="text-[12px] text-[#6B7280] mb-1">Tổng công việc</p>
          <p className="text-[24px] font-bold text-[#1A1A2E]">{stats.total}</p>
        </div>
        
        <div className="text-center p-4 bg-[#F0FDF4] rounded-lg">
          <p className="text-[12px] text-[#059669] mb-1">Hoàn thành</p>
          <p className="text-[24px] font-bold text-[#10B981]">{stats.completed}</p>
        </div>
        
        <div className="text-center p-4 bg-[#FEF3C7] rounded-lg">
          <p className="text-[12px] text-[#D97706] mb-1">Đang làm</p>
          <p className="text-[24px] font-bold text-[#F59E0B]">{stats.pending}</p>
        </div>
        
        <div className="text-center p-4 bg-[#FEF2F2] rounded-lg">
          <p className="text-[12px] text-[#DC2626] mb-1">Quá hạn</p>
          <p className="text-[24px] font-bold text-[#EF4444]">{stats.overdue}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-[14px] text-[#6B7280]">Tỷ lệ hoàn thành</span>
            <span className="text-[14px] font-medium text-[#1A1A2E]">{completionRate}%</span>
          </div>
          <div className="w-full bg-[#E5E7EB] rounded-full h-2">
            <div
              className="bg-[#10B981] h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>
            <span className="text-[13px] text-[#6B7280]">Khẩn cấp: {stats.urgent}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#6B7280]"></span>
            <span className="text-[13px] text-[#6B7280]">Hủy: {stats.canceled}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#4F3CC9]"></span>
            <span className="text-[13px] text-[#6B7280]">Tháng này: {stats.tasksThisMonth}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#10B981]"></span>
            <span className="text-[13px] text-[#6B7280]">Còn lại: {stats.total - stats.completed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoStats;