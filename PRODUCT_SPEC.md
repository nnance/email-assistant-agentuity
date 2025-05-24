# AI Email Assistant Product Specification

## Overview
The AI Email Assistant automatically processes incoming emails and provides timely updates or actions based on user-defined rules. Users interact with the assistant using natural language to set instructions, specify event triggers, and manage the frequency of notifications or summaries. The system aims to reduce manual email management while ensuring users stay informed about important messages.

## Goals
- Automate routine email processing such as notifications and inbox summaries.
- Provide a conversational interface for configuring actions and requesting updates.
- Keep the user informed about important emails or actions taken by the assistant.
- Allow flexible rules that can be updated over time using natural language requests.

## Non‑Goals
- Replacing the user's preferred email client.
- Handling non-email tasks unrelated to inbox management.

## Key Features
1. **Natural Language Instructions**
   - Users describe desired behaviors (e.g., "Notify me when I receive an urgent email" or "Summarize my inbox every morning").
   - The assistant interprets these instructions into structured actions stored using the `EmailAction` model.
2. **Email Monitoring and Processing**
   - The system checks for new emails and evaluates them against stored actions.
   - Notifications or summaries are generated when events and filters match.
3. **User Notifications**
   - Important emails trigger a direct notification to the user.
   - Summaries group less urgent emails into periodic updates.
4. **Action Management API**
   - Endpoints expose creation and retrieval of email actions.
   - Rules can be updated or removed by sending new natural language instructions.

## Technical Architecture
- **Platform**: Node.js project managed through the Agentuity framework.
- **Agent**: `actions` agent interprets user requests and stores them via the `EmailAction` interface.
- **Data Storage**: Key-value store (KV) used for persisting email actions (`email_actions` list).
- **Models**: Utilizes the Anthropic Claude model through the Vercel AI SDK to parse natural language instructions.

### EmailAction Structure
```ts
interface EmailAction {
  id: string;
  description: string; // natural language description
  event: string; // event that triggers the rule
  action: string; // action to perform
  criteria?: string; // optional filters
  notify?: {
    method: 'email' | 'sms' | 'push';
    frequency?: 'immediate' | 'daily' | 'weekly';
  };
  createdAt: string; // ISO timestamp
}
```

## Privacy and Security
- Authentication to email providers must be handled securely, using environment variables or secrets.
- Data is stored in the project KV store and should be protected to prevent unauthorized access.

## Milestones
1. **Action Parsing** – Convert natural language instructions to `EmailAction` objects.
2. **Email Integration** – Connect to email provider (e.g., Gmail) for retrieving messages.
3. **Notification & Summary Delivery** – Implement how the assistant informs users of important events.
4. **User Interaction Loop** – Allow users to adjust or query rules through a conversational interface.

