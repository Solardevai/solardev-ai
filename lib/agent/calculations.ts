import { calculated } from "@/lib/agent/types";

const round = (value: number, digits = 3) => Number(value.toFixed(digits));

export function calculateDcAcRatio(dcMw: number, acMw: number) {
  if (dcMw <= 0 || acMw <= 0) throw new RangeError("DC and AC capacity must be greater than zero.");
  return calculated("DC capacity / AC capacity", { dcMw, acMw }, { ratio: round(dcMw / acMw), dcMw, acMw });
}

export function estimateLandCapacity(areaHa: number, dcDensityMwpPerUsableHa = 0.65, usableFraction = 0.8) {
  if (areaHa <= 0) throw new RangeError("Area must be greater than zero.");
  if (dcDensityMwpPerUsableHa <= 0 || usableFraction <= 0 || usableFraction > 1) throw new RangeError("Density and usable fraction are outside valid ranges.");
  const usableAreaHa = areaHa * usableFraction;
  return calculated("Gross site area × assumed usable fraction × indicative DC density per usable hectare", { areaHa, dcDensityMwpPerUsableHa, usableFraction }, { assumedUsableAreaHa: round(usableAreaHa, 2), estimatedDcMwp: round(usableAreaHa * dcDensityMwpPerUsableHa, 2) }, ["Usable fraction and DC density per usable hectare are early-stage planning assumptions, not verified developable area or a layout result."], ["Confirm setbacks, slope, access, drainage, environmental constraints and equipment geometry with GIS and layout studies."]);
}

export function sizePvString(input: { moduleVocV: number; moduleVmpV: number; vocTempCoeffPctPerC: number; vmpTempCoeffPctPerC?: number; minimumCellTempC: number; maximumCellTempC?: number; inverterMaxDcVoltageV: number; inverterMpptMinV: number; inverterMpptMaxV: number; designMargin?: number }) {
  const maximumCellTempC = input.maximumCellTempC ?? 70;
  const vmpTempCoeffPctPerC = input.vmpTempCoeffPctPerC ?? input.vocTempCoeffPctPerC;
  const designMargin = input.designMargin ?? 0.98;
  const positiveRatings = [input.moduleVocV, input.moduleVmpV, input.inverterMaxDcVoltageV, input.inverterMpptMinV, input.inverterMpptMaxV];
  if (positiveRatings.some((value) => value <= 0)) throw new RangeError("Electrical ratings must be greater than zero.");
  if (designMargin <= 0 || designMargin > 1) throw new RangeError("Design margin must be in (0, 1].");
  const coldVoc = input.moduleVocV * (1 + (input.vocTempCoeffPctPerC / 100) * (input.minimumCellTempC - 25));
  const coldVmp = input.moduleVmpV * (1 + (vmpTempCoeffPctPerC / 100) * (input.minimumCellTempC - 25));
  const hotVmp = input.moduleVmpV * (1 + (vmpTempCoeffPctPerC / 100) * (maximumCellTempC - 25));
  const maximumModules = Math.min(Math.floor((input.inverterMaxDcVoltageV * designMargin) / coldVoc), Math.floor(input.inverterMpptMaxV / coldVmp));
  const minimumModules = Math.ceil(input.inverterMpptMinV / hotVmp);
  return calculated("Temperature-corrected module voltage envelope against inverter absolute and MPPT limits", { ...input, maximumCellTempC, vmpTempCoeffPctPerC, designMargin }, { minimumModules, maximumModules, coldVocPerModuleV: round(coldVoc, 2), hotVmpPerModuleV: round(hotVmp, 2) }, ["Temperature coefficients are signed %/°C values; typically negative.", "Cell temperatures must be project-specific."], minimumModules > maximumModules ? ["No feasible string length exists for the supplied voltage window."] : ["Skeleton sizing only: verify current, Isc margin, MPPT current, parallel strings, bifacial gain, tolerances, degradation and applicable code."]);
}

