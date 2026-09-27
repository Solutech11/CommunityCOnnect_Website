import { useEffect, useRef, useState } from "react";
import { Link, useLoaderData, type MetaFunction } from "react-router";
import { ArrowRight, ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import { discoverEvents } from "../lib/api";
import type { Event } from "../types";
import { EmptyState, EventCard, Reveal } from "../components/ui";
import { features } from "../data/features";

export const meta: MetaFunction = () => [
  { title: "Community Connect | Find your people. Feel your city." },
  { name: "description", content: "Discover local events, buy tickets, and find your community with Community Connect." },
];

export async function loader() {
  try {
    const [trending, recent] = await Promise.all([
      discoverEvents("trending", "Lagos", 1, 3),
      discoverEvents("recent", undefined, 1, 3),
    ]);
    return { trending: trending.events, recent: recent.events, loadError: null };
  } catch {
    return { trending: [] as Event[], recent: [] as Event[], loadError: "Events are temporarily unavailable. Try again shortly." };
  }
}

export default function Home() {
  const data = useLoaderData<typeof loader>();
  const [state, setState] = useState("Lagos");
  const [stateOptions, setStateOptions] = useState<string[]>(["Lagos"]);
  const [trending, setTrending] = useState<Event[]>(data.trending);
  const [error, setError] = useState(data.loadError);
  const [loading, setLoading] = useState(false);
  const firstState = useRef(true);

  useEffect(() => {
    let active = true;
    void import("../lib/geo").then(({ states, stateAt }) => {
      if (!active) return;
      setStateOptions(states);
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition((position) => {
        if (!active) return;
        const found = stateAt(position.coords.latitude, position.coords.longitude);
        if (found) setState(found);
      }, () => { /* Manual state selection stays available. */ }, { timeout: 8000, maximumAge: 3600000 });
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (firstState.current) { firstState.current = false; return; }
    let active = true;
    setLoading(true);
    setError(null);
    void discoverEvents("trending", state, 1, 3).then((page) => {
      if (active) setTrending(page.events);
    }).catch(() => {
      if (active) setError("Events are temporarily unavailable. Try again shortly.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [state]);

  return <>
    <section className="hero"><div className="hero-photo" aria-hidden="true" /><div className="hero-wash" /><div className="container hero-inner"><div className="hero-copy"><div className="hero-kicker"><span className="sparkle-mini">✳</span> THE GOOD STUFF IS OUT THERE</div><h1>Find your people.<br /><span>Feel your city.</span></h1><p>More than just plans. Discover the events, communities, and connections that make life feel a little more alive.</p><div className="hero-actions"><Link className="button button-lime" to="/events">Explore what’s on <ArrowUpRight size={18} /></Link><Link className="text-link light" to="/features">Meet the app <ArrowRight size={17} /></Link></div><div className="hero-note"><div className="avatar-stack"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" alt="" /><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop" alt="" /><img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop" alt="" /></div><span>Made for real moments,<br />with real people.</span></div></div><div className="hero-orbit" aria-hidden="true"><span className="orbit-center">✳</span><span className="orbit-copy">GO OUT · GET TOGETHER · GO OUT · GET TOGETHER ·</span></div></div><div className="hero-bottom"><span>SCROLL TO EXPLORE</span><span>01 / 04</span></div></section>

    <section className="marquee-band" aria-label="Community Connect values"><div>GOOD PEOPLE <span>✳</span> GREAT PLANS <span>✳</span> REAL CONNECTIONS <span>✳</span> GOOD PEOPLE <span>✳</span> GREAT PLANS <span>✳</span></div></section>

    <section className="section events-section container"><Reveal className="section-heading"><div><span className="eyebrow green-text">YOUR CITY IS CALLING</span><h2>Good things are <em>happening.</em></h2><p>Find an experience worth leaving the house for.</p></div><Link to="/events" className="round-link" aria-label="Browse all events"><ArrowUpRight size={24} /></Link></Reveal><div className="section-toolbar"><div className="location-pill"><MapPin size={16} /> Top upcoming in <select aria-label="Select a state" value={state} onChange={(event) => setState(event.target.value)}>{stateOptions.map((option) => <option key={option}>{option}</option>)}</select></div><span className="toolbar-note">Picked from real events on Community Connect</span></div>{error ? <EmptyState title="Events need a moment" message={error} /> : loading ? <div className="loading-row">Finding events in {state}…</div> : trending.length ? <div className="event-grid">{trending.map((event, index) => <EventCard key={event._id} event={event} index={index} />)}</div> : <EmptyState title={`Nothing upcoming in ${state} yet`} message="New events will appear here as soon as organizers publish them. Try another state or check back soon." />}</section>

    <section className="story-section"><div className="container story-grid"><Reveal className="story-copy"><span className="eyebrow">BEYOND THE EVENT</span><h2>It starts with<br /><em>showing up.</em></h2><p>The best stories begin when someone says “let’s go.” Community Connect gives you a reason to get out, a way to find your people, and a place to keep the connection going.</p><Link to="/features" className="button button-outline-light">Explore the app <ArrowUpRight size={17} /></Link></Reveal><div className="story-visual"><img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85" alt="Friends spending time together outdoors" /><div className="story-sticker">BETTER<br />TOGETHER <span>✳</span></div></div></div></section>

    <section className="section feature-section container"><Reveal className="section-heading"><div><span className="eyebrow green-text">ONE APP. SO MANY POSSIBILITIES.</span><h2>Made for <em>connection.</em></h2><p>From finding a gathering to finding your people, there’s room for all of it.</p></div><Link className="text-link" to="/features">See every feature <ArrowRight size={18} /></Link></Reveal><div className="feature-preview-grid">{features.slice(0, 4).map((feature, index) => { const Icon = feature.icon; return <Reveal key={feature.title} className={`feature-preview feature-preview-${index}`}><div className="feature-icon"><Icon size={25} strokeWidth={1.8} /></div><span className="eyebrow">{feature.eyebrow}</span><h3>{feature.title}</h3><p>{feature.description}</p><span className="availability">{feature.availability}</span></Reveal>; })}</div></section>

    <section className="ai-spotlight"><div className="container ai-spotlight-inner"><Reveal><span className="eyebrow">A LITTLE HELP, RIGHT HERE</span><h2>Meet your new<br /><em>what’s next</em> person.</h2><p>Ask Community AI about the app, discover events, and find your way to the right moment. No perfect prompt required.</p><Link to="/ai" className="button button-dark">Talk to Community AI <Sparkles size={17} /></Link></Reveal><div className="ai-bubble-scene" aria-hidden="true"><div className="ai-bubble question">What’s happening near me?</div><div className="ai-bubble answer"><span>✳</span> Let’s find something you’ll love.</div><div className="ai-bubble orb">✳</div></div></div></section>

    <section className="section container recent-section"><Reveal className="section-heading"><div><span className="eyebrow green-text">JUST ADDED</span><h2>Fresh on the <em>calendar.</em></h2><p>Newly published experiences from the Community Connect community.</p></div><Link to="/events?section=recent" className="round-link" aria-label="Explore recently added events"><ArrowUpRight size={24} /></Link></Reveal>{data.loadError ? <EmptyState title="Events need a moment" message={data.loadError} /> : data.recent.length ? <div className="event-grid">{data.recent.map((event, index) => <EventCard key={event._id} event={event} index={index} />)}</div> : <EmptyState title="The calendar is getting ready" message="Recently published events will show up here soon." />}</section>

    <section className="download-section"><div className="container download-grid"><div><span className="eyebrow">KEEP THE CONNECTION GOING</span><h2>Take your world<br /><em>with you.</em></h2><p>Communities, conversations, events, and more are waiting in the Community Connect app.</p><div className="download-actions"><span className="store-pill">App Store <small>Coming soon</small></span><span className="store-pill">Google Play <small>Coming soon</small></span>{import.meta.env.VITE_APK_URL ? <a className="store-pill active" href={import.meta.env.VITE_APK_URL}>Download Android APK <ArrowUpRight size={14} /></a> : <span className="store-pill">Android APK <small>Coming soon</small></span>}</div></div><div className="download-visual"><div className="phone-frame"><div className="phone-camera" /><img src="https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=700&q=85" alt="Community event atmosphere in the app preview" /><div className="phone-overlay"><span>communityconnect ✳</span><strong>Where will you<br />show up next?</strong></div></div><div className="download-asterisk">✳</div></div></div></section>
  </>;
}
