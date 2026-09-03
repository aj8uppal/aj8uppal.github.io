import { html, h, useState, useEffect, useRef, useCallback, useMemo } from '../../vendor/preact-htm.module.js';
import { Icon } from './icons.js';
import { useClickOutside, useAutoFocus } from './hooks.js';
import { WEEKDAY_MIN, weekdayOrder, relativeDay, formatTime, todayKey } from '../dates.js';
import { AREA_COLORS } from '../model.js';
import { lastActionId, undoUntil } from '../store.js';

// ---- Toasts (module-level bus so any code can toast) ----
const toastListeners = new Set();
let toastId = 0;
export function toast(message, { action, onAction, duration = 4500, kind = 'info' } = {}) {
  const t = { id: ++toastId, message, action, onAction, duration, kind };
  toastListeners.forEach((fn) => fn(t));
  return t.id;
}

/** Toast with an Undo action that reverts the *specific* action just performed (and anything after it). Call right after the action. */
export function undoToast(message, opts = {}) {
  const id = lastActionId();
  if (!id) return toast(message, opts); // the action changed nothing — offer no Undo rather than reverting something else
  return toast(message, { ...opts, action: 'Undo', onAction: () => { const label = undoUntil(id); if (!label) toast('That change is no longer on the undo stack'); } });
}

export function Toaster() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const on = (t) => {
      setItems((prev) => [...prev.slice(-2), t]);
      if (t.duration > 0) setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== t.id)), t.duration);
    };
    toastListeners.add(on);
    return () => toastListeners.delete(on);
  }, []);
  const dismiss = (id) => setItems((prev) => prev.filter((x) => x.id !== id));
  return html`<div class="toasts" role="status" aria-live="polite">
    ${items.map((t) => html`<div class=${'toast ' + t.kind} key=${t.id}>
      <span class="flex-1">${t.message}</span>
      ${t.action && html`<button onClick=${() => { t.onAction?.(); dismiss(t.id); }}>${t.action}</button>`}
      <button class="close" aria-label="Dismiss" onClick=${() => dismiss(t.id)}><${Icon} name="x" size="14" /></button>
    </div>`)}
  </div>`;
}

// ---- Modal ----
// Only the top-most open modal reacts to Escape; body scroll lock is reference counted so nested dialogs unlock cleanly.
const modalStack = [];
let scrollLocks = 0;
export function lockScroll() { if (scrollLocks++ === 0) document.body.style.overflow = 'hidden'; }
export function unlockScroll() { if (--scrollLocks <= 0) { scrollLocks = 0; document.body.style.overflow = ''; } }
export function isModalOpen() { return modalStack.length > 0 || !!document.querySelector('.modal-backdrop'); }

export function Modal({ title, onClose, children, footer, wide = false, initialFocus = true }) {
  const ref = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    const token = {};
    modalStack.push(token);
    const onKey = (e) => {
      if (e.key !== 'Escape' || modalStack[modalStack.length - 1] !== token) return;
      e.stopImmediatePropagation();
      e.preventDefault();
      onCloseRef.current();
    };
    document.addEventListener('keydown', onKey, true);
    lockScroll();
    const prevFocus = document.activeElement;
    if (initialFocus) {
      setTimeout(() => {
        const el = ref.current?.querySelector('input:not([type=hidden]), textarea, select, button.primary, [data-autofocus]');
        (el || ref.current)?.focus();
      }, 20);
    }
    return () => {
      document.removeEventListener('keydown', onKey, true);
      const i = modalStack.indexOf(token);
      if (i !== -1) modalStack.splice(i, 1);
      unlockScroll();
      if (prevFocus && prevFocus.focus && document.contains(prevFocus)) prevFocus.focus();
    };
  }, []);
  // Focus trap
  const onKeyDown = (e) => {
    if (e.key !== 'Tab' || !ref.current) return;
    const focusables = ref.current.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  return html`<div class="modal-backdrop" onMouseDown=${(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div class=${'modal' + (wide ? ' wide' : '')} role="dialog" aria-modal="true" aria-label=${title} ref=${ref} onKeyDown=${onKeyDown} tabindex="-1">
      ${title != null && html`<div class="modal-head"><h2>${title}</h2><button class="btn ghost icon" aria-label="Close" onClick=${onClose}><${Icon} name="x" /></button></div>`}
      <div class="modal-body">${children}</div>
      ${footer && html`<div class="modal-foot">${footer}</div>`}
    </div>
  </div>`;
}

