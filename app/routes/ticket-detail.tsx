import { useEffect, useState } from "react";
import { Link, useParams, type MetaFunction } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { EVENT_IMAGE, EmptyState } from "../components/ui";
import { formatDate } from "../lib/api";
import { protectedRequest, useAuth } from "../lib/auth";
import type { TicketOrder } from "../types";

export const meta: MetaFunction = () => [
  { title: "Your ticket | Community Connect" },
  { name: "robots", content: "noindex" },
];
export default function TicketDetail() {
  const { orderNumber } = useParams();
  const { user, restoring } = useAuth();
  const [order, setOrder] = useState<TicketOrder | null>(null);
  const [qrToken, setQrToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const resumeCheckout = async () => {
    if (!orderNumber || retrying) return;
    setRetrying(true);
    setError("");
    try {
      const result = await protectedRequest<{
        outcome: "already_paid" | "checkout_ready";
        checkoutUrl?: string;
      }>(`/tickets/${encodeURIComponent(orderNumber)}/checkout`, {
        method: "POST",
        headers: { "Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify({}),
      });
      if (result.outcome === "already_paid") {
        window.location.assign(`/checkout/return/${orderNumber}`);
        return;
      }
      if (result.checkoutUrl) {
        window.location.assign(result.checkoutUrl);
        return;
      }
      setError("Checkout is not ready. Please try again shortly.");
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Checkout could not be resumed.",
      );
    } finally {
      setRetrying(false);
    }
  };
  useEffect(() => {
    if (restoring) return;
    if (!user || !orderNumber) {
      setLoading(false);
      return;
    }
    let active = true;
    void protectedRequest<{ order: TicketOrder; qrToken?: string }>(
      `/tickets/${encodeURIComponent(orderNumber)}`,
    )
      .then((data) => {
        if (active) {
          setOrder(data.order);
          setQrToken(data.qrToken || "");
        }
      })
      .catch((failure: Error) => {
        if (active) setError(failure.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user, restoring, orderNumber]);
  return (
    <section className="section container ticket-detail-page">
      <Link to="/tickets" className="back-link dark">
        <ArrowLeft size={16} /> My tickets
      </Link>
      {loading || restoring ? (
        <div className="loading-row">Opening your ticket…</div>
      ) : !user ? (
        <EmptyState
          title="Sign in to view your ticket"
          message="Your ticket and QR code are private to your account."
        />
      ) : !order ? (
        <EmptyState
          title="Ticket unavailable"
          message={error || "We couldn’t find that order in your account."}
        />
      ) : (
        <div className="ticket-detail-card">
          <div
            className="ticket-detail-cover"
            style={{
              backgroundImage: `url("${order.eventId?.coverImageUrl || EVENT_IMAGE}")`,
            }}
          />
          <div className="ticket-detail-content">
            <span className="eyebrow green-text">COMMUNITY CONNECT TICKET</span>
            <h1>{order.eventId?.title || "Your event"}</h1>
            <div className="detail-facts">
              <div>
                <CalendarDays />
                <span>
                  <strong>When</strong>
                  {order.eventId?.startsAt
                    ? formatDate(order.eventId.startsAt)
                    : "Date unavailable"}
                </span>
              </div>
              <div>
                <MapPin />
                <span>
                  <strong>Where</strong>
                  {order.eventId?.venueName}, {order.eventId?.state}
                </span>
              </div>
            </div>
            <div className="ticket-metadata">
              <span>
                <strong>Ticket</strong>
                {order.ticketTypeId?.title}
              </span>
              <span>
                <strong>Quantity</strong>
                {order.quantity}
              </span>
              <span>
                <strong>Status</strong>
                {order.status}
              </span>
            </div>
            {order.status === "paid" && qrToken ? (
              <div className="qr-wrap">
                <div role="img" aria-label="Ticket QR code for event check-in">
                  <QRCodeSVG value={qrToken} size={200} marginSize={1} />
                </div>
                <p>Show this QR code at the event entrance.</p>
              </div>
            ) : (
              <div className="pending-note">
                {order.status === "paid"
                  ? "Your QR code is unavailable. Please try again shortly."
                  : "Payment has not been confirmed yet. Your QR code will appear after verification."}
              </div>
            )}
            {order.status === "pending" && (
              <button
                className="button button-dark"
                disabled={retrying}
                onClick={() => void resumeCheckout()}
              >
                {retrying ? "Checking checkout…" : "Resume checkout"}
              </button>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <p className="ticket-order">Order {order.orderNumber}</p>
          </div>
        </div>
      )}
    </section>
  );
}
