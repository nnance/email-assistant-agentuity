import type { AgentContext } from '@agentuity/sdk';
import type { EmailAction } from './types';

const STORE_NAME = 'email_actions';
const STORE_KEY = 'list';

export async function saveAction(
  ctx: AgentContext,
  action: EmailAction,
): Promise<void> {
  const current = ((await ctx.kv.get(STORE_NAME, STORE_KEY)) as EmailAction[]) ?? [];
  current.push(action);
  await ctx.kv.set(STORE_NAME, STORE_KEY, current);
}

export async function getActions(
  ctx: AgentContext,
): Promise<EmailAction[]> {
  const current = ((await ctx.kv.get(STORE_NAME, STORE_KEY)) as EmailAction[]) ?? [];
  return current;
}