export function ConfirmDialog({ title = 'Are you sure?', message, confirmLabel = 'Delete', danger = true, onConfirm, onClose }) {
  return html`<${Modal} title=${title} onClose=${onClose} footer=${html`
    <span class="right"></span>
    <button class="btn" onClick=${onClose}>Cancel</button>
    <button class=${'btn ' + (danger ? 'danger' : 'primary')} data-autofocus onClick=${() => { onConfirm(); onClose(); }}>${confirmLabel}</button>
  `}>
    <p class="muted">${message}</p>
  <//>`;
}

// ---- Form fields ----
let fieldCounter = 0;
const LABELABLE = new Set(['input', 'select', 'textarea']);
export function Field({ label, children, hint, class: cls = '' }) {
  const id = useMemo(() => 'fld-' + (++fieldCounter), []);
  const kids = Array.isArray(children) ? children.filter(Boolean) : [children];
  const first = kids[0];
  const others = kids.slice(1);
  // A plain control (optionally followed by helpers like <datalist>) gets a real `for`/id pairing; composite controls get a labelled group.
  if (first && typeof first.type === 'string' && LABELABLE.has(first.type) && others.every((k) => k && k.type === 'datalist')) {
    const control = h(first.type, { ...first.props, id: first.props.id || id, 'aria-describedby': hint ? id + '-hint' : undefined, ref: first.ref, key: first.key });
    return html`<div class=${'field ' + cls}><label for=${first.props.id || id}>${label}</label>${control}${others}${hint && html`<div class="hint" id=${id + '-hint'}>${hint}</div>`}</div>`;
  }
  return html`<div class=${'field ' + cls} role="group" aria-labelledby=${id}><label id=${id}>${label}</label>${children}${hint && html`<div class="hint">${hint}</div>`}</div>`;
}

/** Props that make a non-button element behave like one for keyboard users. */
export function pressable(onActivate, { role = 'button' } = {}) {
  return {
    role,
    tabindex: 0,
    onClick: onActivate,
    onKeyDown: (e) => {
      if (e.target !== e.currentTarget) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onActivate(e); }
    },
  };
}

export function Select({ value, onChange, options, placeholder, ...rest }) {
  return html`<select class="select" value=${value ?? ''} onChange=${(e) => onChange(e.target.value)} ...${rest}>
    ${placeholder != null && html`<option value="">${placeholder}</option>`}
    ${options.map((o) => html`<option value=${o.value} key=${o.value}>${o.label}</option>`)}
  </select>`;
}

export function AreaSelect({ areas, value, onChange, placeholder = 'No area' }) {
  return html`<${Select} value=${value || ''} onChange=${(v) => onChange(v || null)} placeholder=${placeholder}
    options=${areas.map((a) => ({ value: a.id, label: `${a.icon} ${a.name}` }))} />`;
}

