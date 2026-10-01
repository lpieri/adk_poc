"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Place, PlaceInput } from "../../api/types";
import { usePlaces } from "../../hooks/usePlaces";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Notice from "../ui/Notice";
import SectionHeader from "../ui/SectionHeader";
import PlaceCard from "./PlaceCard";
import PlaceForm from "./PlaceForm";
import WakeupToggle from "./WakeupToggle";

interface PlacesScreenProps {
  userId: string;
  active: boolean;
  geoEnabled: boolean;
  onToggleGeo: (enabled: boolean) => void;
  onSimulate: (placeId: string) => Promise<boolean>;
}

const PlacesScreen: React.FC<PlacesScreenProps> = (props) => {
  const { t } = useTranslation();
  const places = usePlaces(props.userId);
  const [adding, setAdding] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);
  const handleCreate = async (input: PlaceInput): Promise<void> => {
    const ok = await places.create(input);
    setFailed(!ok);
    setAdding(!ok);
  };
  const handleDelete = async (place: Place): Promise<void> => {
    if (window.confirm(t("places.deleteConfirm", { name: place.name }))) {
      setFailed(!(await places.remove(place.id)));
    }
  };
  const handleSimulate = async (placeId: string): Promise<void> => {
    setFailed(!(await props.onSimulate(placeId)));
  };
  const addButton = (
    <Button size="sm" className="shrink-0" onClick={() => setAdding(true)}>
      <Icon name="plus" className="h-4 w-4" />
      {t("places.add")}
    </Button>
  );
  return (
    <section className={`flex flex-col gap-5 px-4 pt-4 ${props.active ? "" : "hidden"}`}>
      <SectionHeader large title={t("places.title")} subtitle={t("places.subtitle")} action={adding ? null : addButton} />
      <WakeupToggle enabled={props.geoEnabled} onToggle={props.onToggleGeo} />
      {failed && <Notice tone="danger">{t("common.actionError")}</Notice>}
      {adding && <PlaceForm onSubmit={handleCreate} onCancel={() => setAdding(false)} />}
      {places.error && <Notice tone="danger">{t("common.error")}</Notice>}
      {!places.error && places.places.length === 0 && <Notice>{t(places.loading ? "common.loading" : "places.empty")}</Notice>}
      <ul className="flex flex-col gap-4">
        {places.places.map((place) => (
          <li key={place.id}>
            <PlaceCard place={place} onSimulate={handleSimulate} onDelete={handleDelete} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PlacesScreen;
