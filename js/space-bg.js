/**
 * space-bg.js — Vanta.js HALO animated space background
 * Requires three.js + vanta.halo.min.js loaded before this script.
 */
(function () {
  window.addEventListener('load', function () {
    if (typeof VANTA === 'undefined' || !VANTA.HALO) return;

    VANTA.HALO({
      el: '#vanta-bg',
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1.0,
      scaleMobile: 0.75,
      color: 0x4a2fa0,        /* Deep violet nebula ring */
      backgroundColor: 0x030308, /* Near-black space */
      amplitudeFactor: 2.0,
      size: 1.6,
      xOffset: 0,
      yOffset: 0.1
    });
  });
})();
