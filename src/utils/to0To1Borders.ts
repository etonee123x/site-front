export const to0To1Borders = (
  currentValue: number,
  [minValue = 0, maxValue = 1]: [number | undefined, number] = [0, 1],
) => Math.max(0, Math.min(1, (currentValue - minValue) / (maxValue - minValue)));
