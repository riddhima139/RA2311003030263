import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
  Divider,
} from '@mui/material';
import {
  EventNote,
  EmojiEvents,
  Assessment,
  AccessTime,
  CheckCircle,
} from '@mui/icons-material';
import type { AppNotification } from '../api/notificationsApi';

interface NotificationCardProps {
  notification: AppNotification;
  priorityBadge?: number | null;
  rank?: number | null;
  isRead?: boolean;
  onRead?: (id: string) => void;
}

const typeConfig: Record<string, {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  label: string;
}> = {
  Placement: {
    color: '#FFB800',
    bgColor: 'rgba(255,184,0,0.12)',
    borderColor: 'rgba(255,184,0,0.35)',
    icon: <EmojiEvents sx={{ fontSize: 20 }} />,
    label: 'Placement',
  },
  Result: {
    color: '#6C63FF',
    bgColor: 'rgba(108,99,255,0.12)',
    borderColor: 'rgba(108,99,255,0.35)',
    icon: <Assessment sx={{ fontSize: 20 }} />,
    label: 'Result',
  },
  Event: {
    color: '#00E5A0',
    bgColor: 'rgba(0,229,160,0.12)',
    borderColor: 'rgba(0,229,160,0.35)',
    icon: <EventNote sx={{ fontSize: 20 }} />,
    label: 'Event',
  },
};

const fallbackConfig = typeConfig['Event'];

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  priorityBadge = null,
  rank = null,
  isRead = false,
  onRead,
}) => {
  const config = typeConfig[notification.Type] ?? fallbackConfig;

  const handleClick = () => {
    if (onRead && !isRead) onRead(notification.ID);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        mb: 2,
        borderLeft: `4px solid ${config.color}`,
        position: 'relative',
        overflow: 'visible',
        opacity: isRead ? 0.65 : 1,
        cursor: onRead ? 'pointer' : 'default',
        transition: 'opacity 0.25s ease, transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Rank badge */}
      {rank !== null && (
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            left: -10,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}99 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 800,
            color: '#0D0D1A',
            boxShadow: `0 2px 8px ${config.color}66`,
            zIndex: 1,
          }}
        >
          #{rank}
        </Box>
      )}

      <CardContent sx={{ pb: '12px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          {/* Icon */}
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: config.bgColor,
              border: `1px solid ${config.borderColor}`,
              color: config.color,
              flexShrink: 0,
            }}
          >
            {config.icon}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Header row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.75 }}>
              {/* Type chip */}
              <Chip
                label={config.label}
                size="small"
                sx={{
                  bgcolor: config.bgColor,
                  color: config.color,
                  border: `1px solid ${config.borderColor}`,
                  height: 22,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}
              />

              {/* Priority weight chip */}
              {priorityBadge !== null && (
                <Chip
                  label={`Weight ${priorityBadge}`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(108,99,255,0.15)',
                    color: '#6C63FF',
                    border: '1px solid rgba(108,99,255,0.3)',
                    height: 22,
                    fontSize: '0.7rem',
                  }}
                />
              )}

              {/* Read indicator */}
              {isRead && (
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.4 }}>
                  <CheckCircle sx={{ fontSize: 14, color: '#00E5A0' }} />
                  <Typography variant="caption" sx={{ color: '#00E5A0', fontSize: '0.65rem' }}>
                    Read
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Message */}
            <Typography
              variant="body2"
              sx={{ color: isRead ? 'text.secondary' : 'text.primary', mb: 1, lineHeight: 1.55 }}
            >
              {notification.Message}
            </Typography>

            <Divider sx={{ borderColor: 'rgba(108,99,255,0.1)', mb: 1 }} />

            {/* Footer */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTime sx={{ fontSize: 13, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {formatTime(notification.Timestamp)}
              </Typography>
              {notification.ID && (
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(153,153,187,0.5)', ml: 'auto' }}
                >
                  #{notification.ID.slice(-6)}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
