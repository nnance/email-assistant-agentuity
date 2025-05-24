export interface EmailAction {
  id: string;
  /** Natural language description of the rule */
  description: string;
  /** Event that triggers the rule (e.g. "new_email", "daily_summary") */
  event: string;
  /** Action to perform when the event occurs */
  action: string;
  /** Optional additional filters or criteria */
  criteria?: string;
  /** Optional notification preferences */
  notify?: {
    method: 'email' | 'sms' | 'push';
    frequency?: 'immediate' | 'daily' | 'weekly';
  };
  /** ISO timestamp when the action was created */
  createdAt: string;
}
