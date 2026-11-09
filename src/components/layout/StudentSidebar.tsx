'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  CheckCircle2,
  Settings,
  LogOut,
  GraduationCap,
  Bell,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface StudentSidebarProps {
  certificatesEnabled?: boolean;
}

export function StudentSidebar({ certificatesEnabled = false }: StudentSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Courses', href: '/student/courses', icon: BookOpen },
    { name: 'Assessments', href: '/student/assessments', icon: CheckCircle2 },
    ...(certificatesEnabled
      ? [{ name: 'Certificates', href: '/student/certificates', icon: Award }]
      : []),
    { name: 'Notifications', href: '/student/notifications', icon: Bell },
    { name: 'Account Settings', href: '/student/account', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E1EBF5] min-h-screen flex flex-col">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#E1EBF5]">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-hero-gradient flex items-center justify-center shadow-md">
            <GraduationCap className="h-5 w-5 text-jpcyan" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-jpdark leading-none">
              JP SMART
            </div>
            <div className="text-[10px] font-bold text-jpblue uppercase tracking-wider mt-0.5">
              Student Portal
            </div>
          </div>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-jpblue text-white shadow-sm'
                  : 'text-jpdark/80 hover:bg-jplight hover:text-jpblue'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-jpmuted'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Sign Out */}
      <div className="p-4 border-t border-[#E1EBF5] space-y-1">
        <Link
          href="/admin/dashboard"
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-jpblue bg-jpblue-50 hover:bg-jpblue hover:text-white transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>Switch to Admin Console</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4 text-red-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
