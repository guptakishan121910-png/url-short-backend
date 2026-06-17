import { describe, expect, it } from "vitest";

import { getDeviceFamily } from "./analytics.js";

describe("getDeviceFamily", () => {
  it("detects common user-agent families", () => {
    expect(getDeviceFamily("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile")).toBe("Mobile");
    expect(getDeviceFamily("Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)")).toBe("Tablet");
    expect(getDeviceFamily("Googlebot/2.1")).toBe("Bot");
    expect(getDeviceFamily("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe("Desktop");
  });
});
