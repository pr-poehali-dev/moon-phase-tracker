import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface WeatherDay {
  day: string;
  date: string;
  temp: number;
  condition: string;
  icon: string;
  pressure: number;
}

interface PressureStats {
  avg: string;
  max: number;
  min: number;
}

interface WeatherForecastProps {
  weatherData: WeatherDay[];
  pressureStats: PressureStats;
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ weatherData, pressureStats }) => {
  return (
    <Card className="lg:col-span-2 bg-card/50 backdrop-blur border-primary/20 animate-[fade-in_1s_ease-out]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="CloudSun" size={24} className="text-primary" />
          Прогноз погоды • Москва
        </CardTitle>
        <CardDescription>Неделя</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-6">
          {weatherData.map((day, index) => (
            <div 
              key={index}
              className="flex flex-col items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <p className="font-medium text-sm mb-1">{day.day}</p>
              <p className="text-xs text-muted-foreground mb-2">{day.date}</p>
              <Icon name={day.icon as any} size={32} className="text-primary mb-2" />
              <p className="text-lg font-semibold">{day.temp}°</p>
              <p className="text-xs text-muted-foreground mt-1">{day.condition}</p>
              <div className="flex items-center gap-1 mt-2">
                <Icon name="Gauge" size={12} className="text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{day.pressure}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-primary/20">
          <div className="flex flex-col items-center p-3 rounded-lg bg-accent/10">
            <Icon name="TrendingUp" size={20} className="text-primary mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Макс. давление</p>
            <p className="text-lg font-semibold">{pressureStats.max} мм</p>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-accent/10">
            <Icon name="Activity" size={20} className="text-primary mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Среднее</p>
            <p className="text-lg font-semibold">{pressureStats.avg} мм</p>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-accent/10">
            <Icon name="TrendingDown" size={20} className="text-primary mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Мин. давление</p>
            <p className="text-lg font-semibold">{pressureStats.min} мм</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
