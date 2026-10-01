"use client";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import type { WakeupResponse } from "../../api/types";
import { useChat } from "../../hooks/useChat";
import { useGeoWakeup } from "../../hooks/useGeoWakeup";
import { usePersistentToggle } from "../../hooks/usePersistentToggle";
import { useUserId } from "../../hooks/useUserId";
import { notify, requestNotificationPermission } from "../../utils/notifications";
import type { Tab } from "../../utils/tabs";
import { toArrival } from "../../utils/wakeup";
import ChatScreen from "../chat/ChatScreen";
import HorsesScreen from "../horses/HorsesScreen";
import ArrivalBanner from "../layout/ArrivalBanner";
import BrandHeader from "../layout/BrandHeader";
import TabBar from "../layout/TabBar";
import PlacesScreen from "../places/PlacesScreen";

interface AppProps {
  initialTab?: Tab;
}

const GEO_WAKEUP_KEY = "ale.geoWakeup";

const App: React.FC<AppProps> = (props) => {
  const { t } = useTranslation();
  const userId = useUserId();
  const chat = useChat(userId);
  const { receive } = chat;
  const [tab, setTab] = useState<Tab>(props.initialTab ?? "chat");
  const [arrivalPlace, setArrivalPlace] = useState<string | null>(null);
  const [geoEnabled, setGeoEnabled] = usePersistentToggle(GEO_WAKEUP_KEY);
  const handleWakeup = useCallback(
    (response: WakeupResponse) => {
      const arrival = toArrival(response);
      if (!arrival) {
        return;
      }
      setTab("chat");
      receive(arrival.sessionId, arrival.reply, arrival.mood);
      setArrivalPlace(arrival.placeName);
      notify(t("wakeup.notificationTitle", { name: arrival.placeName }), arrival.reply);
    },
    [receive, t],
  );
  const { simulate } = useGeoWakeup({ userId, sessionId: chat.sessionId, enabled: geoEnabled, onWakeup: handleWakeup });
  const handleToggleGeo = (enabled: boolean): void => {
    setGeoEnabled(enabled);
    if (enabled) {
      void requestNotificationPermission();
    }
  };
  return (
    <div className="sway-grain mx-auto flex min-h-dvh w-full max-w-lg flex-col pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
      <BrandHeader />
      {arrivalPlace !== null && <ArrivalBanner placeName={arrivalPlace} onClose={() => setArrivalPlace(null)} />}
      <main className="flex flex-1 flex-col">
        <ChatScreen chat={chat} active={tab === "chat"} />
        <HorsesScreen userId={userId} active={tab === "horses"} />
        <PlacesScreen
          userId={userId}
          active={tab === "places"}
          geoEnabled={geoEnabled}
          onToggleGeo={handleToggleGeo}
          onSimulate={simulate}
        />
      </main>
      <TabBar active={tab} onChange={setTab} />
    </div>
  );
};

export default App;
