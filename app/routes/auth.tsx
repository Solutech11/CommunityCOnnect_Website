import { useState, type FormEvent } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
  type MetaFunction,
} from "react-router";
import { ArrowRight, LockKeyhole, UsersRound } from "lucide-react";
import { request } from "../lib/api";
import { Field } from "../components/ui";
import { useAuth } from "../lib/auth";

export const meta: MetaFunction = ({ location }) => [
  {
    title: `${location.pathname.includes("register") ? "Join" : location.pathname.includes("verify") ? "Verify email" : location.pathname.includes("password") ? "Password help" : "Log in"} | Community Connect`,
  },
];

export default function Auth() {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, verifyEmail } = useAuth();
  const mode = pathname.slice(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(params.get("email") || "");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const next = params.get("next");
  const destination =
    next?.startsWith("/") && !next.startsWith("//") ? next : "/tickets";
  const title =
    mode === "register"
      ? "Your people are waiting."
      : mode === "verify-email"
        ? "One little check."
        : mode === "forgot-password"
          ? "Let’s get you back."
          : mode === "reset-password"
            ? "Start fresh."
            : "Welcome back.";
  const intro =
    mode === "register"
      ? "Create your account to buy tickets and keep your next adventures close."
      : mode === "verify-email"
        ? "Enter the six digit code sent to your inbox."
        : mode === "forgot-password"
          ? "We’ll send a reset code if there’s an account with this email."
          : mode === "reset-password"
            ? "Enter your email, the reset code, and a new password."
            : "Your next good moment is right around the corner.";
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      if (mode === "register") {
        await request("/auth/register", {
          method: "POST",
          body: JSON.stringify({ firstName, lastName, email, password }),
        });
        navigate(
          `/verify-email?email=${encodeURIComponent(email)}${next ? `&next=${encodeURIComponent(next)}` : ""}`,
        );
        return;
      }
      if (mode === "verify-email") {
        await verifyEmail(email, otp);
        navigate(destination);
        return;
      }
      if (mode === "forgot-password") {
        await request("/auth/forgot-password", {
          method: "POST",
          body: JSON.stringify({ email }),
        });
        setSent(true);
        return;
      }
      if (mode === "reset-password") {
        await request("/auth/reset-password", {
          method: "POST",
          body: JSON.stringify({ email, otp, newPassword: password }),
        });
        navigate("/login");
        return;
      }
      await signIn(email, password);
      navigate(destination);
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="auth-page">
      <div className="container auth-layout">
        <div className="auth-art">
          <span className="eyebrow">THE GOOD STUFF STARTS HERE</span>
          <div className="auth-asterisk" aria-hidden="true">
            <UsersRound strokeWidth={1} />
          </div>
          <h2>
            Better
            <br />
            <em>together.</em>
          </h2>
          <p>Real people. Great plans. A world of moments to make your own.</p>
        </div>
        <div className="auth-form-panel">
          <span className="auth-lock">
            <LockKeyhole size={20} />
          </span>
          <h1>{title}</h1>
          <p>{intro}</p>
          {sent ? (
            <div className="auth-success">
              <strong>Check your inbox.</strong>
              <p>If this email has an account, a reset code is on its way.</p>
              <Link
                to={`/reset-password?email=${encodeURIComponent(email)}`}
                className="button button-dark"
              >
                Enter reset code <ArrowRight size={17} />
              </Link>
            </div>
          ) : (
            <form onSubmit={(event) => void submit(event)}>
              {mode === "register" && (
                <div className="field-row">
                  <Field
                    label="First name"
                    required
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                  <Field
                    label="Last name"
                    required
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </div>
              )}
              <Field
                label="Email address"
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              {(mode === "verify-email" || mode === "reset-password") && (
                <Field
                  label="Six digit code"
                  required
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                />
              )}
              {(mode === "register" ||
                mode === "login" ||
                mode === "reset-password") && (
                <Field
                  label={
                    mode === "reset-password" ? "New password" : "Password"
                  }
                  required
                  type="password"
                  minLength={mode === "login" ? 1 : 8}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              )}
              {mode === "register" && (
                <p className="field-help">
                  Use at least 8 characters, with uppercase, lowercase, a
                  number, and a symbol.
                </p>
              )}
              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}
              <button disabled={busy} className="button button-lime full-width">
                {busy
                  ? "Just a moment…"
                  : mode === "register"
                    ? "Create account"
                    : mode === "verify-email"
                      ? "Verify and continue"
                      : mode === "forgot-password"
                        ? "Send reset code"
                        : mode === "reset-password"
                          ? "Reset password"
                          : "Log in"}{" "}
                <ArrowRight size={17} />
              </button>
            </form>
          )}
          <div className="auth-links">
            {mode === "login" ? (
              <>
                <Link to="/forgot-password">Forgot password?</Link>
                <span>
                  New here?{" "}
                  <Link
                    to={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`}
                  >
                    Join Community Connect
                  </Link>
                </span>
              </>
            ) : mode === "register" ? (
              <span>
                Already have an account? <Link to="/login">Log in</Link>
              </span>
            ) : (
              <Link to="/login">Back to log in</Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
