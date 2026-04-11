export interface AnalyticsData {
  clicksPerLink: { link_id: string; count: number }[];
  dailyClicks: { date: string; count: number }[];
  totalClicks: number;
  weeklyClicks: number;
}

export interface LinkRow {
  id: string;
  label: string;
  url: string;
  bg_color: string;
  hover_color: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface RedirectRow {
  slug: string;
  destination_url: string;
  created_at: string;
}

export interface MessageRow {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  replied_at: string | null;
}

export interface LinkFormValues {
  label: string;
  url: string;
  bgColor: string;
  hoverColor: string;
  icon: string;
}

export interface RedirectFormValues {
  slug: string;
  destination: string;
}
