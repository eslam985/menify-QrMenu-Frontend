export type RolesType = "2001" | "5150" | "1984";

export interface SetAndUpdateAvatarUrlResponse {
  id: string;
  username: string;
  avatar_url: string;
  avatar_history: string[] | null;
}

export interface UserResponse extends SetAndUpdateAvatarUrlResponse {
  restaurant_id: string;
  email: string;
  roles: RolesType;
  created_at: string;
  updated_at: string;
}
export interface AuthContextResponse {
  restaurant_id: string;
  roles: RolesType;
  restaurant_active: boolean;
}

export interface UserProfileResponse extends UserResponse {
  restaurant_name: string;
  restaurant_slug: string;
  restaurant_logo_url: string | null;
  accessToken?: string;
}
export interface UserRequest {
  username: string;
  email: string;
  password: string;
  roles: RolesType;
}

export interface CreateUserInput extends UserRequest {
  restaurantId: string;
}

export interface RegisterRestaurantInput {
  inviteCode: string;
  restaurantName: string;
  slug: string;
  username: string;
  email: string;
  passwordHash: string;
  roles: RolesType;
}

export interface FindUserByEmailResponse extends UserResponse {
  password: string;
}

export interface SessionResponse {
  id: string;
  user_id: string;
  family_id: string;
  user_agent: string | null;
  ip_address: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export type AllowedSessionColumnsType = {
  user_agent: "user_agent";
  ip_address: "ip_address";
  expires_at: "expires_at";
  created_at: "created_at";
  updated_at: "updated_at";
};

export interface FindByRefreshTokenResponse {
  id: string;
  restaurant_id: string;
  username: string;
  email: string;
  roles: RolesType;
  session_id: string;
}

export interface FindUserPasswordWithIdResponse {
  id: string;
  password: string;
}

export interface DecodedToken {
  userId: string;
  sid: string;
}

export interface AuthContextResponse {
  restaurant_id: string;
  roles: RolesType;
}

export interface UserProfileResponse extends UserResponse {
  restaurant_name: string;
  restaurant_slug: string;
  restaurant_logo_url: string | null;
}
