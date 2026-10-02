import { useRef, useState } from "react";
import {
  Link,
  useLoaderData,
  useNavigate,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  MapPin,
  ShieldCheck,
  Ticket as TicketIcon,
} from "lucide-react";
import { EVENT_IMAGE, TicketPrice } from "../components/ui";
import { formatDate, getEvent } from "../lib/api";
import { protectedRequest, useAuth } from "../lib/auth";
import { renderEmphasis } from "../lib/text";
import type { TicketOrder } from "../types";

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.eventId) throw new Response("Event not found", { status: 404 });
  try {
    return await getEvent(params.eventId);
  } catch {
    throw new Response("Event not found", { status: 404 });
  }
}
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const event = data?.event;
  if (!event) return [{ title: "Event | Community Connect" }];
  const description = event.description.slice(0, 160);
  return [
    { title: `${event.title} | Community Connect` },
    { name: "description", content: description },
    { property: "og:title", content: event.title },
    { property: "og:description", content: description },
    { property: "og:image", content: event.coverImageUrl || EVENT_IMAGE },
    { property: "og:type", content: "event" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
};

export default function EventDetail() {
  const { event, ticketTypes } = useLoaderData<typeof loader>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticketTypeId, setTicketTypeId] = useState(ticketTypes[0]?._id || "");
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const orderAttempt = useRef<{ selection: string; key: string } | null>(null);
  const selected = ticketTypes.find((ticket) => ticket._id === ticketTypeId);
  const upcoming = new Date(event.startsAt).getTime() > Date.now();

  const buy = async () => {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(`/events/${event._id}`)}`);
      return;
    }
    if (!selected || busy) return;
    setBusy(true);
    setError("");
    try {
      const selection = `${ticketTypeId}:${quantity}`;
      if (orderAttempt.current?.selection !== selection) {
        orderAttempt.current = { selection, key: crypto.randomUUID() };
      }
      const result = await protectedRequest<{
        order: TicketOrder;
        checkoutUrl?: string;
      }>(`/events/${event._id}/orders`, {
        method: "POST",
        headers: { "Idempotency-Key": orderAttempt.current.key },
        body: JSON.stringify({ ticketTypeId, quantity, client: "web" }),
      });
      if (result.order.status === "paid") {
        navigate(`/tickets/${result.order.orderNumber}`);
        return;
      }
      if (result.checkoutUrl) {
        window.location.assign(result.checkoutUrl);
        return;
      }
      navigate(`/checkout/return/${result.order.orderNumber}`);
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Ticket checkout could not start.",
      );
      setBusy(false);
    }
  };

  return (
    <>
      <section className="event-detail-hero">
        <div
          className="event-detail-image"
          style={{
            backgroundImage: `url("${event.coverImageUrl || EVENT_IMAGE}")`,
          }}
        />
        <div className="event-detail-shade" />
        <div className="container event-detail-heading">
          <Link to="/events" className="back-link">
            <ArrowLeft size={16} /> All events
          </Link>
          <span className="eyebrow">
            {event.activityType} · {event.state}
          </span>
          <h1>{event.title}</h1>
          <p>
            <CalendarDays size={18} /> {formatDate(event.startsAt)}
          </p>
        </div>
      </section>
      <section className="section container detail-grid">
        <div className="detail-copy">
          <span className="eyebrow green-text">THE EXPERIENCE</span>
          <h2>About this event</h2>
          <p className="event-description">
            {renderEmphasis(event.description)}
          </p>
          <div className="detail-facts">
            <div>
              <CalendarDays />
              <span>
                <strong>When</strong>
                {formatDate(event.startsAt)} to {formatDate(event.endsAt)}
              </span>
            </div>
            <div>
              <MapPin />
              <span>
                <strong>Where</strong>
                {event.venueName}, {event.address}, {event.state}
              </span>
            </div>
          </div>
        </div>
        <aside className="ticket-panel">
          <div className="ticket-panel-head">
            <TicketIcon />
            <span>YOUR PLACE IS HERE</span>
          </div>
          <h3>{upcoming ? "Join the moment." : "This moment has passed."}</h3>
          {upcoming && ticketTypes.length ? (
            <>
              <label className="field">
                <span>Choose a ticket</span>
                <select
                  value={ticketTypeId}
                  onChange={(event) => setTicketTypeId(event.target.value)}
                >
                  {ticketTypes.map((ticket) => (
                    <option key={ticket._id} value={ticket._id}>
                      {ticket.title} ·{" "}
                      {ticket.priceKobo === 0
                        ? "Free"
                        : `₦${(ticket.priceKobo / 100).toLocaleString("en-NG")}`}
                    </option>
                  ))}
                </select>
              </label>
              {selected?.description && <p>{selected.description}</p>}
              <label className="field">
                <span>Quantity</span>
                <select
                  value={quantity}
                  onChange={(event) => setQuantity(Number(event.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((count) => (
                    <option key={count}>{count}</option>
                  ))}
                </select>
              </label>
              <div className="ticket-total">
                <span>
                  {quantity} {quantity === 1 ? "ticket" : "tickets"}
                </span>
                <TicketPrice
                  priceKobo={(selected?.priceKobo || 0) * quantity}
                />
              </div>
              <p className="fee-note">Any platform fee appears at checkout.</p>
              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}
              <button
                className="button button-lime full-width"
                disabled={busy}
                onClick={() => void buy()}
              >
                {busy
                  ? "Getting your ticket…"
                  : user
                    ? "Get tickets"
                    : "Log in to get tickets"}{" "}
                <ArrowUpRight size={18} />
              </button>
              <p className="secure-note">
                <ShieldCheck size={16} /> Payment is verified before your QR
                ticket appears.
              </p>
            </>
          ) : (
            <p>
              {upcoming
                ? "Tickets are not available yet."
                : "Explore upcoming events to find your next moment."}
            </p>
          )}
        </aside>
      </section>
    </>
  );
}
