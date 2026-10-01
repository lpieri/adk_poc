import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ToolBadges from "../ToolBadges";

describe("ToolBadges", () => {
  it("shows one human label per tool and falls back to the raw name", () => {
    render(
      <ToolBadges
        toolCalls={[
          { name: "calculate_ration", args: {} },
          { name: "calculate_ration", args: { weight: 500 } },
          { name: "mystery_tool", args: {} },
        ]}
      />,
    );
    expect(screen.getByRole("list", { name: "Outils utilisés" }).children).toHaveLength(2);
    expect(screen.getByText("Ration calculée")).toBeInTheDocument();
    expect(screen.getByText("mystery_tool")).toBeInTheDocument();
  });
});
