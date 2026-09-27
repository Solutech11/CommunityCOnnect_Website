import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("features", "routes/features.tsx"),
  route("events", "routes/events.tsx"),
  route("events/:eventId", "routes/event-detail.tsx"),
  route("ai", "routes/ai.tsx"),
  route("login", "routes/auth.tsx", { id: "login" }),
  route("register", "routes/auth.tsx", { id: "register" }),
  route("verify-email", "routes/auth.tsx", { id: "verify-email" }),
  route("forgot-password", "routes/auth.tsx", { id: "forgot-password" }),
  route("reset-password", "routes/auth.tsx", { id: "reset-password" }),
  route("tickets", "routes/tickets.tsx"),
  route("tickets/:orderNumber", "routes/ticket-detail.tsx"),
  route("checkout/return/:orderNumber", "routes/checkout-return.tsx"),
] satisfies RouteConfig;
