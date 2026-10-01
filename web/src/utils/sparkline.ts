export interface SparklineBox {
  width: number;
  height: number;
  padding: number;
}

export const buildSparklinePoints = (values: number[], box: SparklineBox): string => {
  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  const innerWidth = box.width - box.padding * 2;
  const innerHeight = box.height - box.padding * 2;
  const step = values.length > 1 ? innerWidth / (values.length - 1) : 0;
  return values
    .map((value, index) => {
      const x = box.padding + index * step;
      const y = box.padding + innerHeight - ((value - min) / range) * innerHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
};
