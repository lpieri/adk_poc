import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { WakeupResponse } from "../../../api/types";
import { PLACE, jsonResponse } from "../../../test/fixtures";
import App from "../App";

const TRIGGERED: WakeupResponse = {
  triggered: true,
  place: PLACE,
  session_id: "s1",
  reply: "Bienvenue à l'écurie !",
  mood: "happy",
};

const stubApi = (wakeup: WakeupResponse): void => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.startsWith("/api/places")) {
        return jsonResponse([PLACE]);
      }
      if (url === "/api/wakeup") {
        return jsonResponse(wakeup);
      }
      return jsonResponse([]);
    }),
  );
};

const TYPEWRITER_WAIT = { timeout: 4000 };

describe("App", () => {
  beforeEach(() => {
    stubApi(TRIGGERED);
  });

  it("starts on the chat and navigates between tabs", async () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Salut, moi c'est Ale" })).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Chevaux" }));
    expect(screen.getByRole("heading", { name: "Mes chevaux" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Chevaux" })).toHaveAttribute("aria-current", "page");
  });

  it("wakes Ale up when arriving at a place", async () => {
    render(<App initialTab="places" />);
    await userEvent.click(await screen.findByRole("button", { name: "Simuler mon arrivée" }));
    expect(await screen.findByText("📍 Tu es arrivée à Écurie des Saules")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ale" })).toHaveAttribute("aria-current", "page");
    expect(await screen.findByText("Bienvenue à l'écurie !", undefined, TYPEWRITER_WAIT)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Fermer" }));
    expect(screen.queryByText(/Tu es arrivée/)).toBeNull();
  });

  it("ignores wakeups that did not trigger", async () => {
    stubApi({ triggered: false, place: null, session_id: null, reply: null, mood: null });
    render(<App initialTab="places" />);
    await userEvent.click(await screen.findByRole("button", { name: "Simuler mon arrivée" }));
    expect(screen.getByRole("button", { name: "Lieux" })).toHaveAttribute("aria-current", "page");
    expect(screen.queryByText(/Tu es arrivée/)).toBeNull();
  });

  it("persists the location wakeup toggle", async () => {
    render(<App initialTab="places" />);
    const toggle = screen.getByRole("switch");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(window.localStorage.getItem("ale.geoWakeup")).toBe("1");
    await userEvent.click(toggle);
    expect(window.localStorage.getItem("ale.geoWakeup")).toBeNull();
  });
});
