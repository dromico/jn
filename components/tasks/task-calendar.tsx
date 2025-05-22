'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card } from '@/components/ui/card';
import { Todo } from '@/src/app/dashboard/todos/page';

interface TaskCalendarProps {
  todos: Todo[];
  onDateClick: (date: string) => void;
  onEventClick: (todoId: string) => void;
}

export default function TaskCalendar({ todos, onDateClick, onEventClick }: TaskCalendarProps) {
  interface CalendarEvent {
    id: string;
    title: string;
    start: string | null;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    classNames: string[];
    extendedProps: {
      description?: string | null;
      priority: Todo['priority'];
    };
  }

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Convert todos to calendar events
  useEffect(() => {
    const events = todos
      .filter(todo => todo.due_date) // Only include todos with due dates
      .map(todo => ({
        id: todo.id,
        title: todo.title,
        start: todo.due_date,
        backgroundColor: getPriorityColor(todo.priority),
        borderColor: getPriorityColor(todo.priority),
        textColor: '#ffffff',
        classNames: [todo.completed ? 'completed-task' : ''],
        extendedProps: {
          description: todo.description,
          priority: todo.priority
        }
      }));

    setCalendarEvents(events);
  }, [todos]);

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return '#ef4444'; // Red
      case 'medium':
        return '#f59e0b'; // Yellow/Amber
      case 'low':
        return '#10b981'; // Green
      default:
        return '#6b7280'; // Gray
    }
  };

  interface DateClickInfo {
    dateStr: string;
    [key: string]: unknown;
  }

  interface EventClickInfo {
    event: {
      id: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }

  const handleDateClick = (info: DateClickInfo) => {
    onDateClick(info.dateStr);
  };

  const handleEventClick = (info: EventClickInfo) => {
    onEventClick(info.event.id);
  };

  return (
    <Card className="p-4">
      <style jsx global>{`
        .fc-day-today {
          background-color: rgba(59, 130, 246, 0.1) !important;
        }
        .fc-event {
          cursor: pointer;
        }
        .completed-task {
          opacity: 0.7;
          text-decoration: line-through;
        }
        .fc-header-toolbar {
          margin-bottom: 1rem !important;
        }
        .fc-button-primary {
          background-color: hsl(var(--primary));
          border-color: hsl(var(--primary));
        }
        .fc-button-primary:not(:disabled):hover {
          background-color: hsl(var(--primary) / 0.9);
          border-color: hsl(var(--primary) / 0.9);
        }
        .fc-button-primary:not(:disabled).fc-button-active {
          background-color: hsl(var(--primary) / 0.8);
          border-color: hsl(var(--primary) / 0.8);
        }

        /* Mobile Responsive Styles */
        .fc .fc-toolbar {
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
          .fc .fc-toolbar {
            flex-direction: column;
            gap: 0.75rem;
          }

          .fc .fc-toolbar-title {
            font-size: 1.2rem;
          }

          .fc .fc-button {
            padding: 0.3rem 0.5rem;
            font-size: 0.85rem;
          }

          .fc .fc-daygrid-day-number,
          .fc .fc-col-header-cell-cushion {
            font-size: 0.85rem;
            padding: 0.2rem;
          }

          .fc-event-title {
            font-size: 0.75rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        /* Fix padding issues on small screens */
        @media (max-width: 640px) {
          .fc-toolbar.fc-header-toolbar {
            padding: 0;
            margin-bottom: 0.5rem !important;
          }

          .fc .fc-view-harness {
            height: 400px !important;
          }
        }
      `}</style>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView={isMobile ? "dayGridDay" : "dayGridMonth"}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: isMobile ? 'dayGridDay,dayGridWeek' : 'dayGridMonth,dayGridWeek'
        }}
        events={calendarEvents}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
        editable={false}
        selectable={true}
        weekends={true}
        eventDisplay={isMobile ? "block" : "auto"}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short'
        }}
        eventContent={(eventInfo) => {
          const priority = eventInfo.event.extendedProps.priority;
          const isCompleted = eventInfo.event.classNames.includes('completed-task');

          return (
            <div className={`p-1 ${isCompleted ? 'line-through opacity-70' : ''}`}>
              <div className="text-xs font-semibold overflow-hidden text-overflow-ellipsis whitespace-nowrap">
                {eventInfo.event.title}
              </div>
              {!isMobile && (
                <div className="text-xs mt-1 opacity-80">
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </div>
              )}
            </div>
          );
        }}
      />
    </Card>
  );
}