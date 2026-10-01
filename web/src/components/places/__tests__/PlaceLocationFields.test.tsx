import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { clearGeolocation, makePosition, mockGeolocation } from "../../../test/geo";
import PlaceLocationFields from "../PlaceLocationFields";

describe("PlaceLocationFields", () => {
  afterEach(() => {
    clearGeolocation();
  });

  it("reports an error without geolocation support", async () => {
    render(<PlaceLocationFields lat="" lng="" onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Utiliser ma position actuelle" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Impossible de récupérer ta position.");
  });

  it("fills the coordinates from the current position", async () => {
    mockGeolocation({ getCurrentPosition: vi.fn((success: PositionCallback) => success(makePosition(48.1234567, 2.7654321))) });
    const handleChange = vi.fn();
    render(<PlaceLocationFields lat="" lng="" onChange={handleChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Utiliser ma position actuelle" }));
    expect(handleChange).toHaveBeenCalledWith("48.123457", "2.765432");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("shows progress, then the failure", async () => {
    let fail: () => void = () => undefined;
    mockGeolocation({
      getCurrentPosition: vi.fn((_success: PositionCallback, error?: PositionErrorCallback | null) => {
        fail = () => error?.({} as GeolocationPositionError);
      }),
    });
    render(<PlaceLocationFields lat="" lng="" onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Utiliser ma position actuelle" }));
    expect(screen.getByRole("button", { name: "Localisation…" })).toBeDisabled();
    act(() => fail());
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Utiliser ma position actuelle" })).toBeEnabled();
  });

  it("accepts manual coordinates", () => {
    const handleChange = vi.fn();
    render(<PlaceLocationFields lat="1" lng="2" onChange={handleChange} />);
    fireEvent.change(screen.getByLabelText("Latitude"), { target: { value: "45.5" } });
    expect(handleChange).toHaveBeenLastCalledWith("45.5", "2");
    fireEvent.change(screen.getByLabelText("Longitude"), { target: { value: "4.8" } });
    expect(handleChange).toHaveBeenLastCalledWith("1", "4.8");
  });
});
