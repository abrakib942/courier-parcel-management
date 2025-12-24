import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LayoutDashboard, Package, PackagePlus, MapPin, User } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Book Parcel',
    href: '/book-parcel',
    icon: <PackagePlus className="h-5 w-5" />,
  },
  {
    title: 'My Parcels',
    href: '/my-parcels',
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: 'Track Parcel',
    href: '/track',
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: <User className="h-5 w-5" />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 border-r bg-card min-h-[calc(100vh-4rem)]">
      <nav className="space-y-1 p-4">
        {navItems.map(item => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
                isActive ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground',
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
