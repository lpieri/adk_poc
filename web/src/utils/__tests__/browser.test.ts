import { afterEach, describe, expect, it, vi } from "vitest";
import { notify, requestNotificationPermission } from "../notifications";
import { readStorage, writeStorage } from "../storage";

const stubNotification = (permission: NotificationPermission) => {
  const constructor = vi.fn();
  const requestPermission = vi.fn(async () => "granted");
  vi.stubGlobal("Notification", Object.assign(constructor, { permission, requestPermission }));
  return { constructor, requestPermission };
};

describe("browser helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reads and writes local storage", () => {
    writeStorage("k", "v");
    expect(readStorage("k")).toBe("v");
    writeStorage("k", null);
    expect(readStorage("k")).toBeNull();
  });

  it("survives a broken storage", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("denied");
    });
    expect(readStorage("k")).toBeNull();
    expect(() => writeStorage("k", "v")).not.toThrow();
  });

  it("does nothing without the Notification API", async () => {
    await expect(requestNotificationPermission()).resolves.toBeUndefined();
    expect(() => notify("t", "b")).not.toThrow();
  });

  it("asks for permission only once undecided", async () => {
    const undecided = stubNotification("default");
    await requestNotificationPermission();
    expect(undecided.requestPermission).toHaveBeenCalled();
    notify("t", "b");
    expect(undecided.constructor).not.toHaveBeenCalled();
    const granted = stubNotification("granted");
    await requestNotificationPermission();
    expect(granted.requestPermission).not.toHaveBeenCalled();
    notify("Titre", "Corps");
    expect(granted.constructor).toHaveBeenCalledWith("Titre", { body: "Corps", icon: "/mascot/happy.webp" });
  });
});
