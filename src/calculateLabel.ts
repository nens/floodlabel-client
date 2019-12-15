import { scaleQuantile } from "d3";

const DEBUG = false;

export function calculateFloodlabel(score: number, from: number, to: number) {
  const scale = scaleQuantile<string>()
    .domain([from, to])
    .range(["a", "b", "c", "d", "e"]);

  const label = scale(score);
  if (DEBUG) {
    console.log("--------- calculateFloodlabel() ---------");
    console.log("[dbg] score:", score);
    console.log("[dbg] scale.domain:", scale.domain());
    console.log("[dbg] scale.range:", scale.range());
    console.log("[dbg] label:", label);
  }
  return label;
}

export function calculateTotalFloodLabel(score: number) {
  /**
   * 
   * Range classification, provided by Jelle:
   * 
   *   0-16:  A
   *   16-32: B
   *   32-48: C
   *   48-64: D
   *   >64:   E
   *  
   */ 


  if (score <= 16) {
    return "a";
  }

  if (score > 16 && score <= 32) {
    return "b";
  }

  if (score > 32 && score <= 48) {
    return "c";
  }

  if (score > 48 && score <= 64) {
    return "d";
  }

  return "e";
}
