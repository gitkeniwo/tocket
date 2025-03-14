import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Chip,
  Link,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getTickets } from '../services/api';
import { Ticket } from '../types';

const TicketList = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getTickets();
        setTickets(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tickets');
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Your Tickets
        </Typography>
        <Button
          component={RouterLink}
          to="/add"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Add Ticket
        </Button>
      </Box>

      {tickets.length === 0 ? (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6">No tickets found</Typography>
          <Typography variant="body1" mt={2}>
            Start by adding your first ticket!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {tickets.map((ticket) => (
            <Grid item xs={12} sm={6} md={4} key={ticket.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {ticket.imagePath && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={ticket.imagePath}
                    alt={ticket.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    <Link component={RouterLink} to={`/ticket/${ticket.id}`} underline="none">
                      {ticket.title}
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {new Date(ticket.eventTime).toLocaleDateString()} at{' '}
                    {new Date(ticket.eventTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {ticket.location}
                  </Typography>
                  <Box mt={2}>
                    {ticket.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TicketList; 