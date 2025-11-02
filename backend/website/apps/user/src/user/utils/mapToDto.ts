import { UserDto } from '@app/contracts/shared-dto/user/user.dto';

export const mapToDto = (user: any): UserDto => ({
  user_id: user.user_id,
  username: user.username,
  desc: user.desc,
  profile_picture: user.profile_picture,
  follower: user.follower,
  total_like: user.total_like,
  total_reports: user.total_reports,
  content_visibilityPrivate: user.content_visibilityPrivate,
  pinned_visibilityPrivate: user.pinned_visibilityPrivate,
  liked_visibilityPrivate: user.liked_visibilityPrivate,
});
