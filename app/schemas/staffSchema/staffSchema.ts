import { z } from "zod";
import {
  emailField,
  usernameField,
  newPasswordField,
} from "@/schemas/userSchema/userSchema.js";

const staffRoleField = z.enum(["1984", "2001"], {
  error: "الدور يجب أن يكون 1984 (Editor) أو 2001 (User)",
});

const staffIdParams = z.object({
  staffId: z.uuid("معرّف الموظف غير صالح"),
});

const createStaffSchema = z.object({
  body: z.strictObject({
    username: usernameField,
    email: emailField,
    password: newPasswordField,
    roles: staffRoleField,
  }),
});

const updateStaffRoleSchema = z.object({
  params: staffIdParams,
  body: z.strictObject({
    roles: staffRoleField,
  }),
});

const staffIdSchema = z.object({
  params: staffIdParams,
});

export { createStaffSchema, updateStaffRoleSchema, staffIdSchema };

export type CreateStaffType = z.infer<typeof createStaffSchema>;
export type UpdateStaffRoleType = z.infer<typeof updateStaffRoleSchema>;
export type StaffIdType = z.infer<typeof staffIdSchema>;
