export interface EmailAction {
  id: string;
  /** Natural language description of the action */
  description: string;
  /** Type of action to perform */
  action: 'notify' | 'summarize';
  /** Criteria for when the action should run */
  criteria: string;
  /** ISO timestamp when the action was created */
  createdAt: string;
}
