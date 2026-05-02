import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Alert, Skeleton, Chip, Stack, Divider,
  InputAdornment, TextField,
} from '@mui/material';
import {
  FilterList, EventNote, EmojiEvents, Assessment, Inbox, Search,
} from '@mui/icons-material';
import NotificationCard from '../components/NotificationCard';
import { fetchAllNotifications } from '../api/notificationsApi';
import type { AppNotification } from '../api/notificationsApi';

type NotificationType = 'All' | 'Event' | 'Result' | 'Placement';

const TYPE_OPTIONS: { label: NotificationType; icon: React.ReactNode; color: string }[] = [
  { label: 'All',       icon: <FilterList />,  color: '#9B94FF' },
  { label: 'Event',     icon: <EventNote />,   color: '#00E5A0' },
  { label: 'Result',    icon: <Assessment />,  color: '#6C63FF' },
  { label: 'Placement', icon: <EmojiEvents />, color: '#FFB800' },
];

const FilterPage: React.FC = () => {
  const [allNotifications, setAllNotifications] = useState<AppNotification[]>([]);
  const [selectedType, setSelectedType] = useState<NotificationType>('All');
  const [searchQuery, setSearchQuery]   = useState('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [readIds, setReadIds]           = useState<Set<string>>(new Set());

  const markRead = (id: string) => setReadIds((prev) => new Set([...prev, id]));

  // ── Fetch once on mount ──
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAllNotifications();
        setAllNotifications(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Filter logic ──
  const filtered = allNotifications.filter((n) => {
    const typeMatch = selectedType === 'All' || n.Type === selectedType;
    const searchMatch =
      !searchQuery.trim() ||
      n.Message.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return typeMatch && searchMatch;
  });

  // ── Dynamic counts ──
  const counts: Record<string, number> = {
    All:       allNotifications.length,
    Event:     allNotifications.filter((n) => n.Type === 'Event').length,
    Result:    allNotifications.filter((n) => n.Type === 'Result').length,
    Placement: allNotifications.filter((n) => n.Type === 'Placement').length,
  };

  const activeConfig = TYPE_OPTIONS.find((t) => t.label === selectedType)!;

  return (
    <Box>
      {/* ── Header ── */}
      <Box
        sx={{
          mb: 3, p: 3, borderRadius: 3,
          background: `linear-gradient(135deg, ${activeConfig.color}18 0%, rgba(13,13,26,0.8) 100%)`,
          border: `1px solid ${activeConfig.color}33`,
          display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
          transition: 'all 0.3s ease',
        }}
      >
        <Box
          sx={{
            width: 48, height: 48, borderRadius: 2,
            background: `linear-gradient(135deg, ${activeConfig.color} 0%, ${activeConfig.color}99 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 15px ${activeConfig.color}44`, flexShrink: 0,
            transition: 'all 0.3s ease',
          }}
        >
          <FilterList sx={{ color: '#fff', fontSize: 26 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Filter Notifications</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Filter by type: Event, Result, or Placement
          </Typography>
        </Box>
        <Chip
          label={`${filtered.length} results`}
          sx={{
            bgcolor: `${activeConfig.color}22`,
            color: activeConfig.color,
            border: `1px solid ${activeConfig.color}44`,
            fontWeight: 600,
          }}
        />
      </Box>

      {/* ── Search ── */}
      <TextField
        fullWidth
        placeholder="Search by message..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="small"
        sx={{
          mb: 2.5,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'rgba(19,19,43,0.7)',
            '& fieldset': { borderColor: 'rgba(108,99,255,0.25)' },
            '&:hover fieldset': { borderColor: 'rgba(108,99,255,0.45)' },
            '&.Mui-focused fieldset': { borderColor: '#6C63FF' },
          },
          '& input': { color: 'text.primary' },
          '& input::placeholder': { color: 'text.secondary', opacity: 0.7 },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* ── Type filter pills ── */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
          FILTER BY TYPE
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {TYPE_OPTIONS.map((opt) => {
            const isActive = selectedType === opt.label;
            return (
              <Chip
                key={opt.label}
                icon={
                  <Box sx={{ color: isActive ? '#fff' : opt.color, display: 'flex', ml: '8px !important' }}>
                    {opt.icon}
                  </Box>
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {opt.label}
                    <Box
                      sx={{
                        px: 0.75, py: 0.1, borderRadius: 1,
                        bgcolor: isActive ? 'rgba(255,255,255,0.2)' : `${opt.color}22`,
                        fontSize: '0.65rem', fontWeight: 700,
                      }}
                    >
                      {counts[opt.label] ?? 0}
                    </Box>
                  </Box>
                }
                onClick={() => setSelectedType(opt.label)}
                sx={{
                  cursor: 'pointer',
                  height: 36,
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 400,
                  background: isActive
                    ? `linear-gradient(135deg, ${opt.color} 0%, ${opt.color}cc 100%)`
                    : `${opt.color}11`,
                  color: isActive ? '#fff' : opt.color,
                  border: `1px solid ${isActive ? opt.color : `${opt.color}33`}`,
                  boxShadow: isActive ? `0 2px 12px ${opt.color}55` : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: isActive
                      ? `linear-gradient(135deg, ${opt.color} 0%, ${opt.color}cc 100%)`
                      : `${opt.color}22`,
                    boxShadow: `0 2px 8px ${opt.color}44`,
                  },
                }}
              />
            );
          })}
        </Stack>
      </Box>

      <Divider sx={{ borderColor: 'rgba(108,99,255,0.1)', mb: 3 }} />

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
      {loading && Array.from({ length: 5 }).map((_, i) => (
        <Box key={i} sx={{ mb: 2, p: 2, borderRadius: 2, border: '1px solid rgba(108,99,255,0.15)', bgcolor: 'rgba(19,19,43,0.7)' }}>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(108,99,255,0.1)' }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="55%" sx={{ bgcolor: 'rgba(108,99,255,0.08)' }} />
              <Skeleton variant="text" width="88%" sx={{ bgcolor: 'rgba(108,99,255,0.08)' }} />
              <Skeleton variant="text" width="28%" sx={{ bgcolor: 'rgba(108,99,255,0.06)' }} />
            </Box>
          </Box>
        </Box>
      ))}

      {/* ── Empty state ── */}
      {!loading && !error && filtered.length === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, gap: 2 }}>
          <Inbox sx={{ fontSize: 64, color: 'rgba(108,99,255,0.3)' }} />
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            No notifications match this filter
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(153,153,187,0.6)' }}>
            Try a different type or clear your search
          </Typography>
        </Box>
      )}

      {/* ── Cards ── */}
      {!loading && filtered.map((n) => (
        <NotificationCard
          key={n.ID}
          notification={n}
          isRead={readIds.has(n.ID)}
          onRead={markRead}
        />
      ))}
    </Box>
  );
};

export default FilterPage;
