/**
 * Represents a single branch address for a restaurant or cafe.
 */
export interface BranchAddress {
  /** Branch name (e.g., "Maadi Branch") */
  branch_name: string;
  /** Detailed street address of the branch */
  address: string;
}

/**
 * Parses the raw address string from the backend (either a JSON array or a legacy plain string)
 * into a structured array of branch addresses for the UI.
 *
 * @param rawAddress - The raw string stored in the database `address` field
 * @returns An array of structured `BranchAddress` objects
 *
 * @example
 * parseAddresses('[{"branch_name":"Maadi","address":"9th Street"}]')
 * // => [{ branch_name: "Maadi", address: "9th Street" }]
 *
 * parseAddresses("Cairo - Nasr City")
 * // => [{ branch_name: "الفرع الرئيسي", address: "Cairo - Nasr City" }]
 */
export const parseAddresses = (rawAddress?: string | null): BranchAddress[] => {
  if (!rawAddress) return [];

  try {
    const parsed = JSON.parse(rawAddress);

    if (Array.isArray(parsed)) return parsed;

    const toArray: BranchAddress[] = [
      { branch_name: "", address: String(rawAddress) },
    ];
    
    return toArray;
  } catch {
    // Fallback for legacy plain-text addresses stored before multi-branch support
    const toArray: BranchAddress[] = [
      { branch_name: "الفرع الرئيسي", address: rawAddress },
    ];

    return toArray;
  }
};

/**
 * Filters out empty branch entries and serializes the valid list into a JSON string for the backend.
 *
 * @param addresses - The array of branch addresses to serialize
 * @returns A JSON string of valid branches, or `null` if no valid addresses exist
 */
export const stringifyAddresses = (
  addresses: BranchAddress[],
): string | null => {
  const valid: BranchAddress[] = addresses.filter(
    (item: BranchAddress) => item.address.trim() !== "",
  );

  const res: string | null = valid.length > 0 ? JSON.stringify(valid) : null;

  return res;
};
