import { gateway, stepCountIs, ToolLoopAgent, type InferAgentUIMessage } from "ai";
import type { AgentProjectContext } from "@/lib/agent/types";
import { SOLARDEV_SYSTEM_PROMPT, projectInstructions } from "@/lib/agent/prompt";
import { createSolarTools } from "@/lib/agent/tools";

export function createSolarAgent(ownerId: string, context: AgentProjectContext) {
  return new ToolLoopAgent({
    model: gateway(process.env.AI_GATEWAY_MODEL || "openai/gpt-5.6-terra"),
    instructions: `${SOLARDEV_SYSTEM_PROMPT}${projectInstructions(context)}`,
    tools: createSolarTools(ownerId, context.project?.id),
    stopWhen: stepCountIs(8),
  });
}

export type SolarAgentUIMessage = InferAgentUIMessage<ReturnType<typeof createSolarAgent>>;
