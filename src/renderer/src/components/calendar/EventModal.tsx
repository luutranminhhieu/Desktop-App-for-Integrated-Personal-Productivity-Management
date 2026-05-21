import React, { useEffect, useState } from 'react';
import type { CalendarFormData, CalendarModalMode } from './types';

export type EventModalProps = {
  open: boolean;
  mode: CalendarModalMode;
  initialData: CalendarFormData;
  onClose: () => void;
  onSubmit: (data: CalendarFormData) => void;
  onDelete?: () => void;
};

const EventModal = ({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
  onDelete
}: EventModalProps): React.JSX.Element | null => {
  const [formData, setFormData] = useState<CalendarFormData>(initialData);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData(initialData);
    setError('');
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (key: keyof CalendarFormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (): void => {
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tiêu đề.');
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      setError('Vui lòng chọn thời gian bắt đầu và kết thúc.');
      return;
    }
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      setError('Thời gian kết thúc phải sau thời gian bắt đầu.');
      return;
    }
    onSubmit({ ...formData, title: formData.title.trim() });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/30 p-6">
      <div className="w-full max-w-lg bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-semibold text-[#1A1A2E]">
            {mode === 'create' ? 'Tạo lịch' : 'Chỉnh sửa lịch'}
          </h2>
          <button className="text-[#6B7280] hover:text-[#1A1A2E]" onClick={onClose} type="button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold text-[#6B7280]">Tiêu đề</label>
            <input
              className="mt-2 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-[14px]"
              value={formData.title}
              onChange={(event) => handleChange('title', event.target.value)}
              placeholder="Nhập tiêu đề"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-[12px] font-semibold text-[#6B7280]">Bắt đầu</label>
              <input
                type="datetime-local"
                className="mt-2 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-[14px]"
                value={formData.startTime}
                onChange={(event) => handleChange('startTime', event.target.value)}
              />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#6B7280]">Kết thúc</label>
              <input
                type="datetime-local"
                className="mt-2 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-[14px]"
                value={formData.endTime}
                onChange={(event) => handleChange('endTime', event.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-[12px] font-semibold text-[#6B7280]">Màu sắc</label>
              <input
                type="color"
                className="mt-2 h-10 w-full rounded-lg border border-[#E5E7EB]"
                value={formData.color}
                onChange={(event) => handleChange('color', event.target.value)}
              />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#6B7280]">Địa điểm</label>
              <input
                className="mt-2 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-[14px]"
                value={formData.location}
                onChange={(event) => handleChange('location', event.target.value)}
                placeholder="Thêm địa điểm"
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#6B7280]">Ghi chú</label>
            <textarea
              className="mt-2 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-[14px]"
              rows={3}
              value={formData.notes}
              onChange={(event) => handleChange('notes', event.target.value)}
              placeholder="Ghi chú thêm"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-[12px] text-[#EF4444]">{error}</p>}

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          {mode === 'edit' && onDelete && (
            <button
              className="px-4 py-2 text-[14px] font-semibold text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg"
              onClick={onDelete}
              type="button"
            >
              Xóa
            </button>
          )}
          <button
            className="px-4 py-2 text-[14px] font-semibold text-[#6B7280] hover:bg-[#F6F2FE] rounded-lg"
            onClick={onClose}
            type="button"
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 text-[14px] font-semibold text-white bg-[#4F3CC9] rounded-lg hover:bg-[#3A2D9E]"
            onClick={handleSubmit}
            type="button"
          >
            {mode === 'create' ? 'Tạo mới' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
