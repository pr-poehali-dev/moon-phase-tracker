import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface DayDetailsDialogProps {
  date: Date | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  getMoonPhase: (date: Date) => { phase: number; illumination: number; name: string; icon: string };
  getPressureForDate: (date: Date) => number;
  getSunriseSunset: (date: Date) => { sunrise: string; sunset: string };
}

export const DayDetailsDialog: React.FC<DayDetailsDialogProps> = ({
  date,
  isOpen,
  onOpenChange,
  getMoonPhase,
  getPressureForDate,
  getSunriseSunset
}) => {
  if (!date) return null;

  const moonPhase = getMoonPhase(date);
  const pressure = getPressureForDate(date);
  const { sunrise, sunset } = getSunriseSunset(date);
  const dayName = date.toLocaleDateString('ru-RU', { weekday: 'long' });
  const fullDate = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Calendar" size={24} className="text-primary" />
            Детали дня
          </DialogTitle>
          <DialogDescription>
            Подробная информация о выбранной дате
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold capitalize">{dayName}</h3>
                  <p className="text-muted-foreground">{fullDate}</p>
                </div>
                <div className="text-5xl">
                  {moonPhase.icon}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Clock" size={20} className="text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Текущее время</span>
                </div>
                <p className="text-2xl font-bold">{time}</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Gauge" size={20} className="text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Давление</span>
                </div>
                <p className="text-2xl font-bold">{pressure} мм</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Sunrise" size={20} className="text-orange-500" />
                  <span className="text-sm font-medium text-muted-foreground">Восход солнца</span>
                </div>
                <p className="text-2xl font-bold">{sunrise}</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Sunset" size={20} className="text-orange-600" />
                  <span className="text-sm font-medium text-muted-foreground">Закат солнца</span>
                </div>
                <p className="text-2xl font-bold">{sunset}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Moon" size={20} className="text-primary" />
                    <span className="font-semibold">Фаза луны</span>
                  </div>
                  <p className="text-lg">{moonPhase.name}</p>
                </div>
                <Badge variant="secondary" className="text-base px-4 py-2">
                  {moonPhase.illumination.toFixed(0)}% освещённости
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} className="text-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {moonPhase.phase >= 0 && moonPhase.phase < 4 
                      ? 'Растущая луна — благоприятное время для начинаний и активных действий' 
                      : 'Убывающая луна — время для завершения дел и отдыха'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};