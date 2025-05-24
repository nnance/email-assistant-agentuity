import type { AgentRequest, AgentResponse, AgentContext } from '@agentuity/sdk';

export default async function Agent(
  req: AgentRequest,
  resp: AgentResponse,
  ctx: AgentContext,
) {
  ctx.logger.info('Preferences agent invoked');
  return resp.json({ message: 'Preferences agent not implemented yet' });
}
