import {
    AlertTriangle,
    ArrowLeft,
    Calendar,
    CalendarClock,
    CalendarDays,
    Heart,
    LogOut,
    MapPin,
    MessageCircleQuestion,
    Plus,
    Search,
    Settings,
    Sparkles,
    Stars,
    Ticket,
    Trash2,
    User,
    UserCircle,
    Users,
    WifiOff,
} from 'lucide-react-native';
import type { ComponentProps } from 'react';

type LucideProps = ComponentProps<typeof Calendar>;

const ICONS = {
  'alert-triangle': AlertTriangle,
  'arrow-left': ArrowLeft,
  calendar: Calendar,
  'calendar-event': CalendarDays,
  'calendar-time': CalendarClock,
  heart: Heart,
  logout: LogOut,
  'map-pin': MapPin,
  'message-question': MessageCircleQuestion,
  plus: Plus,
  search: Search,
  settings: Settings,
  sparkles: Sparkles,
  stars: Stars,
  ticket: Ticket,
  trash: Trash2,
  user: User,
  'user-circle': UserCircle,
  users: Users,
  'wifi-off': WifiOff,
} as const;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
  style?: LucideProps['style'];
};

export function Icon({
  name,
  size = 16,
  color,
  strokeWidth = 1.8,
  fill = 'none',
  style,
}: IconProps) {
  const LucideIcon = ICONS[name];
  const scaledSize = Math.round(size * 1.15);
  return (
    <LucideIcon
      size={scaledSize}
      color={color}
      strokeWidth={strokeWidth}
      fill={fill}
      style={style}
    />
  );
}
