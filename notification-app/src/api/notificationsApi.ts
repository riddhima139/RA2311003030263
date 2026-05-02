import axios from 'axios';
import { TOKEN } from '../config';

// ─── Types (case-sensitive, matches API response exactly) ─────────────────────
export interface AppNotification {
  ID: string;
  Type: 'Event' | 'Result' | 'Placement';
  Message: string;
  Timestamp: string;
}

export interface NotificationsResponse {
  data: AppNotification[];
  total: number;
  page: number;
  limit: number;
}

// ─── Axios Instance ───────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: 'http://20.207.122.201/evaluation-service',
});

// ─── Auth header (always fresh from config) ───────────────────────────────────
const authHeader = () => ({
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
});

// ─── Helper: normalise any API response shape → AppNotification[] ─────────────
const extractList = (raw: unknown): AppNotification[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as AppNotification[];
  const obj = raw as Record<string, unknown>;
  if (Array.isArray(obj.notifications)) return obj.notifications as AppNotification[];
  if (Array.isArray(obj.data)) return obj.data as AppNotification[];
  return [];
};

// ─── Fetch paginated notifications (All Notifications page) ───────────────────
export const fetchNotifications = async (
  page: number = 1,
  limit: number = 10
): Promise<NotificationsResponse> => {
  console.log('[API REQUEST] GET /notifications', { page, limit });
  try {
    const res = await apiClient.get('/notifications', {
      headers: authHeader(),
      params: { page: Number(page), limit: Number(limit) },
    });
    console.log('[API RESPONSE] /notifications', res.data);

    const raw = res.data;
    const list = extractList(raw);
    const obj = raw as Record<string, unknown>;

    return {
      data: list,
      total: typeof obj.total === 'number' ? obj.total : list.length,
      page: typeof obj.page === 'number' ? obj.page : page,
      limit: typeof obj.limit === 'number' ? obj.limit : limit,
    };
  } catch (error: unknown) {
    console.error('[API ERROR] GET /notifications', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch notifications');
  }
};

// ─── Fetch ALL notifications without params (Priority & Filter pages) ─────────
export const fetchAllNotifications = async (): Promise<AppNotification[]> => {
  console.log('[API REQUEST] GET /notifications (no params)');
  try {
    const res = await apiClient.get('/notifications', {
      headers: authHeader(),
    });
    console.log('[API RESPONSE] /notifications (all)', res.data);
    return extractList(res.data);
  } catch (error: unknown) {
    console.error('[API ERROR] GET /notifications (all)', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch notifications');
  }
};
