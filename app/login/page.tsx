'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Home, Lock, Mail, User, Sparkles, ArrowRight } from 'lucide-react';
import { DEMO_USER } from '@/lib/seedData';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, resetToDemo } = useApp();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    if (isRegister && !name.trim()) {
      setError('กรุณากรอกชื่อของคุณ');
      return;
    }

    // Create or login user
    const loggedUser = {
      id: `usr-${Date.now()}`,
      name: isRegister ? name.trim() : email.split('@')[0],
      email: email.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };

    setUser(loggedUser);
    router.push('/');
  };

  const handleGoogleLogin = () => {
    const googleUser = {
      id: 'usr-google-889',
      name: 'บัญชี Google (ทดสอบ)',
      email: 'user.google@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };
    setUser(googleUser);
    router.push('/');
  };

  const handleDemoLogin = () => {
    resetToDemo();
    setUser(DEMO_USER);
    router.push('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {/* Brand */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/20">
            <Home className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-black text-slate-900 dark:text-white">
            Home Maintenance & Asset Tracker
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            จัดการบ้าน รถ และทรัพย์สิน พร้อมการแจ้งเตือนรอบซ่อมและเอกสารในที่เดียว
          </p>
        </div>

        {/* Tab switch */}
        <div className="mt-6 flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
            className={`flex-1 rounded-lg py-2 transition-all ${
              !isRegister
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-500'
            }`}
          >
            เข้าสู่ระบบ (Sign In)
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
            className={`flex-1 rounded-lg py-2 transition-all ${
              isRegister
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-500'
            }`}
          >
            สมัครสมาชิกใหม่ (Register)
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:bg-rose-950/50">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="mt-5 space-y-3.5 text-xs">
          {isRegister && (
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                ชื่อ-นามสกุล *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น สมชาย มั่นคง"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              อีเมล *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="somchai@hometrack.th"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              รหัสผ่าน *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-all active:scale-95"
          >
            {isRegister ? 'สมัครสมาชิกและเข้าใช้งาน' : 'เข้าสู่ระบบด้วยอีเมล'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          <span className="text-[10px] font-semibold text-slate-400 uppercase">
            หรือเข้าสู่ระบบด้วย
          </span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Social / Demo Logins */}
        <div className="space-y-2">
          {/* Google Login button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>เข้าสู่ระบบด้วย Google (Google Login)</span>
          </button>

          {/* 1-Click Demo Login button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 text-xs font-bold text-white shadow-sm hover:from-amber-600 hover:to-orange-600 active:scale-95 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>เข้าสู่ระบบด้วยบัญชีตัวอย่าง (1-Click Demo Account)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
