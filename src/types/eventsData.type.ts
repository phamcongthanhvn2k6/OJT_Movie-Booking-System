export interface EventSchedule {
  flag: string;
  date: string;
  time: string;
  titleEn: string;
  titleVn?: string;
}

export interface EventSummary {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  date: string;
}

export interface EventDetail extends EventSummary {
  bannerUrl: string;
  posterUrl: string;
  venues?: string[];
  additionalInfo?: string;
  website?: string;
  note?: string;
  duration?: string; 
  location?: string;
  subtitle?: string;
  schedules: EventSchedule[];
}