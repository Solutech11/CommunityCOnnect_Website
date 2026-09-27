export type Event = {
  _id: string;
  title: string;
  description: string;
  coverImageUrl?: string;
  activityType: string;
  state: string;
  lga: string;
  venueName: string;
  address: string;
  startsAt: string;
  endsAt: string;
  timezone?: string;
  publishedAt?: string;
  tags?: string[];
  status: string;
  trendingTickets?: number;
};

export type TicketType = {
  _id: string;
  title: string;
  description?: string;
  priceKobo: number;
  capacity?: number;
  sold: number;
  active: boolean;
};

export type TicketOrder = {
  orderNumber: string;
  eventId: Event;
  ticketTypeId: TicketType;
  quantity: number;
  ticketSubtotalKobo: number;
  platformFeeKobo: number;
  totalKobo: number;
  status: "pending" | "paid" | "cancelled" | "refunded";
  createdAt: string;
  checkedInAt?: string;
};

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type Session = { accessToken: string; refreshToken: string };
export type ApiSuccess<T> = { success: true; message: string; data: T };
export type ApiFailure = { success: false; error: { code: string; message: string; details?: unknown }; requestId?: string };
export type Page<T> = { events: T[]; pagination: { page: number; limit: number; total: number } };
