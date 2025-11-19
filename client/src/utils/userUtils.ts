import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Generates a consistent avatar color based on the user's name
 * @param name - The user's name
 * @returns A hex color string
 */
export const getAvatarColor = (name: string): string => {
  const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#1890ff', '#52c41a'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

/**
 * Formats the last active time as a relative time string
 * @param lastActiveTime - The last active timestamp or null
 * @returns A formatted string like "2 hours ago" or "Never"
 */
export const formatLastActive = (lastActiveTime: Date | null): string => {
  if (!lastActiveTime) return 'Never';
  return dayjs(lastActiveTime).fromNow();
};

/**
 * Gets the initial letter from a name for avatar display
 * @param name - The user's name
 * @returns The first character in uppercase
 */
export const getNameInitial = (name: string): string => {
  return name?.charAt(0).toUpperCase() || 'U';
};
