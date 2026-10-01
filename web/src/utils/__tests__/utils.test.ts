import { afterEach, describe, expect, it, vi } from "vitest";
import i18n from "../../i18n";
import { cleanReply, currentSpeech } from "../chat";
import { formatDate, formatNumber, horseAge, sortByDateDesc, todayIso } from "../format";
import { hasGeolocation, parseCoordinate } from "../geo";
import { fromHorseDraft, isHorseDraftValid, toHorseDraft } from "../horseDraft";
import { careTiming, formatAge } from "../horseLabels";
import { createId } from "../ids";
import { canBlink, frameSrc, resolveFrame } from "../mascot";
import { buildSparklinePoints } from "../sparkline";
import { toArrival } from "../wakeup";
import { BARE_HORSE, HORSE, PLACE } from "../../test/fixtures";

const t = i18n.t.bind(i18n);

describe("utils", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("derives the current speech and cleans markdown", () => {
    expect(currentSpeech([]).key).toBe("");
    const speech = currentSpeech([
      { id: "a", author: "ale", text: "x", mood: null, toolCalls: [], animate: false },
      { id: "b", author: "user", text: "y", mood: null, toolCalls: [], animate: false },
    ]);
    expect(speech).toEqual({ key: "a", text: "x", mood: "idle", animate: false });
    expect(cleanReply("## Titre\n**Gras** et __souligné__\n- un\n* deux")).toBe("Titre\nGras et souligné\n• un\n• deux");
  });

  it("formats dates, numbers and ages", () => {
    expect(formatDate("2026-03-01")).toBe("1 mars 2026");
    expect(formatDate("2026-03-01T12:00:00")).toBe("1 mars 2026");
    expect(formatNumber(1.25)).toBe("1,3");
    expect(todayIso(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(horseAge(2015, new Date(2026, 5, 1))).toBe(11);
    expect(horseAge(null)).toBeNull();
    expect(sortByDateDesc([{ date: "2026-01-01" }, { date: "2026-02-01" }])[0].date).toBe("2026-02-01");
  });

  it("parses coordinates and detects geolocation", () => {
    expect(parseCoordinate(" 45,5 ")).toBe(45.5);
    expect(parseCoordinate("")).toBeNull();
    expect(parseCoordinate("abc")).toBeNull();
    expect(hasGeolocation()).toBe(false);
  });

  it("converts horse drafts", () => {
    const empty = toHorseDraft();
    expect(isHorseDraftValid(empty)).toBe(false);
    expect(toHorseDraft(BARE_HORSE)).toMatchObject({ birthYear: "", bodyCondition: 5 });
    const draft = toHorseDraft(HORSE);
    expect(isHorseDraftValid(draft)).toBe(true);
    expect(fromHorseDraft(draft)).toMatchObject({ name: "Tornade", birth_year: 2015, weight_kg: 550 });
    expect(fromHorseDraft({ ...draft, birthYear: "" }).birth_year).toBeNull();
  });

  it("labels ages and care timings", () => {
    expect(formatAge(t, null)).toBe("Âge inconnu");
    expect(formatAge(t, new Date().getFullYear() - 1)).toBe("1 an");
    const item = { kind: "vet" as const, label: "", due_date: null, status: "ok" as const };
    expect(careTiming(t, { ...item, days_left: null })).toBe("Aucune date connue");
    expect(careTiming(t, { ...item, days_left: -3 })).toBe("En retard de 3 jours");
    expect(careTiming(t, { ...item, days_left: 0 })).toBe("Aujourd'hui");
    expect(careTiming(t, { ...item, days_left: 1 })).toBe("Dans 1 jour");
  });

  it("creates ids with or without crypto.randomUUID", () => {
    expect(createId()).toMatch(/[0-9a-f-]{36}/);
    vi.stubGlobal("crypto", {});
    expect(createId()).toMatch(/^id-/);
    expect(createId()).not.toBe(createId());
  });

  it("resolves mascot frames", () => {
    expect(frameSrc("blink")).toBe("/mascot/blink.webp");
    expect(canBlink("worried")).toBe(false);
    const base = { mood: "worried" as const, pending: false, mouthOpen: false, blinking: false };
    expect(resolveFrame({ ...base, pending: true })).toBe("thinking");
    expect(resolveFrame({ ...base, mouthOpen: true })).toBe("worried_talk");
    expect(resolveFrame({ ...base, mood: "surprised", mouthOpen: true })).toBe("idle_talk");
    expect(resolveFrame({ ...base, blinking: true })).toBe("worried");
    expect(resolveFrame({ ...base, mood: "idle", blinking: true })).toBe("blink");
    expect(resolveFrame({ ...base, mood: "happy", blinking: true })).toBe("happy");
    expect(resolveFrame(base)).toBe("worried");
  });

  it("builds sparkline points", () => {
    const box = { width: 100, height: 20, padding: 0 };
    expect(buildSparklinePoints([5, 5], box)).toBe("0.0,20.0 100.0,20.0");
    expect(buildSparklinePoints([1], box)).toBe("0.0,20.0");
  });

  it("turns wakeup responses into arrivals", () => {
    const response = { triggered: true, place: PLACE, session_id: "s", reply: "r", mood: null };
    expect(toArrival(response)).toEqual({ sessionId: "s", reply: "r", mood: "happy", placeName: PLACE.name });
    expect(toArrival({ ...response, place: null, mood: "worried" })).toMatchObject({ placeName: "", mood: "worried" });
    expect(toArrival({ ...response, triggered: false })).toBeNull();
    expect(toArrival({ ...response, session_id: null })).toBeNull();
    expect(toArrival({ ...response, reply: null })).toBeNull();
  });
});
