import { LayoutGrid, MessageSquareMore, type LucideIcon } from "lucide-react";
import { NavLink } from "react-router";

import { cn } from "@/lib/utils";

const tabs: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/home", label: "채팅", icon: MessageSquareMore },
  { to: "/explore", label: "철학자 탐색", icon: LayoutGrid },
];

// 시안 84px에는 아이폰 홈 인디케이터(아래 작대기) 자리가 포함돼 있어 탭 묶음 아래가 비어 있다
export default function BottomNavigation() {
  return (
    <nav className="sticky bottom-0 z-10 flex h-21 shrink-0 justify-center bg-background-base pt-2.5">
      <div className="flex h-10 w-58.75 justify-between">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.75",
                isActive ? "text-caption-11-bold text-text-primary" : "text-caption-11-medium text-text-tertiary",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn("size-6", isActive ? "text-accent-primary" : "text-icon-tertiary")} aria-hidden />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
