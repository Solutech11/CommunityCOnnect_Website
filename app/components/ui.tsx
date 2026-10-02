import { ArrowUpRight, CalendarDays, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { formatDate, formatNaira } from "../lib/api";
import type { Event } from "../types";

export const EVENT_IMAGE =
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1400&q=85";

export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function EventCard({
  event,
  index = 0,
}: {
  event: Event;
  index?: number;
}) {
  const date = new Date(event.startsAt);
  return (
    <Link
      to={`/events/${event._id}`}
      className="event-card"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div
        className="event-card-image"
        style={{
          backgroundImage: `url("${event.coverImageUrl || EVENT_IMAGE}")`,
        }}
      >
        <span className="date-tile">
          <strong>
            {date.toLocaleDateString("en-NG", { day: "2-digit" })}
          </strong>
          <small>
            {date.toLocaleDateString("en-NG", { month: "short" }).toUpperCase()}
          </small>
        </span>
        <span className="event-card-arrow">
          <ArrowUpRight size={20} />
        </span>
      </div>
      <div className="event-card-content">
        <span className="eyebrow green-text">{event.activityType}</span>
        <h3>{event.title}</h3>
        <p>
          <MapPin size={15} /> {event.venueName}, {event.state}
        </p>
        <p>
          <CalendarDays size={15} /> {formatDate(event.startsAt)}
        </p>
      </div>
    </Link>
  );
}

export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="empty-state">
      <span className="empty-orbit" aria-hidden="true">
        <Sparkles size={44} strokeWidth={1.5} />
      </span>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

export function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}

export function TicketPrice({ priceKobo }: { priceKobo: number }) {
  return <strong>{priceKobo === 0 ? "Free" : formatNaira(priceKobo)}</strong>;
}
