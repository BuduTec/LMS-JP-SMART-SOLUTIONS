'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FolderTree,
  CreditCard,
  UserCheck,
  CheckCircle2,
  Sliders,
  History,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    router.push('/login');
    router.refresh();
  };

  const navSections = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Academy Management',
      items: [
        { name: 'Students', href: '/admin/students', icon: Users },
        { name: 'Courses', href: '/admin/courses', icon: BookOpen },
        { name: 'Categories', href: '/admin/categories', icon: FolderTree },
        { name: 'Enrolments', href: '/admin/enrolments', icon: UserCheck },
        { name: 'Payments', href: '/admin/payments', icon: CreditCard },
      ],
    },
    {
      title: 'Academics & Quality',
      items: [
        { name: 'Assessments', href: '/admin/assessments', icon: CheckCircle2 },
      ],
    },
    {
      title: 'System & Security',
      items: [
        { name: 'Feature Settings', href: '/admin/settings/features', icon: Sliders },
        { name: 'Platform Settings', href: '/admin/settings', icon: ShieldAlert },
        { name: 'Audit Logs', href: '/admin/audit-logs', icon: History },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-jpdark text-white min-h-screen flex flex-col border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-hero-gradient flex items-center justify-center shadow-md">
            <GraduationCap className="h-5 w-5 text-jpcyan" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-white leading-none">
              JP SMART
            </div>
            <div className="text-[10px] font-bold text-jpcyan uppercase tracking-wider mt-0.5">
              Admin Console
            </div>
          </div>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {section.title}
            </div>
            {section.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-jpblue text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-slate-800/80 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
