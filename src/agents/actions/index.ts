import type { AgentRequest, AgentResponse, AgentContext } from '@agentuity/sdk';
import { generateObject } from 'ai';
import { z } from 'zod';
import { anthropic } from '@ai-sdk/anthropic';
import { randomUUID } from 'crypto';
import type { EmailAction } from './types.js';
import { saveAction } from './store.js';

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

async function interpretAction(text: string): Promise<Omit<EmailAction, 'id' | 'createdAt'>> {
  const systemPrompt = `You convert user requests about email actions into JSON.\nReturn only JSON with fields action (notify|summarize), criteria, and description.`;
  const schema = z.object({
    action: z.enum(['notify', 'summarize']),
    criteria: z.string(),
    description: z.string(),
  });

  try {
    const result = await generateObject({
      model: anthropic('claude-3-5-sonnet-latest'),
      system: systemPrompt,
      prompt: text,
      schema,
    });
    return result.object;
  } catch {
    return {
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
  const parsed = await interpretAction(input);

  const action: EmailAction = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...parsed,
  };

  await saveAction(ctx, action);
  ctx.logger.info('Stored action %s', action.id);
  return resp.json({ message: 'Action stored', action });
}
