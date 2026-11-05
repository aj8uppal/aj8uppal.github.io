/**
 * Headings split into masked characters and rise into place; copy fades up
 * out of a blur. Both start from their resting state in the HTML, so a page
 * without JavaScript (or with reduced motion) simply shows everything.
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
    const hero = el.closest('.hero');
    const tween = gsap.from(split.chars, {
      yPercent: 118,
      rotate: 7,
      opacity: 0,
      duration: hero ? 1.6 : 1.15,
      ease: 'expo.out',
      stagger: hero ? 0.045 : 0.018,
      paused: true,
    });
    if (hero) {
      // The hero waits for the loader to lift.
      const go = () => setTimeout(() => tween.play(), 650);
      if (document.documentElement.classList.contains('ready')) go();
      else
        new MutationObserver((_, o) => {
          if (document.documentElement.classList.contains('ready')) {
            o.disconnect();
            go();
          }
        }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      return;
    }
    ScrollTrigger.create({
      trigger: triggerFor(el),
      start: 'top 55%',
      onEnter: () => tween.play(),
      onLeaveBack: () => tween.reverse(),
    });
  });

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    const delay = Number(el.dataset.reveal || 0);
    const hero = el.closest('.hero');
    const tween = gsap.from(el, {
      y: 34,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 1.2,
      delay: delay + (hero ? 0 : 0.15),
      ease: 'power3.out',
      paused: true,
      clearProps: 'filter',
    });
    if (hero) {
      const go = () => setTimeout(() => tween.play(), 1100);
      const watch = new MutationObserver(() => {
        if (document.documentElement.classList.contains('ready')) {
          watch.disconnect();
          go();
        }
      });
      if (document.documentElement.classList.contains('ready')) go();
      else
        watch.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      return;
    }
    ScrollTrigger.create({
      trigger: triggerFor(el),
      start: 'top 50%',
      onEnter: () => tween.play(),
      onLeaveBack: () => tween.reverse(),
    });
  });
}
