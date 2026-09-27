import { useEffect, useState } from "react";
import { Link, useParams, type MetaFunction } from "react-router";
import { ArrowUpRight, CircleCheck, Clock3, LoaderCircle } from "lucide-react";
import { protectedRequest, useAuth } from "../lib/auth";
import type { TicketOrder } from "../types";

export const meta: MetaFunction = () => [{ title: "Checking your payment | Community Connect" }, { name: "robots", content: "noindex" }];
export default function CheckoutReturn() {
  const { orderNumber } = useParams(); const { user, restoring } = useAuth();
  const [order, setOrder] = useState<TicketOrder | null>(null); const [error, setError] = useState(""); const [busy, setBusy] = useState(true);
  const verify = async () => {
    if (!orderNumber) return;
    setBusy(true); setError("");
    try { const result = await protectedRequest<{ order: TicketOrder }>(`/tickets/${encodeURIComponent(orderNumber)}/verify`); setOrder(result.order); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Payment could not be checked."); }
    finally { setBusy(false); }
  };
  useEffect(() => { if (!restoring && user) void verify(); else if (!restoring) setBusy(false); }, [restoring, user, orderNumber]);
  return <section className="checkout-page"><div className="checkout-card">{busy || restoring ? <><span className="checkout-symbol spin" aria-hidden="true"><LoaderCircle size={52} strokeWidth={1.5} /></span><h1>Checking your payment.</h1><p>We’re asking the server to confirm your ticket.</p></> : !user ? <><Clock3 size={48} /><h1>Sign in to finish.</h1><p>Use the account you bought the ticket with, then return here to verify your order.</p><Link className="button button-dark" to={`/login?next=${encodeURIComponent(`/checkout/return/${orderNumber}`)}`}>Log in <ArrowUpRight size={17} /></Link></> : order?.status === "paid" ? <><CircleCheck size={50} className="green-text" /><h1>You’re going!</h1><p>Your payment is confirmed. Your QR ticket is ready.</p><Link className="button button-lime" to={`/tickets/${orderNumber}`}>View your ticket <ArrowUpRight size={17} /></Link></> : <><Clock3 size={48} /><h1>We’re still checking.</h1><p>{error || "Your payment has not been confirmed yet. If you just paid, it may take a moment to appear."}</p><button className="button button-dark" onClick={() => void verify()}>Check again <ArrowUpRight size={17} /></button><Link to="/tickets" className="text-link">My tickets</Link></>}</div></section>;
}