export function DayPicker({ value = [], onChange, weekStart = 1 }) {
  const order = weekdayOrder(weekStart);
  const toggle = (d) => onChange(value.includes(d) ? value.filter((x) => x !== d) : [...value, d].sort((a, b) => a - b));
  return html`<div class="daypick" role="group" aria-label="Days of week">
    ${order.map((d) => html`<button type="button" key=${d} aria-pressed=${value.includes(d)} aria-label=${['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d]} onClick=${() => toggle(d)}>${WEEKDAY_MIN[d]}</button>`)}
  </div>`;
}

export function Segmented({ value, onChange, options, ariaLabel }) {
  return html`<div class="seg" role="group" aria-label=${ariaLabel}>
    ${options.map((o) => html`<button type="button" key=${o.value} aria-pressed=${o.value === value} onClick=${() => onChange(o.value)}>${o.label}</button>`)}
  </div>`;
}

const EMOJIS = ['✅', '📝', '💧', '🏃', '🧘', '📚', '🛏️', '🍎', '💊', '🦷', '☀️', '🌙', '💪', '🚴', '🏊', '🎯', '💼', '🧹', '🍳', '🌱', '🎸', '🎨', '💻', '📞', '🧠', '❤️', '🐶', '🚿', '☕', '🚭', '💰', '✈️', '🎉', '🙂', '😎', '🧑', '👩', '👨', '🧔', '👵', '👴', '🐱', '⭐', '🔥', '🏡', '🛠️', '🎓', '🚗'];
export function EmojiPicker({ value, onChange }) {
  const [custom, setCustom] = useState('');
  return html`<div>
    <div class="emoji-grid" role="group" aria-label="Icon">
      ${EMOJIS.map((e) => html`<button type="button" key=${e} aria-pressed=${e === value} aria-label=${e} onClick=${() => onChange(e)}>${e}</button>`)}
    </div>
    <div class="flex mt-8"><input class="input" style="max-width:160px" placeholder="Or type any emoji" value=${custom} maxlength="4" onInput=${(e) => { setCustom(e.target.value); if (e.target.value.trim()) onChange(e.target.value.trim()); }} /></div>
  </div>`;
}

export function ColorPicker({ value, onChange }) {
  return html`<div class="flex wrap gap-4">
    ${AREA_COLORS.map((c) => html`<button type="button" key=${c} aria-label=${c} aria-pressed=${c === value} class="cell" style=${`background:${c};border-color:${c === value ? 'var(--text)' : 'transparent'};width:26px;height:26px;border-radius:50%`} onClick=${() => onChange(c)}></button>`)}
    <input type="color" value=${value || '#6366f1'} aria-label="Custom color" onInput=${(e) => onChange(e.target.value)} />
  </div>`;
}

// ---- Small display bits ----
export function Checkbox({ checked, onChange, label, partial = false, count = null, round = false, lg = false }) {
  return html`<button type="button" role="checkbox" aria-checked=${checked ? 'true' : partial ? 'mixed' : 'false'} aria-label=${label} class=${'checkbox' + (round ? ' round' : '') + (lg ? ' lg' : '') + (partial ? ' partial' : '')} onClick=${(e) => { e.stopPropagation(); onChange(!checked); }}>
    ${checked ? html`<${Icon} name="check" />` : partial && count != null ? html`<span class="count">${count}</span>` : null}
  </button>`;
}

export function AreaBadge({ area, showName = true }) {
  if (!area) return null;
  return html`<span class="area-badge" title=${area.name}><span class="area-dot" style=${`background:${area.color}`}></span>${showName && area.name}</span>`;
}

export function Badge({ children, kind = '', title }) {
  return html`<span class=${'badge ' + kind} title=${title}>${children}</span>`;
}

export function DueLabel({ date, time, today = todayKey(), done = false }) {
  if (!date) return null;
  const cls = done ? '' : date < today ? ' overdue' : date === today ? ' today' : '';
  return html`<span class=${'due' + cls}>${relativeDay(date, today)}${time ? ' · ' + formatTime(time) : ''}</span>`;
}

export function Progress({ value, max = 100, success = false }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return html`<div class=${'progress' + (success && pct === 100 ? ' success' : '')} role="progressbar" aria-valuenow=${pct} aria-valuemin="0" aria-valuemax="100"><div style=${`width:${pct}%`}></div></div>`;
}

export function Ring({ value, max = 1, size = 44, label }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const pct = max ? Math.min(1, value / max) : 0;
  return html`<svg class="ring" width=${size} height=${size} viewBox="0 0 44 44" role="img" aria-label=${label || `${Math.round(pct * 100)}%`}>
    <circle class="track" cx="22" cy="22" r=${r} />
    <circle class="bar" cx="22" cy="22" r=${r} stroke-dasharray=${c} stroke-dashoffset=${c * (1 - pct)} transform="rotate(-90 22 22)" />
    <text x="22" y="26" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">${Math.round(pct * 100)}%</text>
  </svg>`;
}

export function Empty({ icon = 'inbox', title, hint, action }) {
  return html`<div class="empty">
    <${Icon} name=${icon} />
    <strong>${title}</strong>
    ${hint && html`<span class="small">${hint}</span>`}
    ${action}
  </div>`;
}

export function Streak({ n }) {
  if (!n) return null;
  return html`<span class="streak" title=${`${n} day streak`}><${Icon} name="flame" size="13" />${n}</span>`;
}

export function Menu({ items, label = 'More' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false), open);
  useEffect(() => {
    if (!open) return;
    const first = ref.current?.querySelector('[role="menuitem"]');
    first?.focus();
  }, [open]);
  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setOpen(false); ref.current?.querySelector('button')?.focus(); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const els = Array.from(ref.current?.querySelectorAll('[role="menuitem"]') || []);
      const i = els.indexOf(document.activeElement);
      const next = e.key === 'ArrowDown' ? (i + 1) % els.length : (i - 1 + els.length) % els.length;
      els[next]?.focus();
    }
  };
  return html`<div class="menu" ref=${ref} onKeyDown=${onKey}>
    <button class="btn ghost icon sm" aria-label=${label} aria-haspopup="menu" aria-expanded=${open} onClick=${(e) => { e.stopPropagation(); setOpen((o) => !o); }}><${Icon} name="more" /></button>
    ${open && html`<div class="menu-list" role="menu" onClick=${(e) => e.stopPropagation()}>
      ${items.map((it, i) => it === 'divider' ? html`<hr key=${i} />` : html`<button role="menuitem" key=${i} class=${it.danger ? 'danger' : ''} onClick=${() => { setOpen(false); it.onClick(); }}>${it.icon && html`<${Icon} name=${it.icon} size="15" />`}${it.label}</button>`)}
    </div>`}
  </div>`;
}

export function Tabs({ value, onChange, tabs }) {
  return html`<div class="tabs" role="tablist">
    ${tabs.map((t) => html`<button role="tab" key=${t.value} class="tab" aria-selected=${t.value === value} onClick=${() => onChange(t.value)}>${t.label}${t.count != null ? html` <span class="badge count">${t.count}</span>` : null}</button>`)}
  </div>`;
}

export function Rating({ value, onChange, max = 5 }) {
  return html`<div class="rating" role="radiogroup" aria-label="Rating">
    ${Array.from({ length: max }, (_, i) => i + 1).map((n) => html`<button type="button" key=${n} role="radio" aria-checked=${value === n} aria-label=${`${n} of ${max}`} class=${n <= (value || 0) ? 'on' : ''} onClick=${() => onChange(value === n ? null : n)}>★</button>`)}
  </div>`;
}

/** Inline editable text: click to edit, Enter/blur commits, Esc cancels. */
export function InlineEdit({ value, onCommit, class: cls = '', placeholder = '' }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useAutoFocus(editing);
  useEffect(() => { if (!editing) setDraft(value); }, [value, editing]);
  const commit = useCallback(() => { setEditing(false); if (draft.trim() && draft !== value) onCommit(draft.trim()); }, [draft, value, onCommit]);
  if (!editing) return html`<span class=${cls + ' clickable'} title="Click to edit" onClick=${(e) => { e.stopPropagation(); setEditing(true); }}>${value || html`<span class="faint">${placeholder}</span>`}</span>`;
  return html`<input ref=${ref} class="input" value=${draft} onInput=${(e) => setDraft(e.target.value)} onBlur=${commit} onClick=${(e) => e.stopPropagation()}
    onKeyDown=${(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(value); setEditing(false); } }} />`;
}

export function PeoplePicker({ people, value = [], onChange }) {
  const toggle = (id) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  if (!people.length) return html`<div class="hint">No people yet. Add friends and family under People.</div>`;
  return html`<div class="chips">
    ${people.map((p) => html`<button type="button" class="chip" key=${p.id} aria-pressed=${value.includes(p.id)} onClick=${() => toggle(p.id)}>${p.emoji} ${p.name}</button>`)}
  </div>`;
}
