import { Link, type MetaFunction } from "react-router";
import { ArrowUpRight, Smartphone, Sparkles } from "lucide-react";
import { features } from "../data/features";
import { Reveal } from "../components/ui";

export const meta: MetaFunction = () => [
  { title: "The app | Community Connect" },
  {
    name: "description",
    content:
      "Explore events, communities, voice and video calls, conversations, tickets, and more with Community Connect.",
  },
];

export default function Features() {
  return (
    <>
      <section className="page-hero feature-hero">
        <div className="container">
          <span className="eyebrow">THE COMMUNITY CONNECT APP</span>
          <h1>
            More moments.
            <br />
            <em>More meaning.</em>
          </h1>
          <p>
            Your place for experiences, conversations, and the people you meet
            along the way.
          </p>
          <a className="button button-lime" href="#features">
            See what’s inside <ArrowUpRight size={18} />
          </a>
          <div className="hero-decoration" aria-hidden="true">
            <Sparkles strokeWidth={1} />
          </div>
        </div>
      </section>
      <section id="features" className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow green-text">BUILT AROUND REAL LIFE</span>
            <h2>
              Something for <em>every connection.</em>
            </h2>
          </div>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal
                className={`feature-tile feature-tile-${index % 4}`}
                key={feature.title}
              >
                <div className="feature-tile-top">
                  <span className="feature-icon">
                    <Icon size={28} strokeWidth={1.7} />
                  </span>
                  <span className="availability">{feature.availability}</span>
                </div>
                <span className="eyebrow">{feature.eyebrow}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </Reveal>
            );
          })}
        </div>
      </section>
      <section className="app-showcase">
        <div className="container showcase-grid">
          <div>
            <span className="eyebrow">THE APP IN YOUR POCKET</span>
            <h2>
              Take the good
              <br />
              <em>stuff with you.</em>
            </h2>
            <p>
              Browse events, join communities, chat, make voice and video calls,
              and keep your tickets together. Find Roomie from Home, Chat, or
              Profile to start your roommate search. Screenshots of the latest
              app screens are coming soon.
            </p>
            <Link to="/events" className="button button-dark">
              Explore events <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="showcase-placeholder">
            <Smartphone size={90} strokeWidth={1} />
            <span>YOUR COMMUNITY, EVERYWHERE</span>
            <span className="showcase-stamp" aria-hidden="true">
              <Sparkles strokeWidth={1} />
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
