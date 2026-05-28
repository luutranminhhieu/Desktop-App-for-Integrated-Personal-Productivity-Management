import React, { useEffect, useState } from 'react';
import type { CalendarFormData, CalendarModalMode } from '@renderer/types';

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
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[var(--color-overlay)] p-6">
      <div className="w-full max-w-lg bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)] p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            {mode === 'create' ? 'Tạo lịch' : 'Chỉnh sửa lịch'}
          </h2>
          <button className="text-[var(--color-muted)] hover:text-[var(--color-text)]" onClick={onClose} type="button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[var(--color-muted)]">Tiêu đề</label>
            <input
              className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)]"
              value={formData.title}
              onChange={(event) => handleChange('title', event.target.value)}
              placeholder="Nhập tiêu đề"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-[var(--color-muted)]">Bắt đầu</label>
              <input
                type="datetime-local"
                className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)]"
                value={formData.startTime}
                onChange={(event) => handleChange('startTime', event.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-muted)]">Kết thúc</label>
              <input
                type="datetime-local"
                className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)]"
                value={formData.endTime}
                onChange={(event) => handleChange('endTime', event.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-[var(--color-muted)]">Màu sắc</label>
              <input
                type="color"
                className="mt-2 h-10 w-full rounded-md border border-[var(--color-border)]"
                value={formData.color}
                onChange={(event) => handleChange('color', event.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-muted)]">Địa điểm</label>
              <input
                className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)]"
                value={formData.location}
                onChange={(event) => handleChange('location', event.target.value)}
                placeholder="Thêm địa điểm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-muted)]">Ghi chú</label>
            <textarea
              className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)]"
              rows={3}
              value={formData.notes}
              onChange={(event) => handleChange('notes', event.target.value)}
              placeholder="Ghi chú thêm"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-xs text-[var(--color-error)]">{error}</p>}

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          {mode === 'edit' && onDelete && (
            <button
              className="px-4 py-2 text-sm font-semibold text-[var(--color-error)] hover:bg-[var(--color-error-light)] rounded-md"
              onClick={onDelete}
              type="button"
            >
              Xóa
            </button>
          )}
          <button
            className="px-4 py-2 text-sm font-semibold text-[var(--color-muted)] hover:bg-[var(--color-primary-lighter)] rounded-md"
            onClick={onClose}
            type="button"
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 text-sm font-semibold text-white bg-[var(--color-primary)] rounded-md hover:bg-[var(--color-primary-hover)]"
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
