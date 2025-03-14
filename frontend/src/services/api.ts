import axios from 'axios';
import { Ticket, TicketFormData } from '../types';

const API_URL = '/api';

// Get all tickets
export const getTickets = async (): Promise<Ticket[]> => {
  const response = await axios.get(`${API_URL}/tickets`);
  return response.data;
};

// Get a single ticket by ID
export const getTicket = async (id: number): Promise<Ticket> => {
  const response = await axios.get(`${API_URL}/tickets/${id}`);
  return response.data;
};

// Create a new ticket
export const createTicket = async (ticketData: TicketFormData): Promise<Ticket> => {
  // Upload image first if exists
  let imagePath = '';
  if (ticketData.image) {
    const formData = new FormData();
    formData.append('image', ticketData.image);
    const uploadResponse = await axios.post(`${API_URL}/tickets/upload`, formData);
    imagePath = uploadResponse.data.imagePath;
  }

  // Now create the ticket with the image path
  const response = await axios.post(`${API_URL}/tickets`, {
    title: ticketData.title,
    description: ticketData.description,
    eventTime: ticketData.eventTime,
    location: ticketData.location,
    imagePath: imagePath,
    tags: ticketData.tags,
  });

  return response.data;
};

// Update an existing ticket
export const updateTicket = async (id: number, ticketData: TicketFormData): Promise<Ticket> => {
  // Upload new image if exists
  let imagePath = ticketData.imagePath || '';
  if (ticketData.image) {
    const formData = new FormData();
    formData.append('image', ticketData.image);
    const uploadResponse = await axios.post(`${API_URL}/tickets/upload`, formData);
    imagePath = uploadResponse.data.imagePath;
  }

  // Update the ticket
  const response = await axios.put(`${API_URL}/tickets/${id}`, {
    title: ticketData.title,
    description: ticketData.description,
    eventTime: ticketData.eventTime,
    location: ticketData.location,
    imagePath: imagePath,
    tags: ticketData.tags,
  });

  return response.data;
};

// Delete a ticket
export const deleteTicket = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/tickets/${id}`);
}; 