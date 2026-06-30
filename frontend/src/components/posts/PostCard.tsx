import { forwardRef, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";import { PostHeader } from "./PostHeader";
import { PostMediaSection } from "./PostMediaSection";
import { PostDescription } from "./PostDescription";
import { MediaToggle } from "./MediaToggle";
import { PostActions } from "./PostActions";
import type { PostDto } from "../../types/post";

interface PostCardProps {
  post: PostDto;
  isOwner?: boolean;
  isRecommended?: boolean;
  defaultTab?: number;
  getComments: (postId: string) => any;
  onLikeToggle: (postId: string, wasLiked: boolean) => void;
  onCommentAdded: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const PostCard = forwardRef<HTMLDivElement, PostCardProps>(
  function PostCard(
    {
      post,
      isOwner,
      isRecommended,
      defaultTab = 0,
      onLikeToggle,
      onEdit,
      onDelete,
    },
    ref,
  ) {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [tab, setTab] = useState(defaultTab);

    const openPost = () =>
      navigate(`/post/${post.id}`, { state: { backgroundLocation: location } });

    const handleLikeToggle = () => {
      onLikeToggle(post.id, post.isLiked);
    };

    const handleCommentClick = () => {
      navigate(`/post/${post.id}`, { state: { backgroundLocation: location } });
    };
    return (
      <Box
        ref={ref}
        sx={{
          border: "1px solid",
          borderColor: theme.palette.divider,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          overflow: "hidden",
          transition: "box-shadow 0.15s",
          "&:hover": {
            boxShadow: `0 2px 12px ${theme.palette.common.black}22`,
          },
        }}
      >
        <PostHeader
          displayName={post.displayName}
          gymName={post.gymName}
          gymId={post.gymId}
          visibility={post.visibility}
          isOwner={isOwner}
          isRecommended={isRecommended}
          createdAt={post.createdAt}
          onEdit={onEdit}
          onDelete={onDelete}
          mediaToggle={
            <MediaToggle value={tab} onChange={setTab} showAscents={false} hasMedia={post.mediaUrls.length > 0} />
          }
        />

        {/* Description + stats — кликабельные */}
        <Box
          sx={{ cursor: "pointer", "&:hover": { opacity: 0.95 } }}
          onClick={openPost}
        >
          <PostDescription
            body={post.body}
            totalKruskor={post.stats.totalKruskor}
            avgGrade={post.stats.avgGrade}
            duration={post.stats.duration}
            totalRoutes={post.stats.totalRoutes}
            maxGrade={post.stats.maxGrade}
          />
        </Box>

        {/* Media toggle — только на мобилке (на десктопе в хедере) */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', px: 2.5, pb: 1 }}>
          <MediaToggle value={tab} onChange={setTab} showAscents={true} hasMedia={post.mediaUrls.length > 0} />
        </Box>

        {/* Media / ascents — только фото кликабельно */}
        <PostMediaSection
          ascents={post.ascents}
          mediaUrls={post.mediaUrls}
          tab={tab}
          onTabChange={setTab}
          onPhotoClick={openPost}
        />

        {/* Actions — не кликабельные (только like/comment/share) */}
        <PostActions
          isLiked={post.isLiked}
          likesCount={post.likesCount}
          commentsCount={post.commentsCount}
          onLikeToggle={handleLikeToggle}
          onCommentClick={handleCommentClick}
        />
      </Box>
    );
  },
);
