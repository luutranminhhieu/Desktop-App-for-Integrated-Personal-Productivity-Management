import React, { useCallback, useMemo, useRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import type FullCalendar from '@fullcalendar/react';
import CalendarView from '../components/calendar/CalendarView';
import EventModal from '../components/calendar/EventModal';
import MiniCalendar from '../components/calendar/MiniCalendar';
import { EventStatusColor } from '../constants/eventStatusColor';
import type {
	CalendarEventRecord,
	CalendarFormData,
	CalendarModalMode,
	CalendarViewType
} from '@renderer/types';

const defaultFormData: CalendarFormData = {
	title: '',
	startTime: '',
	endTime: '',
	color: EventStatusColor.todo,
	location: '',
	notes: ''
};

const toDateKey = (value: Dayjs): string => value.format('YYYY-MM-DD');


const Calendar = (): React.JSX.Element => {
	const [userId] = useState<string | null>(() => {
		const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
		if (!stored) return null;
		try {
			const parsed = JSON.parse(stored) as { id?: string };
			return parsed.id ?? null;
		} catch {
			return null;
		}
	});
	const [view, setView] = useState<CalendarViewType>('timeGridWeek');
	const [rangeStart, setRangeStart] = useState<Dayjs>(dayjs());
	const [rangeEnd, setRangeEnd] = useState<Dayjs>(dayjs().add(7, 'day'));
	const [monthDate, setMonthDate] = useState<Dayjs>(dayjs());
	const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
	const [events, setEvents] = useState<CalendarEventRecord[]>([]);
	const [loadingEvents, setLoadingEvents] = useState(false);
	const [eventsError, setEventsError] = useState('');
	const [selectedEvent, setSelectedEvent] = useState<CalendarEventRecord | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState<CalendarModalMode>('create');
	const [modalData, setModalData] = useState<CalendarFormData>(defaultFormData);
	const [activeEventId, setActiveEventId] = useState<string | null>(null);
	const calendarRef = useRef<FullCalendar | null>(null);

	const calendarEvents = useMemo(() => {
		return events.map((event) => {
			const textColor = event.color === EventStatusColor.todo ? '#1A1A2E' : '#ffffff';
			return {
				id: event._id,
				title: event.title,
				start: event.startTime,
				end: event.endTime,
				backgroundColor: event.color,
				borderColor: event.color,
				textColor,
				extendedProps: { location: event.location, notes: event.notes }
			};
		});
	}, [events]);

	const eventDates = useMemo(() => {
		return new Set(events.map((event) => toDateKey(dayjs(event.startTime))));
	}, [events]);

	const fetchEventsForRange = useCallback(
		async (start: Dayjs, end: Dayjs): Promise<void> => {
			if (!userId) return;
			setLoadingEvents(true);
			setEventsError('');
			const response = await window.api.calendar.listRange(
				userId,
				start.toISOString(),
				end.toISOString()
			);

			if (!response.success || !response.data) {
				setEventsError(response.error || 'Không thể tải lịch.');
				setLoadingEvents(false);
				return;
			}

			setEvents(response.data as CalendarEventRecord[]);
			setLoadingEvents(false);
		},
		[userId]
	);

	const handleDatesChange = (start: Date, end: Date): void => {
		const startDay = dayjs(start);
		const endDay = dayjs(end);
		setRangeStart(startDay);
		setRangeEnd(endDay);
		setMonthDate(startDay);
		fetchEventsForRange(startDay, endDay).catch(() => {
			setEventsError('Không thể tải lịch.');
			setLoadingEvents(false);
		});
	};

	const handleSelectRange = (start: Date, end: Date): void => {
		setSelectedEvent(null);
		setModalMode('create');
		setActiveEventId(null);
		setModalData({
			...defaultFormData,
			startTime: dayjs(start).format('YYYY-MM-DDTHH:mm'),
			endTime: dayjs(end).format('YYYY-MM-DDTHH:mm')
		});
		setModalOpen(true);
	};

	const handleEventClick = (eventId: string): void => {
		const event = events.find((item) => item._id === eventId);
		if (!event) return;
		setSelectedEvent(event);
		setModalMode('edit');
		setActiveEventId(eventId);
		setModalData({
			title: event.title,
			startTime: dayjs(event.startTime).format('YYYY-MM-DDTHH:mm'),
			endTime: dayjs(event.endTime).format('YYYY-MM-DDTHH:mm'),
			color: event.color,
			location: event.location ?? '',
			notes: event.notes ?? ''
		});
		setModalOpen(true);
	};

	const handleEventUpdate = async (eventId: string, start: Date, end: Date): Promise<void> => {
		if (!userId) return;
		const response = await window.api.calendar.update(
			eventId,
			{ startTime: start.toISOString(), endTime: end.toISOString() },
			userId
		);
		if (!response.success) {
			setEventsError(response.error || 'Không thể cập nhật lịch.');
			return;
		}
		fetchEventsForRange(rangeStart, rangeEnd).catch(() => undefined);
	};

	const handleSubmit = async (data: CalendarFormData): Promise<void> => {
		if (!userId) return;
		if (modalMode === 'create') {
			const response = await window.api.calendar.create({
				title: data.title,
				startTime: new Date(data.startTime).toISOString(),
				endTime: new Date(data.endTime).toISOString(),
				color: data.color,
				location: data.location,
				notes: data.notes,
				userId
			});
			if (!response.success) {
				setEventsError(response.error || 'Không thể tạo lịch.');
				return;
			}
		} else if (activeEventId) {
			const response = await window.api.calendar.update(
				activeEventId,
				{
					title: data.title,
					startTime: new Date(data.startTime).toISOString(),
					endTime: new Date(data.endTime).toISOString(),
					color: data.color,
					location: data.location,
					notes: data.notes
				},
				userId
			);
			if (!response.success) {
				setEventsError(response.error || 'Không thể cập nhật lịch.');
				return;
			}
		}

		setModalOpen(false);
		setModalData(defaultFormData);
		setActiveEventId(null);
		fetchEventsForRange(rangeStart, rangeEnd).catch(() => undefined);
	};

	const handleDelete = async (): Promise<void> => {
		if (!userId || !activeEventId) return;
		const confirmed = window.confirm('Bạn chắc chắn muốn xóa lịch này?');
		if (!confirmed) return;
		const response = await window.api.calendar.delete(activeEventId, userId);
		if (!response.success) {
			setEventsError(response.error || 'Không thể xóa lịch.');
			return;
		}
		setModalOpen(false);
		setActiveEventId(null);
		fetchEventsForRange(rangeStart, rangeEnd).catch(() => undefined);
	};

	const handleViewChange = (nextView: CalendarViewType): void => {
		setView(nextView);
		calendarRef.current?.getApi().changeView(nextView);
	};

	const handleSelectDate = (value: Dayjs): void => {
		setSelectedDate(value);
		calendarRef.current?.getApi().gotoDate(value.toDate());
	};

	const handleToday = (): void => {
		const today = dayjs();
		setSelectedDate(today);
		setMonthDate(today);
		calendarRef.current?.getApi().today();
	};

	React.useEffect(() => {
		if (!userId) return;
		fetchEventsForRange(rangeStart, rangeEnd).catch(() => undefined);
	}, [fetchEventsForRange, rangeStart, rangeEnd, userId]);

	return (
		<div className="flex flex-col flex-1 min-h-0 text-[var(--color-text)]">
			<div className="flex flex-1 min-h-0 border border-[var(--color-border)] bg-[var(--color-bg)] rounded-lg overflow-hidden">
				<aside className="w-60 border-r border-[var(--color-border)] p-4 flex flex-col gap-8 bg-[var(--color-bg)]">
					<MiniCalendar
						monthDate={monthDate}
						selectedDate={selectedDate}
						eventDates={eventDates}
						onSelectDate={handleSelectDate}
						onPrevMonth={() => setMonthDate((prev) => prev.subtract(1, 'month'))}
						onNextMonth={() => setMonthDate((prev) => prev.add(1, 'month'))}
					/>
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<h4 className="text-[15px] font-bold">Chi tiết công việc</h4>
							<span className="text-xs font-bold text-[var(--color-muted)] bg-[var(--color-primary-lighter)] px-2 rounded">
								{selectedEvent ? '1' : '0'}
							</span>
						</div>
						{selectedEvent ? (
							<div className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg shadow-sm">
								<div className="flex items-center gap-2 mb-3">
									<span
										className="w-2 h-2 rounded-full"
										style={{ backgroundColor: selectedEvent.color || '#1E3A8A' }}
									></span>
									<h5 className="text-[15px] font-semibold text-[var(--color-text)] truncate">
										{selectedEvent.title}
									</h5>
								</div>
								<p className="text-xs text-[var(--color-muted)]">
									{dayjs(selectedEvent.startTime).format('DD/MM/YYYY, HH:mm')} -
									{dayjs(selectedEvent.endTime).format(' HH:mm')}
								</p>
								{selectedEvent.location && (
									<p className="text-xs text-[var(--color-muted)] mt-2">Địa điểm: {selectedEvent.location}</p>
								)}
								{selectedEvent.notes && (
									<p className="text-xs text-[var(--color-muted)] mt-2">Ghi chú: {selectedEvent.notes}</p>
								)}
								<div className="mt-3 flex flex-wrap gap-2">
									<button
										className="px-3 py-1 text-xs font-semibold text-white bg-[var(--color-primary)] rounded-md hover:bg-[var(--color-primary-hover)]"
										onClick={() => handleEventClick(selectedEvent._id)}
										type="button"
									>
										Chỉnh sửa
									</button>
									<button
										className="px-3 py-1 text-xs font-semibold text-[var(--color-muted)] hover:bg-[var(--color-primary-lighter)] rounded-md"
										onClick={() => setSelectedEvent(null)}
										type="button"
									>
										Bỏ chọn
									</button>
								</div>
							</div>
						) : (
							<div className="p-4 bg-[var(--color-primary-lighter)] border border-[var(--color-border)] rounded-lg">
								<p className="text-xs text-[var(--color-muted)]">
									Chọn một sự kiện trên lịch để xem chi tiết.
								</p>
							</div>
						)}
					</div>
				</aside>

				<section className="flex flex-col flex-1 min-h-0 bg-[var(--color-bg)] relative">
					<div className="shrink-0 bg-[var(--color-bg)] z-30 px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								className="px-4 py-2 border border-[var(--color-border)] rounded-md text-[15px] font-medium hover:bg-[var(--color-primary-lighter)] transition-colors"
								type="button"
								onClick={handleToday}
							>
								Today
							</button>
							<div className="flex items-center">
								<button
									type="button"
									className="material-symbols-outlined text-[var(--color-muted)] cursor-pointer p-2 hover:bg-[var(--color-primary-lighter)] rounded-full"
									onClick={() => calendarRef.current?.getApi().prev()}
								>
									chevron_left
								</button>
								<button
									type="button"
									className="material-symbols-outlined text-[var(--color-muted)] cursor-pointer p-2 hover:bg-[var(--color-primary-lighter)] rounded-full"
									onClick={() => calendarRef.current?.getApi().next()}
								>
									chevron_right
								</button>
							</div>
							<h2 className="text-lg font-semibold ml-2"></h2>
						</div>
						<div className="flex bg-[var(--color-primary-lighter)] p-1 rounded-lg">
							<button
								className={`px-4 py-2 text-xs rounded-md ${
									view === 'timeGridDay'
										? 'bg-[var(--color-bg)] text-[var(--color-primary)] shadow-sm font-bold'
										: 'text-[var(--color-muted)] font-medium'
								}`}
								type="button"
								onClick={() => handleViewChange('timeGridDay')}
							>
								Ngày
							</button>
							<button
								className={`px-4 py-2 text-xs rounded-md ${
									view === 'timeGridWeek'
										? 'bg-[var(--color-bg)] text-[var(--color-primary)] shadow-sm font-bold'
										: 'text-[var(--color-muted)] font-medium'
								}`}
								type="button"
								onClick={() => handleViewChange('timeGridWeek')}
							>
								Tuần
							</button>
							<button
								className={`px-4 py-2 text-xs rounded-md ${
									view === 'dayGridMonth'
										? 'bg-[var(--color-bg)] text-[var(--color-primary)] shadow-sm font-bold'
										: 'text-[var(--color-muted)] font-medium'
								}`}
								type="button"
								onClick={() => handleViewChange('dayGridMonth')}
							>
								Tháng
							</button>
						</div>
					</div>

					{eventsError && (
						<div className="px-6 py-3 text-xs text-[var(--color-error)] border-b border-[var(--color-error-border)] bg-[var(--color-error-light)]">
							{eventsError}
						</div>
					)}

					<div className="p-4 flex-1 min-h-0 relative">
						<CalendarView
							calendarRef={calendarRef}
							events={calendarEvents}
							view={view}
							onDatesChange={handleDatesChange}
							onSelectRange={handleSelectRange}
							onEventClick={handleEventClick}
							onEventDrop={handleEventUpdate}
							onEventResize={handleEventUpdate}
						/>
						{loadingEvents && (
							<div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg)]/70">
								<div className="flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 shadow-sm">
									<span className="h-4 w-4 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin"></span>
									<span className="text-xs text-[var(--color-muted)]"></span>
								</div>
							</div>
						)}
					</div>
				</section>
			</div>

			<EventModal
				open={modalOpen}
				mode={modalMode}
				initialData={modalData}
				onClose={() => setModalOpen(false)}
				onSubmit={handleSubmit}
				onDelete={modalMode === 'edit' ? handleDelete : undefined}
			/>
		</div>
	);
};

export default Calendar;
