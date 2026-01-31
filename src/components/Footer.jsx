import React from 'react';

export default function Footer({ profile = {} }) {
  const currentYear = new Date().getFullYear();
  const name = profile.name || 'Developer';
  
  const socialLinks = [
    {
      name: 'GitHub',
      url: profile.github,
      icon: '🔗',
      aria: 'GitHub Profile'
    },
    {
      name: 'LinkedIn',
      url: profile.linkedin,
      icon: '💼',
      aria: 'LinkedIn Profile'
    },
    {
      name: 'Twitter',
      url: profile.twitter,
      icon: '🐦',
      aria: 'Twitter Profile'
    },
    {
      name: 'Email',
      url: profile.email ? `mailto:${profile.email}` : null,
      icon: '✉️',
      aria: 'Send Email'
    },
    {
      name: 'Portfolio',
      url: profile.website,
      icon: '🌐',
      aria: 'Personal Website'
    }
  ].filter(link => link.url);

  const quickLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' }
  ];

  const handleLinkClick = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Top Section */}
        <div className="footer__top">
          <div className="footer__brand">
            <h3 className="footer__name">{name}</h3>
            <p className="footer__tagline">
              {profile.tagline || profile.bio || 'Building amazing digital experiences'}
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="footer__links">
            <h4 className="footer__section-title">Quick Links</h4>
            <nav className="footer__nav">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleLinkClick(link.href)}
                  className="footer__nav-link"
                  aria-label={`Navigate to ${link.name} section`}
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Social Links */}
          <div className="footer__social">
            <h4 className="footer__section-title">Connect</h4>
            <div className="footer__social-links">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-link"
                  aria-label={link.aria}
                  title={link.name}
                >
                  <span className="footer__social-icon">{link.icon}</span>
                  <span className="footer__social-name">{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="footer__divider"></div>
        
        {/* Bottom Section */}
        <div className="footer__bottom">
          <div className="footer__copyright">
            <p>© {currentYear} {name}. All rights reserved.</p>
          </div>
          
          <div className="footer__tech">
            <p>
              Built with  using{' '}
              <span className="footer__tech-highlight">React</span>
              {' & '}
              <span className="footer__tech-highlight">Vite</span>
            </p>
          </div>
          
          <div className="footer__scroll-top">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="footer__scroll-button"
              aria-label="Scroll to top"
              title="Back to top"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .footer {
          background: linear-gradient(135deg, var(--surface-primary) 0%, var(--surface-secondary) 100%);
          border-top: 1px solid var(--border-primary);
          margin-top: auto;
          padding: var(--space-12) 0 var(--space-6);
        }
        
        .footer__container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--space-6);
        }
        
        .footer__top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: var(--space-8);
          margin-bottom: var(--space-8);
        }
        
        @media (max-width: 768px) {
          .footer__top {
            grid-template-columns: 1fr;
            gap: var(--space-6);
            text-align: center;
          }
        }
        
        .footer__brand h3 {
          font-size: 1.5rem;
          font-weight: 700;
          background: #017667;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--space-3);
        }
        
        .footer__tagline {
          color: #595960;
          font-size: 1rem;
          line-height: 1.6;
          margin: 0;
        }
        
        .footer__section-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #017667;
          margin-bottom: var(--space-4);
        }
        
        .footer__nav {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        
        .footer__nav-link {
          background: none;
          border: none;
          color:  #595960;
          font-size: 0.95rem;
          text-align: left;
          cursor: pointer;
          padding: var(--space-1) 0;
          transition: color 0.2s ease;
        }
        
        .footer__nav-link:hover {
          color:  #4bd4e3;
        }
        
        .footer__social-links {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        
        .footer__social-link {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color:  #181818;
          text-decoration: none;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }
        
        .footer__social-link:hover {
          color:  #595960;
          transform: translateX(4px);
        }
        
        .footer__social-icon {
          font-size: 1.1rem;
        }
        
        .footer__divider {
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            var(--border-primary) 50%,
            transparent 100%
          );
          margin: var(--space-8) 0;
        }
        
        .footer__bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-4);
        }
        
        @media (max-width: 768px) {
          .footer__bottom {
            flex-direction: column;
            text-align: center;
            gap: var(--space-3);
          }
        }
        
        .footer__copyright p,
        .footer__tech p {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        
        .footer__tech-highlight {
          color:  #595960;
          font-weight: 600;
        }
        
        .footer__scroll-button {
          background:  #017667;
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: bold;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .footer__scroll-button:hover {
          background: #764701;
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
        
        .footer__scroll-button:active {
          transform: translateY(0);
        }
      `}</style>
    </footer>
  );
}