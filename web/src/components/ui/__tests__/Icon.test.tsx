import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Icon from "../Icon";

describe("Icon", () => {
  it("renders a decorative svg with the default size", () => {
    const { container } = render(<Icon name="chat" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("class", "h-5 w-5");
  });

  it("accepts a custom class", () => {
    const { container } = render(<Icon name="send" className="h-4 w-4" />);
    expect(container.querySelector("svg")).toHaveAttribute("class", "h-4 w-4");
  });
});
