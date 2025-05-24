import type { AgentRequest, AgentResponse, AgentContext } from '@agentuity/sdk';
import { generateObject } from 'ai';
import { z } from 'zod';
import { anthropic } from '@ai-sdk/anthropic';
import { randomUUID } from 'crypto';
import type { EmailAction } from './types.js';
import { saveAction, getActions } from './store.js';

export const welcome = () => {
  return {
    welcome:
      "Welcome to the Vercel AI SDK with Anthropic Agent! I can help you build AI-powered applications using Vercel's AI SDK with Claude models.",
    prompts: [
      {
        data: 'How do I implement streaming responses with Claude models?',
        contentType: 'text/plain',
      },
      {
        data: 'What are the best practices for prompt engineering with Claude?',
        contentType: 'text/plain',
      },
    ],
  };
};

type Instruction =
  | { command: 'list' }
  | {
      command: 'create';
      action: 'notify' | 'summarize';
      criteria: string;
      description: string;
    };

async function interpretInstruction(text: string): Promise<Instruction> {
  const systemPrompt = `You convert user requests about email actions into JSON.\\n` +
    `Return only JSON.\\n` +
    `If the user wants to create a new action, respond with {\\"command\\":\\"create\\",\\"action\\":\\"notify|summarize\\",\\"criteria\\":string,\\"description\\":string}.\\n` +
    `If the user wants to list existing actions, respond with {\\"command\\":\\"list\\"}.`;
  const schema = z.object({
    command: z.enum(['create', 'list']),
    action: z.enum(['notify', 'summarize']).optional(),
    criteria: z.string().optional(),
    description: z.string().optional(),
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
    return {
      command: 'create',
      action: obj.action!,
      criteria: obj.criteria!,
      description: obj.description!,
    };
  } catch {
    if (/\blist|show|display\b/i.test(text)) {
      return { command: 'list' };
    }
    return {
      command: 'create',
      action: 'notify',
      criteria: text,
      description: text,
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
