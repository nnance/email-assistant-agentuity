import type { AgentContext } from '@agentuity/sdk';
import type { EmailPreference } from './types.js';

const STORE_NAME = 'email_preferences';
const STORE_KEY = 'list';

export async function savePreference(
  ctx: AgentContext,
  pref: EmailPreference,
): Promise<void> {
  const current = ((await ctx.kv.get(STORE_NAME, STORE_KEY)) as EmailPreference[]) ?? [];
  current.push(pref);
  await ctx.kv.set(STORE_NAME, STORE_KEY, current);
}

export async function getPreferences(
  ctx: AgentContext,
): Promise<EmailPreference[]> {
  const current = ((await ctx.kv.get(STORE_NAME, STORE_KEY)) as EmailPreference[]) ?? [];
  return current;
}
