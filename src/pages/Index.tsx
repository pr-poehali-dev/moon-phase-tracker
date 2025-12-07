import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { UserProfileDialog, type UserProfile } from '@/components/UserProfileDialog';
import { MoonPhaseCard } from '@/components/MoonPhaseCard';
import { WeatherForecast } from '@/components/WeatherForecast';
import { LunarCalendar } from '@/components/LunarCalendar';
import { DayDetailsDialog } from '@/components/DayDetailsDialog';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDateDetailsOpen, setIsDateDetailsOpen] = useState(false);
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

  const getPressureForDate = (date: Date) => {
    const baselinePressure = 750;
    const day = date.getDate();
    const variation = Math.sin(day / 5) * 10;
    return Math.round(baselinePressure + variation);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsDateDetailsOpen(true);
  };

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

  const getPersonalizedRecommendations = () => {
    const phase = currentMoonPhase.phase;
    const isGrowing = phase >= 0 && phase < 4;
    const recommendations = [];

    if (hasProfile) {
      if (bmi && parseFloat(bmi) > 25 && isGrowing) {
        recommendations.push({
          area: 'Здоровье',
          icon: 'Heart',
          recommendation: `Растущая луна - начните программу детокса. Ваш ИМТ ${bmi} указывает на необходимость контроля веса`,
          status: 'caution',
          personal: true
        });
      } else if (bmi && parseFloat(bmi) < 18.5 && !isGrowing) {
        recommendations.push({
          area: 'Здоровье',
          icon: 'Heart',
          recommendation: `Убывающая луна - усильте питание. Ваш ИМТ ${bmi} указывает на недостаток массы`,
          status: 'caution',
          personal: true
        });
      } else {
        recommendations.push({
          area: 'Здоровье',
          icon: 'Heart',
          recommendation: isGrowing ? 'Растущая луна благоприятна для активных тренировок и набора мышечной массы' : 'Убывающая луна - время для очищения организма и восстановления',
          status: 'good',
          personal: true
        });
      }

      if (age && age > 40 && phase >= 4 && phase < 6) {
        recommendations.push({
          area: 'Самочувствие',
          icon: 'Activity',
          recommendation: 'Полнолуние может влиять на давление и сон в вашем возрасте. Больше отдыхайте',
          status: 'caution',
          personal: true
        });
      }

      if (userProfile.gender === 'female' && isGrowing) {
        recommendations.push({
          area: 'Красота',
          icon: 'Sparkles',
          recommendation: 'Растущая луна - лучшее время для масок, процедур для роста волос и укрепления ногтей',
          status: 'good',
          personal: true
        });
      }
    }

    recommendations.push(
      { area: 'Карьера', icon: 'Briefcase', recommendation: isGrowing ? 'Растущая луна благоприятна для новых проектов и переговоров' : 'Убывающая луна - время завершить начатое и проанализировать результаты', status: 'good', personal: false },
      { area: 'Финансы', icon: 'TrendingUp', recommendation: isGrowing ? 'Растущая луна - можно планировать крупные покупки' : 'Убывающая луна - избегайте необдуманных трат, копите', status: isGrowing ? 'good' : 'caution', personal: false },
      { area: 'Отношения', icon: 'Users', recommendation: phase >= 4 && phase < 6 ? 'Полнолуние обостряет эмоции - будьте терпеливы с близкими' : 'Благоприятное время для общения', status: phase >= 4 && phase < 6 ? 'caution' : 'good', personal: false },
      { area: 'Садоводство', icon: 'Sprout', recommendation: isGrowing ? 'Растущая луна - сажайте растения, плоды которых над землёй' : 'Убывающая луна - время для корнеплодов и обрезки', status: 'good', personal: false }
    );

    return recommendations;
  };

  const lunarInfluence = getPersonalizedRecommendations();

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
              <UserProfileDialog
                isOpen={isProfileOpen}
                onOpenChange={setIsProfileOpen}
                tempProfile={tempProfile}
                setTempProfile={setTempProfile}
                onSave={handleSaveProfile}
              />
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
          <MoonPhaseCard moonPhase={currentMoonPhase} />
          <WeatherForecast weatherData={weatherData} pressureStats={pressureStats} />
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
            <LunarCalendar
              calendarDays={calendarDays}
              today={today}
              getMoonPhase={getMoonPhase}
              onDateSelect={handleDateSelect}
            />
          </TabsContent>

          <TabsContent value="influence">
            {hasProfile && (
              <Card className="mb-6 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur border-primary/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Sparkles" size={24} className="text-primary" />
                    Персональные рекомендации
                  </CardTitle>
                  <CardDescription>На основе ваших данных и текущей фазы луны</CardDescription>
                </CardHeader>
              </Card>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lunarInfluence.map((item, index) => (
                <Card 
                  key={index} 
                  className={`bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all ${
                    item.personal ? 'ring-2 ring-primary/30' : ''
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Icon name={item.icon as any} size={20} className="text-primary" />
                        {item.area}
                        {item.personal && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Для вас
                          </Badge>
                        )}
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

        <DayDetailsDialog
          date={selectedDate}
          isOpen={isDateDetailsOpen}
          onOpenChange={setIsDateDetailsOpen}
          getMoonPhase={getMoonPhase}
          getPressureForDate={getPressureForDate}
        />
      </div>
    </div>
  );
};

export default Index;