'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'New Project', href: '/projects/new', icon: 'add_circle' },
  { label: 'Templates', href: '/templates', icon: 'library_books' },
  { label: 'Exports', href: '/dashboard', icon: 'download' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-surface-container-low flex flex-col py-6 border-r border-surface-high">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <Image src="/cadmus-logo.jpg" alt="CADMUS" width={48} height={48} className="object-contain mix-blend-multiply" />
          <div>
            <p className="font-bold text-sm text-on-surface tracking-tight">CADMUS</p>
            <p className="text-[10px] text-on-surface-variant">by JourdanLabs</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <p className="px-3 text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-3">
          Navigation
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-surface-container text-primary font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container/50'
              )}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 pt-4 border-t border-surface-high">
        <a href="https://jourdanlabs.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
          <Image src="/jourdanlabs-logo.jpg" alt="JourdanLabs" width={32} height={32} className="object-contain mix-blend-multiply opacity-70 group-hover:opacity-100 transition-opacity" />
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant group-hover:text-on-surface transition-colors">JourdanLabs</p>
            <p className="text-[9px] text-on-surface-variant/50">Powered by COSMIC</p>
          </div>
        </a>
      </div>
    </aside>
  );
}
