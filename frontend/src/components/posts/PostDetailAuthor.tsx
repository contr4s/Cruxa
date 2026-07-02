import { Box } from '@mui/material';
import { GymChip } from '../ui/GymChip';
import { UserLink } from '../user/UserLink';

interface PostDetailAuthorProps {
  username: string;
  displayName: string;
  avatarUrl?: string;
  gymName?: string;
  gymId?: string;
  createdAt: string;
}

export function PostDetailAuthor({ username, displayName, avatarUrl, gymName, gymId, createdAt }: PostDetailAuthorProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, px: 2.5, py: 2 }}>
      <UserLink
        username={username}
        displayName={displayName}
        avatarUrl={avatarUrl}
        size="lg"
        withAvatar
        subtitle={
          <>
            {new Date(createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            {gymName && <GymChip name={gymName} gymId={gymId} />}
          </>
        }
      />
    </Box>
  );
}
