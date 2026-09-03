// The authored sequence. Index == number of blinks you have survived.
// Nothing here is procedural: every beat is placed by hand so the escalation lands.
//
// z      = creature depth in world units (1.0 == the nearest doorframe). null = not present.
// x      = lateral world offset (0 == dead centre of the corridor)
// h      = creature height in world units (a person is ~1.75; this thing is taller)
// lean   = forward hunch, radians
// arm    = arm-length multiplier (1 is human, >1 is not)
// tilt   = head tilt, radians
// gaze   = 0 facing away, 1 facing you (drives the rim-light on the face and the eye slits)
// light  = how alive the far light at the end of the corridor is, 0..1
// dead   = indices of ceiling lamps that have gone out
// cam    = [dx, dy] shift of the vanishing point, as a fraction of the frame. Each beat
//          is framed as its own shot so the sequence never reads as one static camera.
// mode   = 'corridor' | 'behind' | 'face'
// sting  = { f: base freq, len: seconds, i: intensity 0..1, px: pan x, pz: pan z (neg = behind) }

export const BEATS = [
  {
    id: 'empty', cam: [0.00, 0.000],   mode: 'corridor', z: null, light: 1.0, dead: [],
    cap: 'The corridor is empty.',
    sr: 'An empty corridor of doorframes receding to a dim green light.',
    sting: null
  },
  {
    id: 'smudge', cam: [0.01, -0.004],  mode: 'corridor', z: 9.4, x: 0.10, h: 1.95, lean: 0.02, arm: 1.00, tilt: 0.00, gaze: 0.0,
    light: 0.97, dead: [],
    cap: 'Something at the far end.',
    sr: 'A thin dark smudge stands at the far end of the corridor.',
    sting: { f: 74, len: 1.1, i: 0.20, px: 0.0, pz: 5.0 }
  },
  {
    id: 'shape', cam: [-0.045, 0.014],   mode: 'corridor', z: 6.9, x: -0.12, h: 2.02, lean: 0.03, arm: 1.04, tilt: 0.03, gaze: 0.0,
    light: 0.94, dead: [7],
    cap: 'It has a shape now.',
    sr: 'The smudge has resolved into a tall, thin standing figure.',
    sting: { f: 68, len: 1.0, i: 0.26, px: -0.2, pz: 4.0 }
  },
  {
    id: 'turned', cam: [0.035, -0.012],  mode: 'corridor', z: 5.1, x: 0.06, h: 2.05, lean: 0.05, arm: 1.08, tilt: -0.10, gaze: 0.55,
    light: 0.88, dead: [7, 6],
    cap: 'It has turned around.',
    sr: 'The figure has turned to face you. Its head is tilted.',
    sting: { f: 88, len: 0.9, i: 0.34, px: 0.15, pz: 3.0 }
  },
  {
    id: 'doorway', cam: [0.080, 0.020], mode: 'corridor', z: 3.75, x: -0.34, h: 2.10, lean: 0.06, arm: 1.14, tilt: 0.12, gaze: 0.8,
    light: 0.80, dead: [7, 6, 5],
    cap: 'In the doorway.',
    sr: 'The figure now fills one of the doorframes, arms hanging past its knees.',
    sting: { f: 96, len: 0.85, i: 0.42, px: -0.5, pz: 2.2 }
  },
  {
    id: 'halfway', cam: [-0.055, -0.022], mode: 'corridor', z: 2.85, x: 0.14, h: 2.14, lean: 0.10, arm: 1.20, tilt: -0.16, gaze: 0.9,
    light: 0.70, dead: [7, 6, 5, 4],
    cap: 'Halfway. The arms are wrong.',
    sr: 'Halfway down the corridor. Its arms are far too long for its body.',
    sting: { f: 104, len: 0.8, i: 0.5, px: 0.3, pz: 1.6 }
  },
  {
    id: 'reach', cam: [0.040, 0.030],   mode: 'corridor', z: 2.10, x: -0.10, h: 2.18, lean: 0.16, arm: 1.28, tilt: 0.20, gaze: 1.0,
    light: 0.58, dead: [7, 6, 5, 4, 3],
    cap: 'It is reaching.',
    sr: 'Closer still, hunched forward, one arm lifted toward you.',
    sting: { f: 118, len: 0.75, i: 0.58, px: -0.25, pz: 1.1 }
  },
  {
    id: 'arch', cam: [-0.022, 0.052],    mode: 'corridor', z: 1.50, x: 0.04, h: 2.22, lean: 0.22, arm: 1.32, tilt: -0.24, gaze: 1.0,
    light: 0.52, dead: [8, 7, 6, 5, 4, 3, 2],
    cap: 'It fills the nearest frame.',
    sr: 'It is one doorframe away, hunched, head almost touching the ceiling.',
    sting: { f: 132, len: 0.7, i: 0.68, px: 0.1, pz: 0.7 }
  },
  {
    id: 'behind', cam: [0.065, -0.014],  mode: 'behind',  z: null, light: 0.44, dead: [9, 8, 7, 6, 5, 4, 3, 2, 1],
    cap: 'The corridor is empty again.',
    sr: 'The corridor is empty. Something very large is standing just behind your shoulder.',
    sting: { f: 58, len: 1.6, i: 0.55, px: 0.55, pz: -1.4 }
  },
  {
    id: 'back', cam: [0.000, 0.038],    mode: 'corridor', z: 1.05, x: -0.02, h: 2.26, lean: 0.26, arm: 1.34, tilt: 0.18, gaze: 1.0,
    light: 0.36, dead: [9, 8, 7, 6, 5, 4, 3, 2, 1],
    cap: 'It is in front of you again.',
    sr: 'It has returned to the corridor and is now directly in front of you.',
    sting: { f: 146, len: 0.6, i: 0.82, px: 0.0, pz: 0.4 }
  },
  {
    id: 'close', cam: [-0.030, 0.062],   mode: 'corridor', z: 0.70, x: 0.03, h: 2.30, lean: 0.30, arm: 1.36, tilt: -0.12, gaze: 1.0,
    light: 0.30, dead: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    cap: 'Too close. Do not look up.',
    sr: 'Its chest fills the frame. Its head is cut off by the top of the picture.',
    sting: { f: 160, len: 0.55, i: 0.9, px: 0.0, pz: 0.2 }
  },
  {
    id: 'face', cam: [0.000, 0.000],    mode: 'face',    z: null, light: 0.05, dead: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    cap: 'It is not going to blink first.',
    sr: 'One enormous unblinking eye fills the frame. The corridor behind you is reflected in it.',
    sting: { f: 176, len: 1.4, i: 1.0, px: 0.0, pz: 0.1 }
  }
];

// The last beat is the stand-off: you must hold your eyes open through it.
export const FINAL_INDEX = BEATS.length - 1;
export const HOLD_SECONDS = 12;
