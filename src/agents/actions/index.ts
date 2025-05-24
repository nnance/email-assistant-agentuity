import type { AgentRequest, AgentResponse, AgentContext } from '@agentuity/sdk';
import { generateObject } from 'ai';
import { z } from 'zod';
import { anthropic } from '@ai-sdk/anthropic';
import { randomUUID } from 'crypto';
import type { EmailAction } from './types.js';
import { saveAction, getActions } from './store.js';


async function interpretAction(
  text: string,
): Promise<Omit<EmailAction, 'id' | 'createdAt'>> {
  const systemPrompt = `You convert user requests about email actions into JSON.\nReturn only JSON with fields event, action, description, optional criteria, and optional notify {method, frequency}.`;
  const schema = z.object({
    event: z.string(),
    action: z.string(),
    description: z.string(),
    criteria: z.string().optional(),
    notify: z
      .object({
        method: z.enum(['email', 'sms', 'push']),
				frequency: z.enum(['immediate', 'daily', 'weekly']).optional(),
      })
      .optional(),
  });

  try {
    const result = await generateObject({
      model: anthropic('claude-3-5-sonnet-latest'),
      system: systemPrompt,
      prompt: text,
      schema,
    });
    const obj = result.object;
    if (obj.command === 'list') {
      return { command: 'list' };
    }
    
    // Validate required fields for create command
    if (!obj.action || !obj.criteria || !obj.description) {
      throw new Error('Missing required fields for create command');
    }
    
    return {
      command: 'create',
      action: obj.action,
      criteria: obj.criteria,
      description: obj.description,
    };
  } catch {
    if (/\blist|show|display\b/i.test(text)) {
      return { command: 'list' };
    }
    return {
      event: 'new_email',
      action: 'notify',
      description: text,
      criteria: text,
    };
  }
}

export default async function Agent(
  req: AgentRequest,
  resp: AgentResponse,
  ctx: AgentContext,
) {
  const input = (await req.data.text())?.trim();
  if (!input) {
    return resp.status(400).json({ error: 'No instruction provided' });
  }
  const instruction = await interpretInstruction(input);

  if (instruction.command === 'list') {
    const actions = await getActions(ctx);
    return resp.json({ actions });
  }

  const action: EmailAction = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    action: instruction.action,
    criteria: instruction.criteria,
    description: instruction.description,
  };

  await saveAction(ctx, action);
  ctx.logger.info('Stored action %s', action.id);
  return resp.json({ message: 'Action stored', action });
}
