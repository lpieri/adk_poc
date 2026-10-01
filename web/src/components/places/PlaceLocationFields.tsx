"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { COORDINATE_DIGITS, hasGeolocation } from "../../utils/geo";
import { INPUT_CLASS } from "../../utils/styles";
import Button from "../ui/Button";
import Field from "../ui/Field";
import Icon from "../ui/Icon";
import Notice from "../ui/Notice";

interface PlaceLocationFieldsProps {
  lat: string;
  lng: string;
  onChange: (lat: string, lng: string) => void;
}

const LOCATE_TIMEOUT_MS = 15000;

const PlaceLocationFields: React.FC<PlaceLocationFieldsProps> = (props) => {
  const { t } = useTranslation();
  const [locating, setLocating] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);
  const handleFailure = (): void => {
    setLocating(false);
    setFailed(true);
  };
  const handleLocate = (): void => {
    if (!hasGeolocation()) {
      handleFailure();
      return;
    }
    setLocating(true);
    setFailed(false);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        props.onChange(position.coords.latitude.toFixed(COORDINATE_DIGITS), position.coords.longitude.toFixed(COORDINATE_DIGITS));
      },
      handleFailure,
      { enableHighAccuracy: true, timeout: LOCATE_TIMEOUT_MS },
    );
  };
  return (
    <>
      <Button variant="secondary" disabled={locating} onClick={handleLocate}>
        <Icon name="target" className="h-4 w-4" />
        {t(locating ? "places.locating" : "places.useLocation")}
      </Button>
      {failed && <Notice tone="danger">{t("places.locationError")}</Notice>}
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("places.lat")}>
          <input inputMode="decimal" value={props.lat} onChange={(event) => props.onChange(event.target.value, props.lng)} className={INPUT_CLASS} />
        </Field>
        <Field label={t("places.lng")}>
          <input inputMode="decimal" value={props.lng} onChange={(event) => props.onChange(props.lat, event.target.value)} className={INPUT_CLASS} />
        </Field>
      </div>
    </>
  );
};

export default PlaceLocationFields;
