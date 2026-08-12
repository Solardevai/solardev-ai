import { describe, expect, it } from "vitest";
import { calculateDcAcRatio, calculateFinancialMetrics, estimateBess, estimateLandCapacity, sizePvString } from "@/lib/agent/calculations";

describe("SolarDev deterministic engineering tools", () => {
  it("calculates DC/AC ratio", () => {
    expect(calculateDcAcRatio(130, 100).result.ratio).toBe(1.3);
  });

  it("estimates land capacity with explicit planning assumptions", () => {
    const output = estimateLandCapacity(100, 0.65, 0.8);
    expect(output.result).toEqual({ usableAreaHa: 80, estimatedDcMwp: 52 });
    expect(output.label).toBe("CALCULATED RESULT");
  });

  it("sizes a preliminary PV string voltage envelope", () => {
    const output = sizePvString({ moduleVocV: 50, moduleVmpV: 42, vocTempCoeffPctPerC: -0.25, minimumCellTempC: -10, inverterMaxDcVoltageV: 1500, inverterMpptMinV: 850, inverterMpptMaxV: 1300 });
    expect(output.result.minimumModules).toBeGreaterThan(0);
    expect(output.result.maximumModules).toBeGreaterThanOrEqual(output.result.minimumModules);
  });

  it("estimates BESS duration, reserve energy and containers", () => {
    const output = estimateBess(50, 200, 5, 0.1);
    expect(output.result.durationHours).toBe(4);
    expect(output.result.estimatedContainers).toBe(45);
  });

  it("calculates screening financial metrics", () => {
    const output = calculateFinancialMetrics({ capex: 1_000_000, annualRevenue: 180_000, annualOpex: 30_000, projectYears: 20, discountRate: 0.08, annualEnergyMwh: 10_000 });
    expect(output.result.annualNetCash).toBe(150_000);
    expect(output.result.npv).toBeGreaterThan(0);
    expect(output.result.lcoePerMwh).toBeGreaterThan(0);
  });

  it("rejects invalid inputs instead of inventing a result", () => {
    expect(() => calculateDcAcRatio(10, 0)).toThrow(RangeError);
    expect(() => estimateLandCapacity(50, 0.6, 1.2)).toThrow(RangeError);
  });
});
