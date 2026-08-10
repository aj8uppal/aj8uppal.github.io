import { useCallback, useEffect, useState } from 'react';

interface Props {
  /** Tokens that appear in more than one role, most common first. */
  tags: string[];
  total: number;
}

/**
 * A filter over the work log. Eight roles and their stacks is a wall of mono
 * text nobody reads top to bottom; picking "PostgreSQL" and seeing which four
 * jobs light up is the same information as an interaction.
 *
 * It owns the chips only. The rows themselves are server-rendered with a
 * data-stack attribute and are simply hidden or shown, so without JavaScript
 * there are no chips and all eight roles are there.
 */
export default function StackFilter({ tags, total }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const [shown, setShown] = useState(total);

  const apply = useCallback((tag: string | null) => {
    const rows = Array.from(document.querySelectorAll<HTMLElement>('.role[data-stack]'));
    let n = 0;
    for (const row of rows) {
      const on = !tag || (row.dataset.stack ?? '').includes(`|${tag.toLowerCase()}|`);
      row.hidden = !on;
      if (on) n += 1;
    }
    setShown(n);
  }, []);

  // Re-apply on mount so a filter survives a hot reload, and clear the hidden
  // state if this island is ever unmounted.
  useEffect(() => {
    apply(active);
    return () => apply(null);
  }, [active, apply]);

  return (
    <div className="filter">
      <p className="filter__count" aria-live="polite">
        {active ? `${shown} of ${total} roles used ${active}` : `${total} roles, all shown`}
      </p>
      <div className="filter__chips">
        <button
          type="button"
          className="choice"
          aria-pressed={active === null}
          onClick={() => setActive(null)}
        >
          All
        </button>
        {tags.map((t) => (
          <button
            key={t}
            type="button"
            className="choice"
            aria-pressed={active === t}
            onClick={() => setActive(active === t ? null : t)}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
