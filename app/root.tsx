import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { AuthProvider, useAuth } from "./lib/auth";
import "./styles.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/app-icon.png" />
        <link rel="apple-touch-icon" href="/app-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function Header() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/events", label: "Explore events" },
    { to: "/features", label: "The app" },
    { to: "/ai", label: "Community AI" },
  ];
  return (
    <header className="site-header">
      <div className="nav-shell container">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            <img src="/community-connect-mark.svg" alt="" aria-hidden="true" />
          </span>
          <span>
            community<span className="brand-second">connect</span>
          </span>
        </NavLink>
        <nav
          className={open ? "main-nav open" : "main-nav"}
          aria-label="Primary navigation"
        >
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <>
              <NavLink to="/tickets" onClick={() => setOpen(false)}>
                My tickets
              </NavLink>
              <button
                className="nav-signout"
                onClick={() => {
                  void signOut();
                  setOpen(false);
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setOpen(false)}
              className="mobile-login"
            >
              Log in
            </NavLink>
          )}
        </nav>
        <div className="nav-actions">
          {user ? (
            <NavLink className="nav-user" to="/tickets">
              Hi, {user.firstName}
            </NavLink>
          ) : (
            <NavLink className="nav-login" to="/login">
              Log in
            </NavLink>
          )}
          <NavLink to="/events" className="button button-dark nav-cta">
            Find your next thing <ArrowRight size={15} />
          </NavLink>
        </div>
        <button
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <div className="footer-symbol">
            <img src="/community-connect-mark.svg" alt="" aria-hidden="true" />
          </div>
          <h2>
            Good things happen
            <br />
            <em>together.</em>
          </h2>
          <p>Find the moments. Meet the people. Make the memories.</p>
        </div>
        <div className="footer-links">
          <div>
            <strong>Discover</strong>
            <NavLink to="/events">Explore events</NavLink>
            <NavLink to="/features">The app</NavLink>
            <NavLink to="/ai">Community AI</NavLink>
          </div>
          <div>
            <strong>Your account</strong>
            <NavLink to="/register">Join Community Connect</NavLink>
            <NavLink to="/tickets">My tickets</NavLink>
            <NavLink to="/login">Log in</NavLink>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Community Connect</span>
        <span>Made for the moments that bring us together.</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </AuthProvider>
  );
}

export function ErrorBoundary({ error }: { error: unknown }) {
  const status = isRouteErrorResponse(error) ? error.status : 500;
  return (
    <div className="page-error container">
      <span className="eyebrow">SOMETHING WENT WRONG</span>
      <h1>
        {status === 404
          ? "We couldn't find that page."
          : "This page needs a moment."}
      </h1>
      <p>
        {status === 404
          ? "The link may have changed or the event is no longer available."
          : "Please try again shortly."}
      </p>
      <a className="button button-dark" href="/">
        Back to home <ArrowRight size={16} />
      </a>
    </div>
  );
}
