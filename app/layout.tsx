import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "5등급제 내신대학찾기",
  description: "고등학생을 위한 5등급제 기반 대학·학과 추천 웹 서비스"
};

const navItems = [
  ["내신 입력", "/input"],
  ["추천 결과", "/results"]
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <header className="sticky top-0 z-40 border-b border-blue-100/80 bg-white/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <Link className="group flex items-center gap-3" href="/">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-glow transition group-hover:-translate-y-0.5">
                <GraduationCap aria-hidden className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-lg font-black tracking-tight text-ink">5등급제 내신대학찾기</span>
                <span className="block text-xs font-semibold text-slate-500">고교 내신 기반 추천</span>
              </span>
            </Link>
            <nav className="flex flex-wrap items-center gap-1 rounded-full border border-blue-100 bg-blue-50/60 p-1">
              {navItems.map(([label, href]) => (
                <Link
                  key={href}
                  className="rounded-full px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-blue-700 hover:shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100"
                  href={href}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-blue-100 bg-white px-5 py-8 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>5등급제 내신대학찾기 · 현재 내신 기반 대학·학과 추천 서비스</p>
            <p>고교 내신 기반 진학 탐색 도구</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
