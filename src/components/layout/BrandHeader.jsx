import React from 'react';

export default function BrandHeader() {
  return (
    <header className="w-full">
      <div className="maintenance-hero" aria-labelledby="maintenance-hero-title">
        <div className="maintenance-hero__content">
          <h1 id="maintenance-hero-title" className="maintenance-hero__title">
            PANEL DE MANTENIMIENTO
          </h1>
          <img
            src="/servifood_logo_white_text_HQ.png"
            alt="ServiFood Catering"
            className="maintenance-hero__logo"
            loading="lazy"
          />
        </div>
      </div>
    </header>
  );
}
