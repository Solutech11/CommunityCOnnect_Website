import { useEffect, useState } from "react";
import { Link, type MetaFunction } from "react-router";
import { ArrowUpRight, CalendarDays, Ticket as TicketIcon } from "lucide-react";
import { EmptyState, EVENT_IMAGE } from "../components/ui";
import { formatDate } from "../lib/api";
import { protectedRequest, useAuth } from "../lib/auth";
import type { TicketOrder } from "../types";

export const meta: MetaFunction = () => [
  { title: "My tickets | Community Connect" },
];
export default function Tickets() {
  const { user, restoring } = useAuth();
  const [tickets, setTickets] = useState<TicketOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (restoring) return;
    if (!user) {
      setLoading(false);
      return;
    }
    let active = true;
    void protectedRequest<{ tickets: TicketOrder[] }>("/tickets")
      .then((data) => {
        if (active) setTickets(data.tickets);
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
  }, [user, restoring]);
  return (
    <>
      <section className="page-hero tickets-hero">
        <div className="container">
          <span className="eyebrow">YOUR NEXT MOMENTS</span>
          <h1>
            All your plans.
            <br />
            <em>One place.</em>
          </h1>
          <p>Keep every ticket close and bring your QR code to the door.</p>
        </div>
      </section>
      <section className="section container">
        <div className="listing-heading">
          <h2>My tickets</h2>
          <span>{tickets.length ? `${tickets.length} orders` : ""}</span>
        </div>
        {restoring || loading ? (
          <div className="loading-row">Finding your tickets…</div>
        ) : !user ? (
          <div className="empty-state">
            <span className="empty-orbit" aria-hidden="true">
              <TicketIcon size={44} strokeWidth={1.5} />
            </span>
            <h3>Let’s get you signed in</h3>
            <p>Log in to find your tickets.</p>
            <Link className="button button-dark" to="/login?next=%2Ftickets">
              Log in <ArrowUpRight size={17} />
            </Link>
          </div>
        ) : error ? (
          <EmptyState title="Tickets need a moment" message={error} />
        ) : tickets.length ? (
          <div className="ticket-list">
            {tickets.map((ticket) => (
              <Link
                className="my-ticket"
                key={ticket.orderNumber}
                to={`/tickets/${ticket.orderNumber}`}
              >
                <img
                  src={ticket.eventId?.coverImageUrl || EVENT_IMAGE}
                  alt=""
                />
                <div>
                  <span className="eyebrow green-text">
                    {ticket.status.toUpperCase()} · {ticket.quantity}{" "}
                    {ticket.quantity === 1 ? "TICKET" : "TICKETS"}
                  </span>
                  <h3>{ticket.eventId?.title || "Community Connect event"}</h3>
                  <p>
                    <CalendarDays size={15} />{" "}
                    {ticket.eventId?.startsAt
                      ? formatDate(ticket.eventId.startsAt)
                      : "Date unavailable"}
                  </p>
                  <span className="ticket-order">{ticket.orderNumber}</span>
                </div>
                <TicketIcon size={25} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-orbit" aria-hidden="true">
              <TicketIcon size={44} strokeWidth={1.5} />
            </span>
            <h3>No tickets yet</h3>
            <p>Your next great plan is waiting. Explore what’s happening.</p>
            <Link className="button button-dark" to="/events">
              Explore events <ArrowUpRight size={17} />
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
