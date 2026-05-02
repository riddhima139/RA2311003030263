import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Pagination,
  Alert,
  Skeleton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
} from '@mui/material';
import { Notifications, Inbox } from '@mui/icons-material';
import NotificationCard from '../components/NotificationCard';
import { fetchNotifications } from '../api/notificationsApi';
import type { AppNotification } from '../api/notificationsApi';

const LIMIT_OPTIONS = [5, 10, 20, 50];

const AllNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Read/unread local state
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const markRead = (id: string) =>
    setReadIds((prev) => new Set([...prev, id]));

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchNotifications(page, limit);
      setNotifications(response.data ?? []);
      setTotal(response.total ?? response.data?.length ?? 0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <Box>
      {/* ── Header ── */}
      <Box
        sx={{
          mb: 3,
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(13,13,26,0.8) 100%)',
          border: '1px solid rgba(108,99,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box
          sx={{
            width: 48, height: 48, borderRadius: 2,
            background: 'linear-gradient(135deg, #6C63FF 0%, #9B94FF 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(108,99,255,0.4)', flexShrink: 0,
          }}
        >
          <Notifications sx={{ color: '#fff', fontSize: 26 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>All Notifications</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Browse and manage all your notifications
          </Typography>
        </Box>
        {total > 0 && (
          <Chip
            label={`${total} total`}
            sx={{ bgcolor: 'rgba(108,99,255,0.15)', color: 'primary.light', border: '1px solid rgba(108,99,255,0.3)', fontWeight: 600 }}
          />
        )}
      </Box>

      {/* ── Controls ── */}
      <Stack
        direction="row"
        sx={{ mb: 2.5, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {loading ? 'Loading...' : `Showing ${notifications.length} of ${total} notifications`}
        </Typography>
        <FormControl size="small" sx={{ minWidth: 110 }}>
          <InputLabel sx={{ color: 'text.secondary' }}>Per page</InputLabel>
          <Select
            value={limit}
            label="Per page"
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            sx={{
              color: 'text.primary',
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(108,99,255,0.3)' },
            }}
          >
            {LIMIT_OPTIONS.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>

      {/* ── Error ── */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, bgcolor: 'rgba(255,77,106,0.1)', border: '1px solid rgba(255,77,106,0.3)', color: '#FF4D6A' }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* ── Skeleton ── */}
      {loading && Array.from({ length: Math.min(limit, 5) }).map((_, i) => (
        <Box key={i} sx={{ mb: 2, p: 2, borderRadius: 2, border: '1px solid rgba(108,99,255,0.15)', bgcolor: 'rgba(19,19,43,0.7)' }}>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(108,99,255,0.1)' }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" sx={{ bgcolor: 'rgba(108,99,255,0.1)' }} />
              <Skeleton variant="text" width="90%" sx={{ bgcolor: 'rgba(108,99,255,0.1)' }} />
              <Skeleton variant="text" width="30%" sx={{ bgcolor: 'rgba(108,99,255,0.08)' }} />
            </Box>
          </Box>
        </Box>
      ))}

      {/* ── Empty state ── */}
      {!loading && !error && notifications.length === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
          <Inbox sx={{ fontSize: 64, color: 'rgba(108,99,255,0.3)' }} />
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>No notifications found</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(153,153,187,0.6)' }}>Check back later for updates</Typography>
        </Box>
      )}

      {/* ── List ── */}
      {!loading && notifications.map((n) => (
        <NotificationCard
          key={n.ID}
          notification={n}
          isRead={readIds.has(n.ID)}
          onRead={markRead}
        />
      ))}

      {/* ── Pagination ── */}
      {!loading && totalPages > 1 && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'text.secondary',
                border: '1px solid rgba(108,99,255,0.2)',
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #6C63FF 0%, #9B94FF 100%)',
                  color: '#fff',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(108,99,255,0.4)',
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default AllNotificationsPage;
