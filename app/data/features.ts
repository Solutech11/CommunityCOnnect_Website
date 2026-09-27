import { CalendarDays, Compass, HeartHandshake, MessageCircle, Sparkles, Ticket, Users, Wallet } from "lucide-react";

// Update this catalog whenever a mobile feature launches or materially changes.
export const features = [
  { title: "Find your people", eyebrow: "COMMUNITIES", description: "Join spaces built around shared interests, make friends, and keep the conversation going.", icon: Users, availability: "In the app" },
  { title: "Discover what moves you", eyebrow: "EVENTS", description: "Explore local gatherings and experiences, from intimate meetups to big city moments.", icon: Compass, availability: "App + web" },
  { title: "Create the moment", eyebrow: "HOSTING", description: "Bring an event idea to life with event publishing, ticket types, and attendee tools.", icon: CalendarDays, availability: "In the app" },
  { title: "Keep your ticket close", eyebrow: "TICKETS", description: "Buy a ticket, find it later, and bring your QR code to the door.", icon: Ticket, availability: "App + web" },
  { title: "Ask Community AI", eyebrow: "AI COMPANION", description: "Get help exploring events and understanding Community Connect. Sign in for personal conversations.", icon: Sparkles, availability: "App + web" },
  { title: "Stay in the loop", eyebrow: "CHAT", description: "Talk one to one and in community rooms, with live updates around the things you care about.", icon: MessageCircle, availability: "In the app" },
  { title: "More ways to connect", eyebrow: "FRIENDS", description: "Grow your circle through friend requests, recommendations, and shared interests.", icon: HeartHandshake, availability: "In the app" },
  { title: "Everything in one place", eyebrow: "WALLET", description: "Manage your Community Connect wallet and activity from the mobile app.", icon: Wallet, availability: "In the app" },
] as const;
