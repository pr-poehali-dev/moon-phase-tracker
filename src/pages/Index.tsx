import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface UserProfile {
  birthDate: string;
  weight: string;
  height: string;
  gender: 'male' | 'female' | '';
}

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : { birthDate: '', weight: '', height: '', gender: '' };
  });
  const [tempProfile, setTempProfile] = useState<UserProfile>(userProfile);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = (weight: string, height: string) => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!w || !h) return null;
    return (w / (h * h)).toFixed(1);
  };

  const handleSaveProfile = () => {
    setUserProfile(tempProfile);
    setIsProfileOpen(false);
  };

  const age = calculateAge(userProfile.birthDate);
  const bmi = calculateBMI(userProfile.weight, userProfile.height);
  const hasProfile = userProfile.birthDate && userProfile.weight && userProfile.height;

  const getMoonPhase = (date: Date = new Date()) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    let c = 0;
    let e = 0;
    let jd = 0;
    let b = 0;

    if (month < 3) {
      c = year - 1;
      e = month + 12;
    } else {
      c = year;
      e = month;
    }

    jd = Math.floor(365.25 * (c + 4716)) + Math.floor(30.6001 * (e + 1)) + day - 1524.5;
    b = (jd - 2451550.1) / 29.530588853;
    b = b - Math.floor(b);
    
    const phase = b * 8;
    
    return {
      phase: phase,
      illumination: (b < 0.5 ? b : 1 - b) * 200,
      name: phase < 1 ? 'Новолуние' : phase < 2 ? 'Молодая луна' : phase < 3 ? 'Первая четверть' : phase < 4 ? 'Растущая луна' : phase < 5 ? 'Полнолуние' : phase < 6 ? 'Убывающая луна' : phase < 7 ? 'Последняя четверть' : 'Старая луна',
      icon: phase < 1 ? '🌑' : phase < 2 ? '🌒' : phase < 3 ? '🌓' : phase < 4 ? '🌔' : phase < 5 ? '🌕' : phase < 6 ? '🌖' : phase < 7 ? '🌗' : '🌘'
    };
  };

  const currentMoonPhase = getMoonPhase();

  const weatherData = [
    { day: 'Пн', date: '9 дек', temp: -5, condition: 'Снег', icon: 'CloudSnow', pressure: 745 },
    { day: 'Вт', date: '10 дек', temp: -8, condition: 'Ясно', icon: 'Sun', pressure: 758 },
    { day: 'Ср', date: '11 дек', temp: -6, condition: 'Облачно', icon: 'Cloud', pressure: 752 },
    { day: 'Чт', date: '12 дек', temp: -4, condition: 'Снег', icon: 'CloudSnow', pressure: 748 },
    { day: 'Пт', date: '13 дек', temp: -7, condition: 'Ясно', icon: 'Sun', pressure: 762 },
    { day: 'Сб', date: '14 дек', temp: -9, condition: 'Облачно', icon: 'Cloud', pressure: 755 },
    { day: 'Вс', date: '15 дек', temp: -10, condition: 'Метель', icon: 'CloudSnow', pressure: 742 }
  ];

  const getPressureData = () => {
    const avgPressure = weatherData.reduce((sum, d) => sum + d.pressure, 0) / weatherData.length;
    const maxPressure = Math.max(...weatherData.map(d => d.pressure));
    const minPressure = Math.min(...weatherData.map(d => d.pressure));
    return { avg: avgPressure.toFixed(0), max: maxPressure, min: minPressure };
  };

  const pressureStats = getPressureData();

  const holidays2025 = [
    { date: '1-6 января', name: 'Новогодние каникулы', type: 'holiday' },
    { date: '7 января', name: 'Рождество', type: 'holiday' },
    { date: '23 февраля', name: 'День защитника Отечества', type: 'holiday' },
    { date: '8 марта', name: 'Международный женский день', type: 'holiday' },
    { date: '1 мая', name: 'Праздник Весны и Труда', type: 'holiday' },
    { date: '9 мая', name: 'День Победы', type: 'holiday' },
    { date: '12 июня', name: 'День России', type: 'holiday' },
    { date: '4 ноября', name: 'День народного единства', type: 'holiday' }
  ];

  const generateCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const calendarDays = generateCalendar();
  const today = new Date().getDate();

  const lunarInfluence = [
    { area: 'Здоровье', icon: 'Heart', recommendation: 'Благоприятный период для восстановления сил', status: 'good' },
    { area: 'Карьера', icon: 'Briefcase', recommendation: 'Удачное время для новых начинаний', status: 'good' },
    { area: 'Финансы', icon: 'TrendingUp', recommendation: 'Избегайте крупных трат', status: 'caution' },
    { area: 'Отношения', icon: 'Users', recommendation: 'Время для укрепления связей', status: 'good' },
    { area: 'Садоводство', icon: 'Sprout', recommendation: 'Оптимально для посадки корнеплодов', status: 'good' },
    { area: 'Стрижка', icon: 'Scissors', recommendation: 'Волосы будут расти медленнее', status: 'neutral' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] via-[#221F3A] to-[#1A1F2C]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12 animate-[fade-in_0.6s_ease-out]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#E5DEFF] bg-clip-text text-transparent">
              Лунный календарь
            </h1>
            <div className="flex-1 flex justify-end">
              <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Icon name="User" size={20} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Личные данные</DialogTitle>
                    <DialogDescription>
                      Укажите свои данные для персонализированных рекомендаций
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="birthDate">Дата рождения</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={tempProfile.birthDate}
                        onChange={(e) => setTempProfile({ ...tempProfile, birthDate: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="weight">Вес (кг)</Label>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="70"
                          value={tempProfile.weight}
                          onChange={(e) => setTempProfile({ ...tempProfile, weight: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="height">Рост (см)</Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="175"
                          value={tempProfile.height}
                          onChange={(e) => setTempProfile({ ...tempProfile, height: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Пол</Label>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={tempProfile.gender === 'male' ? 'default' : 'outline'}
                          className="flex-1"
                          onClick={() => setTempProfile({ ...tempProfile, gender: 'male' })}
                        >
                          <Icon name="User" size={16} className="mr-2" />
                          Мужской
                        </Button>
                        <Button
                          type="button"
                          variant={tempProfile.gender === 'female' ? 'default' : 'outline'}
                          className="flex-1"
                          onClick={() => setTempProfile({ ...tempProfile, gender: 'female' })}
                        >
                          <Icon name="User" size={16} className="mr-2" />
                          Женский
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleSaveProfile}>Сохранить</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">Москва • {new Date().toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          {hasProfile && (
            <div className="mt-4 inline-flex items-center gap-4 px-4 py-2 rounded-full bg-primary/10 text-sm">
              {age && <span>Возраст: {age} лет</span>}
              {bmi && <span>ИМТ: {bmi}</span>}
              <span className="capitalize">{userProfile.gender === 'male' ? 'Мужской' : userProfile.gender === 'female' ? 'Женский' : ''}</span>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1 bg-card/50 backdrop-blur border-primary/20 animate-[fade-in_0.8s_ease-out]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Moon" size={24} className="text-primary" />
                Текущая фаза
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="text-8xl mb-4 animate-[moon-glow_3s_ease-in-out_infinite]">
                {currentMoonPhase.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-2">{currentMoonPhase.name}</h3>
              <p className="text-muted-foreground mb-4">
                Освещенность: {currentMoonPhase.illumination.toFixed(0)}%
              </p>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-500"
                  style={{ width: `${currentMoonPhase.illumination}%` }}
                />
              </div>
            </CardContent>
          </Card>

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
        </div>

        <Tabs defaultValue="calendar" className="animate-[fade-in_1.2s_ease-out]">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Icon name="Calendar" size={18} />
              Календарь
            </TabsTrigger>
            <TabsTrigger value="influence" className="flex items-center gap-2">
              <Icon name="Sparkles" size={18} />
              Влияние луны
            </TabsTrigger>
            <TabsTrigger value="holidays" className="flex items-center gap-2">
              <Icon name="Gift" size={18} />
              Праздники
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
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
                        onClick={() => setSelectedDate(date)}
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
          </TabsContent>

          <TabsContent value="influence">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lunarInfluence.map((item, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Icon name={item.icon as any} size={20} className="text-primary" />
                        {item.area}
                      </span>
                      <Badge variant={item.status === 'good' ? 'default' : item.status === 'caution' ? 'destructive' : 'secondary'}>
                        {item.status === 'good' ? '✓' : item.status === 'caution' ? '⚠' : '○'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.recommendation}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="holidays">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle>Производственный календарь 2025</CardTitle>
                <CardDescription>Выходные и праздничные дни в России</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {holidays2025.map((holiday, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon name="Gift" size={24} className="text-primary" />
                        <div>
                          <h4 className="font-semibold">{holiday.name}</h4>
                          <p className="text-sm text-muted-foreground">{holiday.date}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Праздник</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="mt-12 text-center text-sm text-muted-foreground animate-[fade-in_1.4s_ease-out]">
          <p>🌙 Лунный календарь • Данные актуальны для Москвы</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;