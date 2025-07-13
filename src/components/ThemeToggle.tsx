'use client';

import * as React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from './ui/label';

export function ThemeToggle() {
  const [theme, setTheme] = React.useState('dark');

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className="grid gap-2">
      <Label htmlFor="theme">Theme</Label>
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger id="theme">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" /> Light
            </div>
          </SelectItem>
          <SelectItem value="dark">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4" /> Dark
            </div>
          </SelectItem>
          <SelectItem value="cyberpunk" disabled>
            Cyberpunk (Premium)
          </SelectItem>
          <SelectItem value="pixel" disabled>
            Pixel (Premium)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
