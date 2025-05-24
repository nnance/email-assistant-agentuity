export interface EmailPreference {
  id: string;
  /** Natural language description of the preference */
  description: string;
  /** ISO timestamp when the preference was created */
  createdAt: string;
}
