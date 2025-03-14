import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { createTicket, getTicket, updateTicket } from '../services/api';
import { TicketFormData } from '../types';

const TicketForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    eventTime: new Date().toISOString(),
    location: '',
    tags: '',
    imagePath: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchTicket = async () => {
        try {
          const ticket = await getTicket(parseInt(id as string));
          setFormData({
            title: ticket.title,
            description: ticket.description,
            eventTime: new Date(ticket.eventTime).toISOString(),
            location: ticket.location,
            tags: ticket.tags.join(','),
            imagePath: ticket.imagePath,
          });
          if (ticket.imagePath) {
            setImagePreview(ticket.imagePath);
          }
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch ticket');
          setLoading(false);
        }
      };

      fetchTicket();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData((prev) => ({ ...prev, eventTime: date.toISOString() }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (isEditMode) {
        await updateTicket(parseInt(id as string), formData);
      } else {
        await createTicket(formData);
      }
      navigate('/');
    } catch (err) {
      setError('Failed to save ticket');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditMode ? 'Edit Ticket' : 'Add New Ticket'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Ticket Title"
                fullWidth
                required
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Event Date & Time"
                  value={new Date(formData.eventTime)}
                  onChange={handleDateChange}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="location"
                label="Location"
                fullWidth
                required
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="tags"
                label="Tags (comma separated)"
                fullWidth
                value={formData.tags}
                onChange={handleChange}
                helperText="E.g. movie, concert, museum"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" component="label">
                Upload Ticket Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {imagePreview && (
                <Box mt={2}>
                  <img
                    src={imagePreview}
                    alt="Ticket preview"
                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={24} /> : isEditMode ? 'Update' : 'Save'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default TicketForm; 