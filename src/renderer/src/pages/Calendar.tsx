import React, { useCallback, useMemo, useRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import type FullCalendar from '@fullcalendar/react';
import CalendarView from '../components/calendar/CalendarView';
import MiniCalendar from '../components/calendar/MiniCalendar';
import { EventStatusColor } from '../constants/eventStatusColor';
import { CALENDAR_CONFIG } from '@renderer/config/calendarConfig';
import type {
	CalendarEventRecord,
	CalendarViewType
} from '@renderer/types';

const toDateKey = (value: Dayjs): string => value.format('YYYY-MM-DD');


const Calendar = (): React.JSX.Element => {
	const [userId] = useState<string | null>(() => {
		const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
		if (!stored) return null;
		try {
			const parsed = JSON.parse(stored) as { id?: string; _id?: string };
			return parsed.id ?? parsed._id ?? null;
		} catch {
			return null;
		}
	});
	const [view, setView] = useState<CalendarViewType>(CALENDAR_CONFIG.DEFAULT_VIEW);
	const [rangeStart, setRangeStart] = useState<Dayjs>(dayjs());
	const [rangeEnd, setRangeEnd] = useState<Dayjs>(dayjs().add(7, 'day'));
	const [monthDate, setMonthDate] = useState<Dayjs>(dayjs());
	const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
	const [events, setEvents] = useState<CalendarEventRecord[]>([]);
	const [loadingEvents, setLoadingEvents] = useState(false);
	const [eventsError, setEventsError] = useState('');
	const [selectedEvent, setSelectedEvent] = useState<CalendarEventRecord | null>(null);
	const calendarRef = useRef<FullCalendar | null>(null);

	const calendarEvents = useMemo(() => {
		return events.map((event) => {
			const textColor =
				event.color === EventStatusColor.todo || event.color === EventStatusColor.canceled
					? '#1A1A2E'
					: '#ffffff';
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
				setEventsError(response.error || CALENDAR_CONFIG.STRINGS.fetchError);
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
			setEventsError(CALENDAR_CONFIG.STRINGS.fetchError);
			setLoadingEvents(false);
		});
	};

	const handleEventClick = (eventId: string): void => {
		const event = events.find((item) => item._id === eventId);
		if (!event) return;
		setSelectedEvent(event);
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
		let active = true;
		const load = async (): Promise<void> => {
			await Promise.resolve();
			if (!active) return;
			await fetchEventsForRange(rangeStart, rangeEnd);
		};
		load().catch(() => undefined);
		return () => {
			active = false;
		};
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
							<h4 className="text-[15px] font-bold">{CALENDAR_CONFIG.STRINGS.taskDetailsHeader}</h4>
							<span className="text-xs font-bold text-[var(--color-muted)] bg-[var(--color-primary-lighter)] px-2 rounded">
							</span>
						</div>
						{selectedEvent ? (
							<div className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg shadow-sm">
								<div className="flex items-center gap-2 mb-3">
									<span
										className="w-2 h-2 rounded-full"
										style={{ backgroundColor: selectedEvent.color || CALENDAR_CONFIG.FALLBACK_EVENT_COLOR }}
									></span>
									<h5 className="text-[15px] font-semibold text-[var(--color-text)] truncate">
										{selectedEvent.title}
									</h5>
								</div>
								<p className="text-xs text-[var(--color-muted)]">
									{dayjs(selectedEvent.startTime).format(CALENDAR_CONFIG.DATE_FORMATS.dateTime)} -
									{dayjs(selectedEvent.endTime).format(CALENDAR_CONFIG.DATE_FORMATS.timeOnly)}
								</p>
								{selectedEvent.location && (
									<p className="text-xs text-[var(--color-muted)] mt-2">{CALENDAR_CONFIG.STRINGS.locationPrefix}{selectedEvent.location}</p>
								)}
								{selectedEvent.notes && (
									<p className="text-xs text-[var(--color-muted)] mt-2">{CALENDAR_CONFIG.STRINGS.notesPrefix}{selectedEvent.notes}</p>
								)}
								<button
									className="mt-3 px-2 py-0.5 text-xs font-semibold text-[var(--color-muted)] hover:bg-[var(--color-primary-lighter)] rounded-md flex items-center justify-center"
									onClick={() => setSelectedEvent(null)}
									type="button"
									title="Deselect"
								>
									<span className="material-symbols-outlined" style={{ fontSize: '16px' }}>remove</span>
								</button>
							</div>
						) : (
							<div className="p-4 bg-[var(--color-primary-lighter)] border border-[var(--color-border)] rounded-lg">
								<p className="text-xs text-[var(--color-muted)]">
									{CALENDAR_CONFIG.STRINGS.selectInstruction}
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
								{CALENDAR_CONFIG.STRINGS.todayButton}
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
							{CALENDAR_CONFIG.VIEWS.map((item) => (
								<button
									key={item.key}
									className={`px-4 py-2 text-xs rounded-md ${
										view === item.key
											? 'bg-[var(--color-bg)] text-[var(--color-primary)] shadow-sm font-bold'
											: 'text-[var(--color-muted)] font-medium'
									}`}
									type="button"
									onClick={() => handleViewChange(item.key)}
								>
									{item.label}
								</button>
							))}
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
							onEventClick={handleEventClick}
						/>
						{loadingEvents}
					</div>
				</section>
			</div>

		</div>
	);
};

export default Calendar;
