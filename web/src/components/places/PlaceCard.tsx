"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Place } from "../../api/types";
import { COORDINATE_DISPLAY_DIGITS } from "../../utils/geo";
import { DISPLAY_TITLE_CLASS } from "../../utils/styles";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Pill from "../ui/Pill";

interface PlaceCardProps {
  place: Place;
  onSimulate: (placeId: string) => Promise<void>;
  onDelete: (place: Place) => void;
}

const PlaceCard: React.FC<PlaceCardProps> = (props) => {
  const { t } = useTranslation();
  const { place } = props;
  const [simulating, setSimulating] = useState<boolean>(false);
  const handleSimulate = async (): Promise<void> => {
    setSimulating(true);
    await props.onSimulate(place.id);
    setSimulating(false);
  };
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-hairline bg-neutral p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-soft text-link">
          <Icon name="pin" />
        </span>
        <div className="min-w-0 flex-1">
          <p className={`${DISPLAY_TITLE_CLASS} truncate text-lg`}>{place.name}</p>
          <p className="text-xs text-muted">
            {place.lat.toFixed(COORDINATE_DISPLAY_DIGITS)}, {place.lng.toFixed(COORDINATE_DISPLAY_DIGITS)} · {t("places.radiusValue", { value: place.radius_m })}
          </p>
        </div>
        <Pill tone="blue">{t(`places.kinds.${place.kind}`)}</Pill>
      </div>
      <div className="flex gap-2">
        <Button size="sm" className="flex-1" disabled={simulating} onClick={handleSimulate}>
          <Icon name="target" className="h-4 w-4" />
          {t("places.simulate")}
        </Button>
        <Button variant="ghost" size="sm" ariaLabel={`${t("common.delete")} ${place.name}`} onClick={() => props.onDelete(place)}>
          <Icon name="trash" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlaceCard;
