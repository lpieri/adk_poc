"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import type { PlaceInput, PlaceKind } from "../../api/types";
import { parseCoordinate } from "../../utils/geo";
import { PLACE_KINDS } from "../../utils/options";
import { INPUT_CLASS } from "../../utils/styles";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Field from "../ui/Field";
import SegmentedControl from "../ui/SegmentedControl";
import PlaceLocationFields from "./PlaceLocationFields";

interface PlaceFormProps {
  onSubmit: (input: PlaceInput) => Promise<void>;
  onCancel: () => void;
}

const DEFAULT_RADIUS_M = "150";

const PlaceForm: React.FC<PlaceFormProps> = (props) => {
  const { t } = useTranslation();
  const [name, setName] = useState<string>("");
  const [kind, setKind] = useState<PlaceKind>("stable");
  const [radius, setRadius] = useState<string>(DEFAULT_RADIUS_M);
  const [coords, setCoords] = useState<{ lat: string; lng: string }>({ lat: "", lng: "" });
  const lat = parseCoordinate(coords.lat);
  const lng = parseCoordinate(coords.lng);
  const valid = name.trim() !== "" && lat !== null && lng !== null && Number(radius) > 0;
  const kindOptions = PLACE_KINDS.map((value) => ({ value, label: t(`places.kinds.${value}`) }));
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    void props.onSubmit({ name: name.trim(), kind, lat: lat as number, lng: lng as number, radius_m: Number(radius) });
  };
  return (
    <form onSubmit={handleSubmit}>
      <Card className="flex animate-sway-up flex-col gap-4">
        <Field label={t("places.name")}>
          <input required value={name} placeholder={t("places.namePlaceholder")} onChange={(event) => setName(event.target.value)} className={INPUT_CLASS} />
        </Field>
        <SegmentedControl label={t("places.kind")} options={kindOptions} value={kind} onChange={(value) => setKind(value as PlaceKind)} />
        <Field label={t("places.radius")}>
          <input type="number" inputMode="numeric" min={10} value={radius} onChange={(event) => setRadius(event.target.value)} className={INPUT_CLASS} />
        </Field>
        <PlaceLocationFields lat={coords.lat} lng={coords.lng} onChange={(nextLat, nextLng) => setCoords({ lat: nextLat, lng: nextLng })} />
        <div className="flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={props.onCancel}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" className="flex-1" disabled={!valid}>
            {t("common.save")}
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default PlaceForm;
