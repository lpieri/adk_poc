"use client";

import { useTranslation } from "react-i18next";
import Icon from "../ui/Icon";

interface ArrivalBannerProps {
  placeName: string;
  onClose: () => void;
}

const ArrivalBanner: React.FC<ArrivalBannerProps> = (props) => {
  const { t } = useTranslation();
  return (
    <div role="status" className="sticky top-3 z-40 mx-4 mt-1 flex animate-sway-up items-center gap-3 rounded-full bg-sway-black px-5 py-3 text-sm font-bold text-white shadow-md">
      <span className="flex-1">{t("wakeup.arrived", { name: props.placeName })}</span>
      <button type="button" aria-label={t("common.close")} onClick={props.onClose} className="rounded-full p-1 hover:bg-white/10">
        <Icon name="close" className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ArrivalBanner;
