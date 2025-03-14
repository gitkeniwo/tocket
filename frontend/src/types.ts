export interface Ticket {
  id?: number;
  title: string;
  description: string;
  eventTime: string;
  location: string;
  imagePath: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TicketFormData {
  title: string;
  description: string;
  eventTime: string;
  location: string;
  tags: string;
  image?: File;
  imagePath?: string;
} 