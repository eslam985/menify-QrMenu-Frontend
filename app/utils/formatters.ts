import { RolesList } from "~/constants/auth";

export const formatPrice = (price: number | string): string => {
  const num = Number(price);
  if (isNaN(num)) return String(price);

  return new Intl.NumberFormat("ar-EG").format(num);
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return "-";

  const d: Date = new Date(dateStr);

  if (Number.isNaN(d.getTime())) return "-";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const time = d.toLocaleTimeString("en-US", { timeStyle: "short" });

  return `${year}/${month}/${day}, ${time}`;
};

/**
 * Formats an ISO date string into the `YYYY-MM-DDTHH:mm` format required by HTML `datetime-local` inputs.
 *
 * @param dateStr - The ISO date string from the backend
 * @returns A formatted local datetime string, or an empty string if invalid/missing
 */
export const formatForDateTimeInput = (dateStr?: string | null): string => {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16);
};



export const formatRoleLabel = (
  role?: string | number | null,
): "Admin" | "Editor" | "User" | "N/A" => {
  const numericRole = Number(role);

  if (numericRole === RolesList.Admin) return "Admin";
  if (numericRole === RolesList.Editor) return "Editor";
  if (numericRole === RolesList.User) return "User";

  return "N/A";
};
