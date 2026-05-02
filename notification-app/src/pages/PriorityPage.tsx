import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Alert, Skeleton, Chip, Stack, Divider,
} from '@mui/material';
import { Star, EmojiEvents, Inbox } from '@mui/icons-material';
import NotificationCard from '../components/NotificationCard';
import { fetchAllNotifications } from '../api/notificationsApi';
import type { AppNotification } from '../api/notificationsApi';

// ─── Priority weights ─────────────────────────────────────────────────────────
const PRIORITY_WEIGHT: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

const weightLabel: Record<number, string> = { 3: 'High', 2: 'Medium', 1: 'Low' };
const weightColor: Record<number, string> = { 3: '#FFB800', 2: '#6C63FF', 1: '#00E5A0' };

const getPriorityTop10 = (all: AppNotification[]): AppNotification[] =>
  [...all]
    .sort((a, b) => {
      const wa = PRIORITY_WEIGHT[a.Type] ?? 0;
      const wb = PRIORITY_WEIGHT[b.Type] ?? 0;
      if (wb !== wa) return wb - wa;                                  // higher weight first
      return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime(); // latest first
    })
    .slice(0, 10);

// ─── Component ────────────────────────────────────────────────────────────────
const PriorityPage: React.FC = () => {
  const [topNotifications, setTopNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const markRead = (id: string) => setReadIds((prev) => new Set([...prev, id]));

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // No page/limit params — server returns default set, we sort on frontend
        const all = await fetchAllNotifications();
        setTopNotifications(getPriorityTop10(all));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Box>
      {/* ── Header ── */}
      <Box
        sx={{
          mb: 3, p: 3, borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(255,184,0,0.12) 0%, rgba(13,13,26,0.8) 100%)',
          border: '1px solid rgba(255,184,0,0.25)',
          display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
        }}
      >
        <Box
          sx={{
            width: 48, height: 48, borderRadius: 2,
            background: 'linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(255,184,0,0.35)', flexShrink: 0,
          }}
        >
          <Star sx={{ color: '#fff', fontSize: 26 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Priority Notifications</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Top 10 notifications ranked by type weight, then recency
          </Typography>
        </Box>
        <Chip
          label="Top 10"
          sx={{ bgcolor: 'rgba(255,184,0,0.15)', color: '#FFB800', border: '1px solid rgba(255,184,0,0.3)', fontWeight: 700 }}
        />
      </Box>

      {/* ── Weight legend ── */}
      <Box
        sx={{
          mb: 3, p: 2, borderRadius: 2,
          background: 'rgba(19,19,43,0.7)',
          border: '1px solid rgba(108,99,255,0.15)',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
          PRIORITY WEIGHTS
        </Typography>
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
          {([3, 2, 1] as const).map((w) => {
            const typeLabel = { 3: 'Placement', 2: 'Result', 1: 'Event' } as const;
            return (
              <Box key={w} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: weightColor[w], boxShadow: `0 0 6px ${weightColor[w]}` }} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{typeLabel[w]}</Typography>
                <Chip label={`×${w}`} size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: `${weightColor[w]}22`, color: weightColor[w], border: `1px solid ${weightColor[w]}44` }} />
                <Chip label={weightLabel[w]} size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: 'transparent', color: 'text.secondary', border: '1px solid rgba(108,99,255,0.15)' }} />
              </Box>
            );
          })}
        </Stack>
      </Box>

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
        <Box key={i} sx={{ mb: 2, p: 2, borderRadius: 2, border: '1px solid rgba(255,184,0,0.15)', bgcolor: 'rgba(19,19,43,0.7)' }}>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(255,184,0,0.1)' }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="50%" sx={{ bgcolor: 'rgba(255,184,0,0.08)' }} />
              <Skeleton variant="text" width="85%" sx={{ bgcolor: 'rgba(255,184,0,0.08)' }} />
              <Skeleton variant="text" width="25%" sx={{ bgcolor: 'rgba(255,184,0,0.06)' }} />
            </Box>
          </Box>
        </Box>
      ))}

      {/* ── Empty state ── */}
      {!loading && !error && topNotifications.length === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
          <EmojiEvents sx={{ fontSize: 64, color: 'rgba(255,184,0,0.25)' }} />
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>No priority notifications</Typography>
        </Box>
      )}

      {/* ── Top 10 list ── */}
      {!loading && topNotifications.map((n, idx) => (
        <NotificationCard
          key={n.ID}
          notification={n}
          rank={idx + 1}
          priorityBadge={PRIORITY_WEIGHT[n.Type] ?? 0}
          isRead={readIds.has(n.ID)}
          onRead={markRead}
        />
      ))}
    </Box>
  );
};

export default PriorityPage;
