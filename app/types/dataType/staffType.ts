import type { RolesType } from "@/types/userType/userType.js";

export interface StaffResponse {
  id: string;
  username: string;
  email: string;
  roles: RolesType;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStaffInput {
  restaurantId: string;
  username: string;
  email: string;
  passwordHash: string;
  roles: Exclude<RolesType, "5150">;
}

export interface DeleteStaffResult {
  id: string;
  avatar_url: string;
  avatar_history: string[];
}
