# 10 browser-native ideas with a 10-second payoff

## 1. pulseprint

**ONE-LINE HOOK:** Put a finger over your camera; your heartbeat paints a living signature no one else can make.

**CATEGORY:** Health × generative art

**THE 10-SECOND MOMENT:** The screen finds a pulse in the red camera glow, then every beat throws a luminous ring into a growing, fingerprint-like flower stamped with the live BPM.

**CORE MECHANIC:** Request the rear camera, average the red channel in each video frame, remove slow brightness drift, and detect peaks with a simple adaptive threshold. Feed beat intervals and signal strength into a deterministic Canvas particle/line system. This is explicitly a visual toy, not a medical device.

**WHY IT SPREADS:** The result feels biologically intimate, looks excellent in a screen recording, and every output is visibly personal. The obvious post format is: “This is what my heartbeat looks like.”

**SCOPE:** One instruction screen; camera selection; live signal-quality meter; beat-reactive artwork; BPM estimate; three visual seeds; freeze-and-download PNG; a tasteful non-medical disclaimer. No history, accounts, or wellness claims.

## 2. throatlight

**ONE-LINE HOOK:** Hum one note and watch your voice open a cathedral made of light.

**CATEGORY:** Music

**THE 10-SECOND MOMENT:** A sustained hum locks to pitch and extrudes a glowing, rotating rose window; vibrato bends its arches while harmonics ignite different colors.

**CORE MECHANIC:** Use WebAudio's analyser node for autocorrelation pitch detection plus FFT harmonic energy. Map the fundamental to rotational symmetry, timbre to color, loudness to depth, and pitch drift to deformation in Canvas or lightweight WebGL. Silence lets the structure slowly crystallize.

**WHY IT SPREADS:** It makes an ordinary voice look sacred. Singers can flex control, non-singers get funny unstable architecture, and duets can compare “voice cathedrals.”

**SCOPE:** Mic permission; a “hum now” cue; reliable pitch lock over a practical vocal range; one spectacular renderer; live note readout; freeze/download; mute/reset. Skip recording, multitracking, and song recognition.

## 3. dontblink

**ONE-LINE HOOK:** A horror game that only moves when you blink.

**CATEGORY:** Game

**THE 10-SECOND MOMENT:** The player stares at a distant silhouette, blinks once, and opens their eyes to find it filling half the screen—with the webcam inset proving what triggered it.

**CORE MECHANIC:** Use getUserMedia and a tiny bundled face/eye landmark model, or a coarse luminance/skin-region heuristic, to detect simultaneous eye closure. Freeze the game while eyes are open; on each blink, advance a pre-authored sequence of increasingly wrong scenes with abrupt WebAudio spatial cues.

**WHY IT SPREADS:** The mechanic is explainable in five words, produces authentic reaction videos, and naturally invites “I lasted seven blinks” challenges. Viewers instinctively try not to blink too.

**SCOPE:** Calibration; 8–12 hand-crafted encounter frames; blink counter; escalating sound design; false-positive tolerance; death/reveal screen; local best score. One polished monster beats procedural content.

## 4. roomtone

**ONE-LINE HOOK:** Point your camera around your room and discover its secret color chord.

**CATEGORY:** Lifestyle

**THE 10-SECOND MOMENT:** A slow camera sweep samples the room, then collapses it into five floating color orbs that play a surprisingly coherent chord unique to that space.

**CORE MECHANIC:** Sample frames into a low-resolution buffer, cluster pixels with k-means in OKLab, weight colors by persistence, and quantize hue/lightness into a pentatonic or modal voicing synthesized with WebAudio oscillators. Device orientation can pan each note spatially as the user turns.

**WHY IT SPREADS:** Bedrooms, offices, cafés, and ugly kitchens become comparable audiovisual “auras.” It creates a clean share card and a strong prompt: “What does your room sound like?”

**SCOPE:** Camera viewfinder; 5-second scan; robust dominant-color clustering; one beautiful reveal animation; generated chord playback; PNG card with swatches and invented chord name; rescan. No decorating advice.

## 5. afterimage

**ONE-LINE HOOK:** Stare at a ghost for eight seconds, then watch it appear on your real wall.

**CATEGORY:** Art / perception

**THE 10-SECOND MOMENT:** A vivid negative-color portrait pulses around a fixation dot; the screen snaps white and the hidden full-color face appears to float there—even though it is no longer being drawn.

**CORE MECHANIC:** Let users choose a bundled portrait or load a local image. Create an opponent-color negative, normalize luminance, place a fixation point, and run a precisely timed adaptation sequence followed by a neutral field. Optional fullscreen and subtle gaze-drift guidance strengthen the retinal afterimage illusion.

**WHY IT SPREADS:** The browser appears to put an image inside the viewer's vision. It is hard to spoil in a screenshot, so posts create irresistible curiosity and comments arguing whether it works.

**SCOPE:** Three excellent built-in images; local File API import; automatic crop/contrast treatment; countdown; adaptation/reveal loop; replay; clear photosensitivity warning and reduced-intensity mode. No editor beyond crop and strength.

## 6. gravitylies

**ONE-LINE HOOK:** Tilt your phone to bend a star field—then discover which way “down” really is.

**CATEGORY:** Science

**THE 10-SECOND MOMENT:** Thousands of stars pour toward the phone's apparent bottom; the user rotates the device and realizes one bright “star” stubbornly tracks actual gravity while the rest obey the screen illusion.

