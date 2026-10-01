"use client";

import { useTranslation } from "react-i18next";
import { TABS } from "../../utils/tabs";
import type { Tab } from "../../utils/tabs";

interface TabBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const TabBar: React.FC<TabBarProps> = (props) => {
  const { t } = useTranslation();
  const index = TABS.findIndex((tab) => tab.id === props.active);
  return (
    <nav
      aria-label={t("tabs.label")}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
    >
      <ul className="pointer-events-auto relative grid w-full max-w-sm grid-cols-3 rounded-full border border-black/6 bg-white/90 p-1 shadow-md backdrop-blur">
        <span
          aria-hidden="true"
          data-testid="tab-pill"
          className="absolute inset-y-1 left-1 rounded-full bg-sway-black transition-transform duration-500 ease-spring"
          style={{ width: `calc((100% - 0.5rem) / ${TABS.length})`, transform: `translateX(${index * 100}%)` }}
        />
        {TABS.map((tab) => {
          const active = tab.id === props.active;
          return (
            <li key={tab.id} className="relative z-10">
              <button
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => props.onChange(tab.id)}
                className={`group flex w-full items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-sm font-semibold transition-colors duration-300 ${active ? "text-white" : "text-muted hover:text-sway-black"}`}
              >
                <span
                  key={active ? "active" : "idle"}
                  aria-hidden="true"
                  className={`text-base leading-none transition-transform duration-500 ease-spring ${active ? "motion-safe:animate-pop" : "grayscale-[0.4] group-hover:scale-110"}`}
                >
                  {tab.emoji}
                </span>
                {t(`tabs.${tab.id}`)}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TabBar;
