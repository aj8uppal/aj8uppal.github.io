/**
 * A damped spring, sampled two ways.
 *
 * Everything that moves on this page moves on one of these rather than on a cubic
 * bezier. The difference is not decorative: a spring carries velocity, so an
 * animation interrupted halfway continues from where it is instead of snapping
 * back and restarting.
 */

const STIFFNESS = 0.12;
const DAMPING = 0.76;

/**
 * Live spring, stepped once per frame. Use where the target can change mid-flight
 * (the frame switcher's tab indicator).
 */
export class Spring {
  value: number;
  target: number;
  private velocity = 0;

  constructor(
    value: number,
    private readonly stiffness = STIFFNESS,
    private readonly damping = DAMPING,
  ) {
    this.value = value;
    this.target = value;
  }

  /** Advances one frame. Returns false once it has settled. */
  step(): boolean {
    const delta = this.target - this.value;
    this.velocity += delta * this.stiffness;
    this.velocity *= this.damping;
    this.value += this.velocity;
    if (Math.abs(this.velocity) < 0.02 && Math.abs(delta) < 0.02) {
      this.value = this.target;
      this.velocity = 0;
      return false;
    }
    return true;
  }

  jump(to: number): void {
    this.value = to;
    this.target = to;
    this.velocity = 0;
  }
}

/**
 * The same spring, pre-sampled into keyframes for the Web Animations API. Use where
 * the target is fixed (scroll reveals): one compositor-driven animation per element
 * is far cheaper than a rAF loop per element, and WAAPI animations stay cancellable.
 */
export function springKeyframes(samples = 48): number[] {
  const out: number[] = [];
  let x = 1;
  let v = 0;
  for (let i = 0; i < samples; i++) {
    v += -x * STIFFNESS;
    v *= DAMPING;
    x += v;
    out.push(x);
  }
  out[out.length - 1] = 0;
  return out;
}
