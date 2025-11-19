import { Avatar } from 'antd';
import { getAvatarColor, getNameInitial } from '@/utils/userUtils';

interface UserAvatarProps {
  name: string;
  size?: number;
}

export const UserAvatar = ({ name, size = 36 }: UserAvatarProps) => {
  return (
    <Avatar
      size={size}
      style={{ backgroundColor: getAvatarColor(name || 'U'), flexShrink: 0 }}
    >
      {getNameInitial(name)}
    </Avatar>
  );
};
