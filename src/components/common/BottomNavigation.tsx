import { MessageCircle, Users, type LucideIcon } from "lucide-react";
import { NavLink } from "react-router";

import { cn } from "@/lib/utils";

const tabs: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/home", label: "채팅", icon: MessageCircle },
  { to: "/explore", label: "철학자 탐색", icon: Users },
];

export default function BottomNavigation() {
  return (
    <nav className="sticky bottom-0 z-10 flex h-16 border-t border-border-normal bg-background-base">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center justify-center gap-1",
              isActive ? "text-caption-12-semibold text-text-primary" : "text-caption-12-regular text-icon-tertiary",
            )
          }
        >
          <Icon className="size-6" aria-hidden />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
