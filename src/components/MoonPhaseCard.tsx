import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface MoonPhase {
  phase: number;
  illumination: number;
  name: string;
  icon: string;
}

interface MoonPhaseCardProps {
  moonPhase: MoonPhase;
}

export const MoonPhaseCard: React.FC<MoonPhaseCardProps> = ({ moonPhase }) => {
  return (
    <Card className="lg:col-span-1 bg-card/50 backdrop-blur border-primary/20 animate-[fade-in_0.8s_ease-out]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Moon" size={24} className="text-primary" />
          Текущая фаза
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="text-8xl mb-4 animate-[moon-glow_3s_ease-in-out_infinite]">
          {moonPhase.icon}
        </div>
        <h3 className="text-2xl font-semibold mb-2">{moonPhase.name}</h3>
        <p className="text-muted-foreground mb-4">
          Освещенность: {moonPhase.illumination.toFixed(0)}%
        </p>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-500"
            style={{ width: `${moonPhase.illumination}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