export function estimateBess(powerMw: number, usableEnergyMwh: number, usableMwhPerContainer = 5, reserveFraction = 0.1) {
  if (powerMw <= 0 || usableEnergyMwh <= 0 || usableMwhPerContainer <= 0) throw new RangeError("BESS ratings must be greater than zero.");
  if (reserveFraction < 0 || reserveFraction >= 1) throw new RangeError("Reserve fraction must be in [0, 1).");
  const requiredInstalledEnergyMwh = usableEnergyMwh / (1 - reserveFraction);
  return calculated("Usable energy / power; container count based on required installed energy including reserve", { powerMw, usableEnergyMwh, usableMwhPerContainer, reserveFraction }, { durationHours: round(usableEnergyMwh / powerMw, 2), requiredInstalledEnergyMwh: round(requiredInstalledEnergyMwh, 2), estimatedContainers: Math.ceil(requiredInstalledEnergyMwh / usableMwhPerContainer) }, ["Requested energy and per-container rating are treated as usable AC-equivalent energy for screening."], ["Confirm augmentation, degradation, parasitics, availability, topology, fire spacing and vendor guarantees."]);
}

function netPresentValue(rate: number, cashFlows: number[]) { return cashFlows.reduce((sum, flow, year) => sum + flow / (1 + rate) ** year, 0); }

function internalRateOfReturn(cashFlows: number[]) {
  let low = -0.99; let high = 10; let lowValue = netPresentValue(low, cashFlows);
  if (lowValue * netPresentValue(high, cashFlows) > 0) return null;
  for (let index = 0; index < 200; index += 1) {
    const middle = (low + high) / 2; const middleValue = netPresentValue(middle, cashFlows);
    if (Math.abs(middleValue) < 1e-7) return middle;
    if (lowValue * middleValue <= 0) high = middle; else { low = middle; lowValue = middleValue; }
  }
  return (low + high) / 2;
}

export function calculateFinancialMetrics(input: { currency: string; capex: number; annualRevenue: number; annualOpex: number; projectYears: number; discountRate: number; annualEnergyMwh?: number }) {
  const { currency, capex, annualRevenue, annualOpex, projectYears, discountRate, annualEnergyMwh } = input;
  if (!currency.trim() || capex <= 0 || annualRevenue < 0 || annualOpex < 0 || projectYears < 1 || !Number.isInteger(projectYears) || discountRate <= -1) throw new RangeError("Financial inputs are outside valid ranges.");
  const annualNetCash = annualRevenue - annualOpex;
  const cashFlows = [-capex, ...Array.from({ length: projectYears }, () => annualNetCash)];
  const irr = internalRateOfReturn(cashFlows);
  const discountedEnergy = annualEnergyMwh ? Array.from({ length: projectYears }, (_, index) => annualEnergyMwh / (1 + discountRate) ** (index + 1)).reduce((a, b) => a + b, 0) : null;
  const discountedOpex = Array.from({ length: projectYears }, (_, index) => annualOpex / (1 + discountRate) ** (index + 1)).reduce((a, b) => a + b, 0);
  return calculated("Unlevered constant-annual cash flow screening model", input, { currency: currency.trim().toUpperCase(), annualNetCash: round(annualNetCash, 2), npv: round(netPresentValue(discountRate, cashFlows), 2), irrPct: irr === null ? null : round(irr * 100, 2), simplePaybackYears: annualNetCash > 0 ? round(capex / annualNetCash, 2) : null, lcoePerMwh: discountedEnergy ? round((capex + discountedOpex) / discountedEnergy, 2) : null }, ["CAPEX, revenue and OPEX use the stated currency.", "Revenue, OPEX and energy are constant; taxes, financing, degradation, inflation, curtailment and residual value are excluded.", "The model does not establish whether inputs are real or nominal; that basis must be stated with the result."], ["Screening model only; use a full project-finance model for investment decisions."]);
}
