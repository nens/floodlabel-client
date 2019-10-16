import { scaleQuantile } from "d3"; // or quantize?

const DEBUG = false;

export default function calculateFloodlabel(score: number, from: number, to: number) {
  const scale = scaleQuantile<string>()
    .domain([from, to])
    .range(["a", "b", "c", "d", "e"]);

  const label = scale(score);
  if (DEBUG) {
    console.log('--------- calculateFloodlabel() ---------');
    console.log('[dbg] score:', score);
    console.log("[dbg] scale.domain:", scale.domain());
    console.log("[dbg] scale.range:", scale.range());
    console.log('[dbg] label:', label);
  }
  return label;
}
