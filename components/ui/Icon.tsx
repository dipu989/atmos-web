import {
  Leaf,
  Target,
  Flame,
  Calendar,
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  Trophy,
  Star,
  Zap,
  Award,
  Shield,
  Crown,
  TreePine,
  Medal,
  Bike,
  Train,
  CheckCircle,
  Check,
  ShieldCheck,
} from 'lucide-react'

export interface IconProps {
  name: string
  size?: number
  color?: string
  strokeWidth?: number
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  leaf: Leaf,
  target: Target,
  flame: Flame,
  calendar: Calendar,
  arrowDownRight: ArrowDownRight,
  arrowUpRight: ArrowUpRight,
  minus: Minus,
  trophy: Trophy,
  star: Star,
  zap: Zap,
  award: Award,
  shield: Shield,
  crown: Crown,
  treePine: TreePine,
  medal: Medal,
  bike: Bike,
  train: Train,
  checkCircle: CheckCircle,
  check: Check,
  shieldCheck: ShieldCheck,
}

export function Icon({ name, size = 16, color, strokeWidth = 2 }: IconProps) {
  const Component = ICON_MAP[name]
  if (!Component) return null
  return <Component size={size} color={color} strokeWidth={strokeWidth} />
}
