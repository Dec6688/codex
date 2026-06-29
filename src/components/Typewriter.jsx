import React, { useEffect, useMemo, useRef, useState } from 'react';

// 来自 animal-island-ui 的 Typewriter 思路：逐字显示，同时保留 children 中的标签结构。
const countText = (node) => {
  if (node === null || node === undefined || typeof node === 'boolean') return 0;
  if (typeof node === 'string' || typeof node === 'number') return String(node).length;
  if (Array.isArray(node)) return node.reduce((sum, child) => sum + countText(child), 0);
  if (React.isValidElement(node)) return countText(node.props.children);
  return 0;
};

const renderTruncated = (node, state, keyPrefix = 'tw') => {
  if (state.stopped || node === null || node === undefined || typeof node === 'boolean') return null;

  if (typeof node === 'string' || typeof node === 'number') {
    const text = String(node);
    if (state.remaining >= text.length) {
      state.remaining -= text.length;
      return text;
    }
    const shown = text.slice(0, state.remaining);
    state.remaining = 0;
    state.stopped = true;
    return shown;
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => (
      <React.Fragment key={`${keyPrefix}-${index}`}>
        {renderTruncated(child, state, `${keyPrefix}-${index}`)}
      </React.Fragment>
    ));
  }

  if (React.isValidElement(node)) {
    return React.cloneElement(node, undefined, renderTruncated(node.props.children, state, keyPrefix));
  }

  return null;
};

export function Typewriter({ children, speed = 70, trigger, autoPlay = true, onDone }) {
  const total = useMemo(() => countText(children), [children]);
  const [count, setCount] = useState(autoPlay ? 0 : total);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (!autoPlay) {
      setCount(total);
      return undefined;
    }

    setCount(0);
    if (total === 0) return undefined;

    timerRef.current = window.setInterval(() => {
      setCount((current) => {
        if (current >= total) {
          window.clearInterval(timerRef.current);
          return current;
        }
        return current + 1;
      });
    }, speed);

    return () => window.clearInterval(timerRef.current);
  }, [autoPlay, speed, total, trigger]);

  useEffect(() => {
    if (total > 0 && count >= total) onDone?.();
  }, [count, onDone, total]);

  return <>{renderTruncated(children, { remaining: count, stopped: false })}</>;
}
