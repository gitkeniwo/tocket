import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getTicket, deleteTicket } from '../services/api';
import { Ticket } from '../types';

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await getTicket(parseInt(id as string));
        setTicket(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch ticket');
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTicket(parseInt(id as string));
      navigate('/');
    } catch (err) {
      setError('Failed to delete ticket');
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !ticket) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error" variant="h6">
          {error || 'Ticket not found'}
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Tickets
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        component={RouterLink}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Back to Tickets
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Typography variant="h4" component="h1" gutterBottom>
                {ticket.title}
              </Typography>
              <Box>
                <Button
                  component={RouterLink}
                  to={`/edit/${ticket.id}`}
                  startIcon={<EditIcon />}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Grid>

          {ticket.imagePath && (
            <Grid item xs={12}>
              <Box
                sx={{
                  maxHeight: '300px',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <img
                  src={ticket.imagePath}
                  alt={ticket.title}
                  style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                />
              </Box>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Event Date & Time
            </Typography>
            <Typography variant="body1" gutterBottom>
              {new Date(ticket.eventTime).toLocaleDateString()} at{' '}
              {new Date(ticket.eventTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Location
            </Typography>
            <Typography variant="body1" gutterBottom>
              {ticket.location}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {ticket.description || 'No description provided'}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Tags
            </Typography>
            <Box mt={1}>
              {ticket.tags.length > 0 ? (
                ticket.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    sx={{ mr: 1, mb: 1 }}
                    color="primary"
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography variant="body2">No tags</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Ticket</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this ticket? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={deleting}
            autoFocus
          >
            {deleting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TicketDetail; 