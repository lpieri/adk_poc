"use client";

import { useTranslation } from "react-i18next";
import { DISPLAY_TITLE_CLASS } from "../../utils/styles";

interface BrandHeaderProps {
  className?: string;
}

const BrandHeader: React.FC<BrandHeaderProps> = (props) => {
  const { t } = useTranslation();
  return (
    <header className={`flex items-center gap-3.5 px-5 pb-1 pt-5 ${props.className ?? ""}`}>
      <img src="/brand/sway_logo_min.svg" alt={t("brand.logoAlt")} width={18} height={20} className="size-6 shrink-0" />
      <div className="flex min-w-0 flex-col">
        <span className={`${DISPLAY_TITLE_CLASS} text-lg leading-tight`}>
          <span className="text-orange">{t("app.name")}</span>
        </span>
        <span className="mt-px truncate text-xs text-muted">{t("brand.subtitle")}</span>
      </div>
    </header>
  );
};

export default BrandHeader;
