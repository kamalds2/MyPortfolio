import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer__brand">
          <h3 className="footer__title">Portfolio</h3>
          <p className="footer__text">
            Crafted with passion and powered by modern web technologies.
          </p>
        </div>
        
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} Portfolio Application. All rights reserved.
          </p>
          <div className="footer__links">
            <a href="#privacy" className="footer__link">Privacy Policy</a>
            <span className="footer__separator">•</span>
            <a href="#terms" className="footer__link">Terms of Service</a>
            <span className="footer__separator">•</span>
            <a href="#contact" className="footer__link">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
