import {
  CalendarDays,
  Compass,
  HeartHandshake,
  MessageCircle,
  Sparkles,
  Ticket,
  Users,
  Video,
  Wallet,
} from "lucide-react";

// Update this catalog whenever a mobile feature launches or materially changes.
export const features = [
  {
    title: "Find your roomie",
    eyebrow: "ROOMMATES",
    description:
      "Open Roomie from Home, Chat, or Profile. Set up your area, annual rent share, move-in window, and lifestyle in three guided sections, then explore compatible profiles. Mutual likes unlock chat. Contacts require separate consent, and accepting a roommate makes both profiles private.",
    icon: HeartHandshake,
    availability: "Coming in the next app release",
  },
  {
    title: "Find your people",
    eyebrow: "COMMUNITIES",
    description:
      "Join spaces built around shared interests, read community posts and announcements, and keep conversations going. Organizers can publish image-backed updates. Recently loaded lists, profiles, updates, and room messages are saved on your device, restored after app reloads, and refreshed in the background. Signing out clears the saved cache.",
    icon: Users,
    availability: "In the app",
  },
  {
    title: "Connect face to face",
    eyebrow: "COMMUNITY CALLS",
    description:
      "Join live voice and video calls in community rooms. Members viewing a room see an incoming call prompt with quick controls to join or dismiss. Video calls feature a prominent participant view, a floating self-preview, and compact controls.",
    icon: Video,
    availability: "In the app",
  },
  {
    title: "Discover what moves you",
    eyebrow: "EVENTS",
    description:
      "Explore local gatherings and experiences, from intimate meetups to big city moments.",
    icon: Compass,
    availability: "App + web",
  },
  {
    title: "Create the moment",
    eyebrow: "HOSTING",
    description:
      "Bring an event idea to life with event publishing, ticket types, and attendee tools.",
    icon: CalendarDays,
    availability: "In the app",
  },
  {
    title: "Keep your ticket close",
    eyebrow: "TICKETS",
    description:
      "Buy a ticket on web or mobile, find it in the app, and share a watermarked PDF of your paid QR ticket from your phone.",
    icon: Ticket,
    availability: "App + web",
  },
  {
    title: "Ask Community AI",
    eyebrow: "AI COMPANION",
    description:
      "Get help exploring events and understanding Community Connect. Sign in for personal conversations.",
    icon: Sparkles,
    availability: "App + web",
  },
  {
    title: "Stay in the loop",
    eyebrow: "CHAT",
    description:
      "Talk one to one and in community rooms, with live messages and typing while connected. Recent conversations and message history are saved on your device and restored after app reloads while fresh data loads in the background. Signing out clears the saved cache.",
    icon: MessageCircle,
    availability: "In the app",
  },
  {
    title: "Make it yours",
    eyebrow: "PROFILE",
    description:
      "Keep your personal details current, and find your Nigerian state, local government area, interests, and hobbies with searchable pickers that stay visible while you type.",
    icon: Users,
    availability: "In the app",
  },
  {
    title: "More ways to connect",
    eyebrow: "FRIENDS",
    description:
      "Find familiar faces, browse member suggestions, manage incoming requests, and start a conversation with your friends. Member cards show account names and profile photos when available.",
    icon: HeartHandshake,
    availability: "In the app",
  },
  {
    title: "Everything in one place",
    eyebrow: "WALLET",
    description:
      "Manage your Community Connect wallet and activity from the mobile app.",
    icon: Wallet,
    availability: "In the app",
  },
] as const;
