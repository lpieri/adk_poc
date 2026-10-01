const isSupported = (): boolean => {
  return typeof window !== "undefined" && "Notification" in window;
};

export const requestNotificationPermission = async (): Promise<void> => {
  if (isSupported() && Notification.permission === "default") {
    await Notification.requestPermission();
  }
};

export const notify = (title: string, body: string): void => {
  if (isSupported() && Notification.permission === "granted") {
    new Notification(title, { body, icon: "/mascot/happy.webp" });
  }
};
