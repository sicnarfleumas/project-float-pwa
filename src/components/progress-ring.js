/* =========================================================
   PROGRESS RING — SVG circular progress indicator
   ========================================================= */

/**
 * Create a circular progress ring
 * @param {number} pct - 0-100
 * @param {number} size - pixel size
 * @param {string} color - CSS color
 * @returns {HTMLElement}
 */
export function progressRing(pct, size = 64, color = 'var(--accent)') {
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  const wrapper = document.createElement('div');
  wrapper.style.cssText = `position:relative;width:${size}px;height:${size}px;flex-shrink:0;`;

  wrapper.innerHTML = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(-90deg)">
      <circle cx="${size/2}" cy="${size/2}" r="${radius}"
        fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="${stroke}" />
      <circle cx="${size/2}" cy="${size/2}" r="${radius}"
        fill="none" stroke="${color}" stroke-width="${stroke}"
        stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
        stroke-linecap="butt"
        style="transition: stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1)" />
    </svg>
    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
      font-family:'Archivo Black',sans-serif;font-size:${size < 60 ? 12 : 16}px;color:var(--ink);">
      ${pct}%
    </div>
  `;

  return wrapper;
}
