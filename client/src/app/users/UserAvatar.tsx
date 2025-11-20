import { Avatar } from 'antd';
import { getAvatarColor, getNameInitial } from '@/utils/userUtils';

interface UserAvatarProps {
  name: string;
  photoURL?: string;
  size?: number;
}

export const UserAvatar = ({ name, photoURL, size = 36 }: UserAvatarProps) => {
  // If photoURL is provided and not empty, use it as the avatar image
  if (photoURL && photoURL.trim() !== '') {
    return <Avatar size={size} src={photoURL} style={{ flexShrink: 0 }} />;
  }

  // Otherwise, use the default colored avatar with initials
  return (
    <Avatar
      size={size}
      style={{ backgroundColor: getAvatarColor(name || 'U'), flexShrink: 0 }}
    >
      {getNameInitial(name)}
    </Avatar>
  );
};
