import { describe, it, expect } from "vitest";
import {
  getNearestLevel,
  getLevelByExactValue,
  getRangeOf,
  COURAGE_THRESHOLD,
  MIN_LEVEL,
  MAX_LEVEL,
} from "@/lib/hawkinsMap";

describe("hawkinsMap", () => {
  it("getNearestLevel(200) = Coraje", () => {
    expect(getNearestLevel(200).name).toBe("Coraje");
  });
  it("getNearestLevel(20) = Vergüenza", () => {
    expect(getNearestLevel(20).name).toBe("Vergüenza");
  });
  it("getLevelByExactValue(150) = Ira", () => {
    expect(getLevelByExactValue(150)?.name).toBe("Ira");
  });
  it("getLevelByExactValue unknown = undefined", () => {
    expect(getLevelByExactValue(999)).toBeUndefined();
  });
  it("getRangeOf", () => {
    expect(getRangeOf(100)).toBe("liberar");
    expect(getRangeOf(250)).toBe("construir");
    expect(getRangeOf(400)).toBe("expandir");
  });
  it("constants", () => {
    expect(COURAGE_THRESHOLD).toBe(200);
    expect(MIN_LEVEL).toBe(20);
    expect(MAX_LEVEL).toBe(600);
  });
});