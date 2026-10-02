import { useEffect, useState } from "react";
import { useSearchParams, type MetaFunction } from "react-router";
import { discoverEvents } from "../lib/api";
import { EmptyState, EventCard } from "../components/ui";
import type { Event } from "../types";

export const meta: MetaFunction = () => [
  { title: "Discover events | Community Connect" },
  {
    name: "description",
    content:
      "Explore trending, recently added, and past Community Connect events across Nigeria.",
  },
];

type Section = "trending" | "recent" | "past";
export default function Events() {
  const [params, setParams] = useSearchParams();
  const section =
    (["trending", "recent", "past"] as const).find(
      (value) => value === params.get("section"),
    ) || "trending";
  const state = params.get("state") || "";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const [events, setEvents] = useState<Event[]>([]);
  const [total, setTotal] = useState(0);
  const [states, setStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void import("../lib/geo").then((geo) => setStates(geo.states));
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    void discoverEvents(section, state || undefined, page)
      .then((result) => {
        if (!controller.signal.aborted) {
          setEvents(result.events);
          setTotal(result.pagination.total);
        }
      })
      .catch((failure: Error) => {
        if (!controller.signal.aborted) setError(failure.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [section, state, page]);
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
  };
  return (
    <>
      <section className="page-hero events-hero">
        <div className="container">
          <span className="eyebrow">FIND YOUR NEXT STORY</span>
          <h1>
            Good plans
            <br />
            <em>start here.</em>
          </h1>
          <p>
            Real events, real people, and experiences worth making time for.
          </p>
        </div>
      </section>
      <section className="section container">
        <div className="discover-toolbar">
          <div className="tabs" role="group" aria-label="Event section">
            {(["trending", "recent", "past"] as const).map((item) => (
              <button
                key={item}
                className={section === item ? "active" : ""}
                onClick={() => update("section", item)}
              >
                {item === "recent"
                  ? "Just added"
                  : item === "past"
                    ? "Past moments"
                    : "Trending"}
              </button>
            ))}
          </div>
          <label className="select-pill">
            State{" "}
            <select
              value={state}
              onChange={(event) => update("state", event.target.value)}
              aria-label="Filter by state"
            >
              <option value="">All states</option>
              {states.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="listing-heading">
          <h2>
            {section === "past"
              ? "Moments we made."
              : section === "recent"
                ? "Fresh on the calendar."
                : "What’s making waves."}
          </h2>
          <span>
            {!loading && !error
              ? `${total} ${total === 1 ? "event" : "events"}`
              : ""}
          </span>
        </div>
        {error ? (
          <EmptyState title="Events need a moment" message={error} />
        ) : loading ? (
          <div className="loading-row">Looking for events…</div>
        ) : events.length ? (
          <>
            <div className="event-grid">
              {events.map((event, index) => (
                <EventCard key={event._id} event={event} index={index} />
              ))}
            </div>
            <div className="pagination">
              <button
                disabled={page <= 1}
                onClick={() => update("page", String(page - 1))}
              >
                Previous
              </button>
              <span>Page {page}</span>
              <button
                disabled={page * 12 >= total}
                onClick={() => update("page", String(page + 1))}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <EmptyState
            title={
              section === "past"
                ? "No past events here yet"
                : "The calendar is waiting for a spark"
            }
            message="Organizers have not published events in this view yet. Try another state or check back soon."
          />
        )}
      </section>
    </>
  );
}
