import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CircularProgress } from "@/components/ui/circular-progress";

afterEach(cleanup);

describe("CircularProgress", () => {
  it("renders the rounded percentage label", () => {
    const { container } = render(<CircularProgress value={42.4} />);
    expect(container.querySelector("span")?.textContent).toBe("42%");
  });

  it("clamps values below 0", () => {
    const { container } = render(<CircularProgress value={-25} />);
    expect(container.querySelector("progress")?.getAttribute("value")).toBe(
      "0"
    );
  });

  it("clamps values above 100", () => {
    const { container } = render(<CircularProgress value={150} />);
    expect(container.querySelector("progress")?.getAttribute("value")).toBe(
      "100"
    );
  });

  it("hides the text label when hideText is set", () => {
    const { container } = render(<CircularProgress hideText value={80} />);
    expect(container.querySelector("span")).toBeNull();
  });
});
