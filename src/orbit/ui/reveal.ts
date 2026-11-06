/**
 * Headings split into masked characters and rise into place; copy fades up.
 * Both start from their resting state in the HTML, so a page without
 * JavaScript (or with reduced motion) simply shows everything. Each plays once:
 * copy that vanished again on the way back up read as flicker, and a blur
 * filter on every block cost frames mid-flight.
 *
 * The hero is not here: it enters in CSS from the first paint (orbit.css),
 * because this module can arrive after the visitor has started reading it.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initReveals(reduce: boolean) {
  if (reduce) return;
  const triggerFor = (el: Element) =>
    (el.closest('[data-shot]') as HTMLElement | null) ?? (el as HTMLElement);

  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const split = SplitText.create(el, {
      type: 'lines,words,chars',
      mask: 'lines',
      linesClass: 'split-line',
      wordsClass: 'split-word',
    });
    const tween = gsap.from(split.chars, {
      yPercent: 118,
      rotate: 7,
      opacity: 0,
      duration: 1.15,
      ease: 'expo.out',
      stagger: 0.018,
      paused: true,
    });
    ScrollTrigger.create({
      trigger: triggerFor(el),
      start: 'top 65%',
      once: true,
      onEnter: () => tween.play(),
    });
  });

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    const tween = gsap.from(el, {
      y: 26,
      opacity: 0,
      duration: 1.0,
      delay: Number(el.dataset.reveal || 0) + 0.05,
      ease: 'power3.out',
      paused: true,
    });
    ScrollTrigger.create({
      trigger: triggerFor(el),
      start: 'top 62%',
      once: true,
      onEnter: () => tween.play(),
    });
  });
}
