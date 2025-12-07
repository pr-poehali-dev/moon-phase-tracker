import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

export interface UserProfile {
  birthDate: string;
  weight: string;
  height: string;
  gender: 'male' | 'female' | '';
}

interface UserProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tempProfile: UserProfile;
  setTempProfile: (profile: UserProfile) => void;
  onSave: () => void;
}

export const UserProfileDialog: React.FC<UserProfileDialogProps> = ({
  isOpen,
  onOpenChange,
  tempProfile,
  setTempProfile,
  onSave
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button type="submit" onClick={onSave}>Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
