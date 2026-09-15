import type { ComponentType, SVGProps } from "react";
import {
  ArrowLeft,
  ArrowUpDown,
  Armchair,
  Bell,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  Fuel,
  Gauge,
  Grid2x2,
  Heart,
  Info,
  Landmark,
  List,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MoreHorizontal,
  Pencil,
  Plus,
  Phone,
  Search,
  Settings2,
  SlidersHorizontal,
  Snowflake,
  Star,
  Trash2,
  Upload,
  User,
  Wallet,
  X,
} from "lucide-react";

// Every glyph in the app resolves through this one map, so icon set choices
// stay in a single place. Lucide is tree-shaken — only the icons imported
// above are bundled.
const icons = {
  location: MapPin,
  calendar: Calendar,
  clock: Clock,
  "chevron-down": ChevronDown,
  "chevron-right": ChevronRight,
  "chevron-left": ChevronLeft,
  bell: Bell,
  user: User,
  menu: Menu,
  close: X,
  search: Search,
  star: Star,
  heart: Heart,
  check: Check,
  "check-circle": CheckCircle2,
  upload: Upload,
  "arrow-left": ArrowLeft,
  swap: ArrowUpDown,
  "credit-card": CreditCard,
  bank: Landmark,
  wallet: Wallet,
  fuel: Fuel,
  seat: Armchair,
  filter: SlidersHorizontal,
  sort: Settings2,
  car: Car,
  phone: Phone,
  mail: Mail,
  lock: Lock,
  eye: Eye,
  "eye-off": EyeOff,
  plus: Plus,
  trash: Trash2,
  edit: Pencil,
  logout: LogOut,
  download: Download,
  info: Info,
  more: MoreHorizontal,
  grid: Grid2x2,
  list: List,
  gearbox: Gauge,
  snowflake: Snowflake,
  spinner: Loader2,
} satisfies Record<
  string,
  ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>
>;

export type IconName = keyof typeof icons;

type IconProps = SVGProps<SVGSVGElement> & { name: IconName; size?: number };

export default function Icon({
  name,
  size = 20,
  strokeWidth = 1.9,
  ...props
}: IconProps) {
  const Glyph = icons[name];
  return (
    <Glyph
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      {...props}
    />
  );
}
