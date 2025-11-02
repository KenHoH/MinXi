export class UserDto {
  user_id: number;
  username: string;
  desc: string;
  profile_picture: string;
  follower: number;
  total_like: number;
  total_reports: number;
  content_visibilityPrivate: boolean;
  pinned_visibilityPrivate: boolean;
  liked_visibilityPrivate: boolean;
}
