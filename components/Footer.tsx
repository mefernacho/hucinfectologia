
import React from 'react';

export default function Footer() {
  const footerStyle: React.CSSProperties = {
    fontFamily: 'Calibri, sans-serif',
    // The font size '7' is not a standard CSS value. Using 'text-xs' (12px) for a small, readable size.
    fontSize: '0.7rem', // Approx. 11.2px, closer to a 'size 7' feel.
    textShadow: '0 0 4px rgba(0, 191, 255, 0.7)', // Neon blue glow
  };

  return (
    <footer className="bg-brand-gray text-white text-center p-3 w-full">
      <p style={footerStyle}>
        Derechos Reservados Dra. María Alvarado Bruzual 2025/ Desarrollo libre e independiente. Plataforma para el uso de Estadistica Institucionales
      </p>
    </footer>
  );
}
