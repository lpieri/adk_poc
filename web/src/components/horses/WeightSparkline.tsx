"use client";

import { useTranslation } from "react-i18next";
import type { WeightEntry } from "../../api/types";
import { sortByDateDesc } from "../../utils/format";
import { buildSparklinePoints } from "../../utils/sparkline";

interface WeightSparklineProps {
  weights: WeightEntry[];
}

const SPARKLINE_BOX = { width: 300, height: 72, padding: 8 };
const MIN_POINTS = 2;

const WeightSparkline: React.FC<WeightSparklineProps> = (props) => {
  const { t } = useTranslation();
  if (props.weights.length < MIN_POINTS) {
    return null;
  }
  const values = sortByDateDesc(props.weights)
    .reverse()
    .map((entry) => entry.weight_kg);
  const points = buildSparklinePoints(values, SPARKLINE_BOX);
  const lastPoint = points.split(" ").pop()!.split(",");
  return (
    <svg
      role="img"
      aria-label={t("weight.chart")}
      viewBox={`0 0 ${SPARKLINE_BOX.width} ${SPARKLINE_BOX.height}`}
      className="h-20 w-full rounded-xl bg-greige"
    >
      <polyline points={points} fill="none" stroke="var(--color-orange)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastPoint[0]} cy={lastPoint[1]} r={5} fill="var(--color-orange)" stroke="white" strokeWidth={2} />
    </svg>
  );
};

export default WeightSparkline;