**CORE MECHANIC:** Read DeviceOrientation/DeviceMotion, fuse acceleration and orientation with a simple low-pass filter, and drive a Canvas particle field. Alternate between screen-relative, gravity-relative, and deliberately conflicting frames of reference; visualize the measured gravity vector and calibration uncertainty.

**WHY IT SPREADS:** It turns an invisible sensor into a physical illusion people can feel in their hands. Screen recordings plus an external shot of the rotating phone make satisfying science clips.

**SCOPE:** iOS sensor-permission gesture; calibration; responsive particle simulation; three illusion stages; a final “your brain guessed / sensor measured” vector reveal; desktop mouse fallback; short explanation. No physics sandbox.

## 7. samebreath

**ONE-LINE HOOK:** Two people touch the same screen and try to make one digital creature breathe together.

**CATEGORY:** Social, co-located

**THE 10-SECOND MOMENT:** Two fingers hold opposite sides of a phone; each person's press rhythm inflates one half of a translucent creature, and synchronized releases suddenly make it hatch into a shower of paired shapes.

**CORE MECHANIC:** Track two simultaneous touch points and derive each person's inhale/exhale rhythm from press-and-release timing. Compare phase alignment over several cycles; render a shared soft-body shape on Canvas and use local WebAudio cues to guide convergence. No networking—the physical sharing is the point.

**WHY IT SPREADS:** It manufactures a tender, slightly awkward real-world interaction and a visible compatibility score. Couples, friends, parents, and strangers can all film the ritual.

**SCOPE:** Two-finger onboarding; independent pulse indicators; three-cycle synchronization logic; squishy creature animation; one dramatic hatch state; final paired glyph and score; replay. It must feel generous, never label people “incompatible.”

## 8. filefossil

**ONE-LINE HOOK:** Drop any file into the browser and excavate the creature hiding in its bytes.

**CATEGORY:** Tool × data art

**THE 10-SECOND MOMENT:** A mundane PDF or ZIP becomes a rotating skeletal organism whose spine, limbs, scars, and color are determined by the actual file structure; changing one byte visibly mutates it.

**CORE MECHANIC:** Read files locally with FileReader, calculate chunk entropy and byte-frequency bands, detect repeated sequences, and map those measurements into a seeded procedural skeleton rendered in Canvas/WebGL. Hash-derived naming makes the same file always produce the same “species.” Nothing uploads.

**WHY IT SPREADS:** People will fossilize resumes, theses, source archives, break-up texts, and suspicious downloads. The privacy promise is verifiable, and side-by-side file mutations are perfect developer bait for HN.

**SCOPE:** Drag/drop and picker; streaming-friendly analysis with a size cap; deterministic creature generator; five visibly distinct structural traits; rotate/zoom; labeled specimen card; PNG export. Do not pretend to identify malware or infer semantic content.

## 9. apologyengine

**ONE-LINE HOOK:** Type the apology you never sent; your backspace key decides whether it survives.

**CATEGORY:** Unclassifiable — emotional instrument

**THE 10-SECOND MOMENT:** As the user types, deleted words do not vanish—they fall behind the page as enormous translucent “ghost sentences”; holding backspace eventually cracks the whole letter open and reveals every revision at once.

**CORE MECHANIC:** Build a custom text surface that records insertions, deletions, pauses, and rewrites in memory. Render removed phrases into a Canvas depth field, with weight based on hesitation and repeated deletion. A final key chord triggers a cinematic exploded view; all content stays local and disappears on refresh unless explicitly exported.

**WHY IT SPREADS:** It reveals the emotional shape of editing without analyzing or judging the text. People can post redacted ghost maps, writers can compare revision “wreckage,” and the interaction itself is cathartic.

**SCOPE:** Minimal writing surface; keystroke timeline; beautiful deleted-text physics; privacy-first ephemeral default; reveal animation; automatic redaction mode that converts words to bars; image export; “burn it” reset. No sentiment analysis, prompts, or cloud save.

## 10. cursorweather

**ONE-LINE HOOK:** Your mouse has been leaving weather behind its whole life. Now you can see it.

**CATEGORY:** Unclassifiable — behavioral mirror

**THE 10-SECOND MOMENT:** After five seconds of ordinary movement, the cursor vanishes and its hidden behavior blooms into a tiny climate: hesitation becomes fog, frantic corrections become lightning, smooth arcs become warm jet streams, and clicks punch thunder holes in the clouds.

**CORE MECHANIC:** Sample pointer position, velocity, acceleration, curvature, idle duration, and click pressure where available. Feed short rolling statistics—not personality labels—into a seeded fluid-ish Canvas field using particles, curl noise, and compositing. The reveal replays the exact cursor path as a weather front.

**WHY IT SPREADS:** Everyone assumes their cursor movement is neutral until it becomes a dramatic self-portrait. “My cursor is a thunderstorm” is a compact, highly visual share format, and comparing trackpad versus mouse creates repeat use.

**SCOPE:** A playful 5-second target-chasing calibration; six weather mappings; polished full-screen reveal; path replay; downloadable looping WebM where supported plus PNG fallback; reset; accessible keyboard-generated alternate. No fake psychological diagnosis.

## The three I would build first

1. **dontblink** — clearest premise, strongest reaction-video loop, hardest to ignore in-feed.
2. **filefossil** — technically credible, endlessly personalized, and unusually well matched to HN/Reddit sharing.
3. **pulseprint** — intimate input plus gorgeous output, with a complete-feeling v1 achievable in one night.
