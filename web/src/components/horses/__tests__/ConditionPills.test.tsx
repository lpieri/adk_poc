import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { labelFor } from "../../../test/fixtures";
import ConditionPills from "../ConditionPills";

describe("ConditionPills", () => {
  it("renders nothing without conditions", () => {
    const { container } = render(<ConditionPills codes={[]} labelFor={labelFor} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders one pill per condition", () => {
    render(<ConditionPills codes={["pssm1", "ems"]} labelFor={labelFor} />);
    expect(screen.getByText("label:pssm1")).toBeInTheDocument();
    expect(screen.getByText("label:ems")).toBeInTheDocument();
  });
});
