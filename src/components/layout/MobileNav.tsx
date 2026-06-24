"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/quick-write", label: "写材料", icon: "✍" },
  { href: "/run-activity", label: "办活动", icon: "🎉" },
  { href: "/templates", label: "材料包", icon: "📐" },
  { href: "/contact", label: "试用", icon: "🤝" },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="mobile-nav">
      <div className="flex items-center justify-around w-full py-1.5">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={"flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors " + (isActive ? "text-[#1a56db]" : "text-[#94a3b8]")}>
              <span className="text-lg">{item.icon}</span>
              <span className="text-[0.65rem] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
