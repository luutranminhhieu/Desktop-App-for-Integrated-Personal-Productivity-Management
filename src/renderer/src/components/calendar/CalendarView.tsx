import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import viLocale from '@fullcalendar/core/locales/vi';

import type { CalendarViewType } from '@renderer/types';

export type CalendarViewProps = {
  calendarRef: React.RefObject<FullCalendar | null>;
  events: Array<{
    id: string;
    title: string;
    start: string;
    end: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    extendedProps?: Record<string, unknown>;
  }>;
  view: CalendarViewType;
  onDatesChange: (start: Date, end: Date) => void;
  onSelectRange: (start: Date, end: Date) => void;
  onEventClick: (eventId: string) => void;
  onEventDrop: (eventId: string, start: Date, end: Date) => void;
  onEventResize: (eventId: string, start: Date, end: Date) => void;
};

const CalendarView = ({
  calendarRef,
  events,
  view,
  onDatesChange,
  onSelectRange,
  onEventClick,
  onEventDrop,
  onEventResize
}: CalendarViewProps): React.JSX.Element => {
  return (
    <div className="h-full calendar-root">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={view}
        headerToolbar={false}
        height="100%"
        locale={viLocale}
        slotDuration="01:00:00"
        slotLabelInterval="01:00"
        editable
        selectable
        selectMirror
        nowIndicator
        dayMaxEvents
        events={events}
        datesSet={(info) => onDatesChange(info.start, info.end)}
        select={(info) => onSelectRange(info.start, info.end)}
        eventClick={(info) => onEventClick(info.event.id)}
        eventDrop={(info) => {
          if (!info.event.start || !info.event.end) return;
          onEventDrop(info.event.id, info.event.start, info.event.end);
        }}
        eventResize={(info) => {
          if (!info.event.start || !info.event.end) return;
          onEventResize(info.event.id, info.event.start, info.event.end);
        }}
        eventContent={(info) => {
          const color = info.event.backgroundColor || info.event.borderColor || '#1E3A8A';
          return (
            <div className="calendar-event" style={{ backgroundColor: color, borderLeft: `3px solid ${color}` }}>
              <div className="calendar-event-title">{info.event.title}</div>
              {info.timeText && <div className="calendar-event-time">{info.timeText}</div>}
            </div>
          );
        }}
      />
    </div>
  );
};

export default CalendarView;
