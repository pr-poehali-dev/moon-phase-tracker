import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LunarCalendarProps {
  calendarDays: (number | null)[];
  today: number;
  getMoonPhase: (date: Date) => { phase: number; illumination: number; name: string; icon: string };
  onDateSelect: (date: Date) => void;
}

export const LunarCalendar: React.FC<LunarCalendarProps> = ({ 
  calendarDays, 
  today, 
  getMoonPhase, 
  onDateSelect 
}) => {
  return (
    <Card className="bg-card/50 backdrop-blur border-primary/20">
      <CardHeader>
        <CardTitle>Декабрь 2025</CardTitle>
        <CardDescription>Лунные фазы и выходные дни</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
            <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={index} className="aspect-square" />;
            }
            const isWeekend = index % 7 >= 5;
            const isToday = day === today;
            const date = new Date(2025, 11, day);
            const moonPhase = getMoonPhase(date);
            
            return (
              <button
                key={index}
                onClick={() => onDateSelect(date)}
                className={`
                  aspect-square p-2 rounded-lg flex flex-col items-center justify-center
                  transition-all hover:scale-105 hover:bg-primary/20
                  ${isToday ? 'bg-primary text-primary-foreground font-bold ring-2 ring-primary' : 'bg-muted/30'}
                  ${isWeekend ? 'text-destructive' : ''}
                `}
              >
                <span className="text-sm mb-1">{day}</span>
                <span className="text-xs">{moonPhase.icon}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary" />
            <span>Сегодня</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-destructive" />
            <span>Выходные</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🌑</span>
            <span>Новолуние</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🌕</span>
            <span>Полнолуние</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
