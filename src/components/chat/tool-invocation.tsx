"use client";

import type { PayloadMcpUITools } from "@/mastra/agents/web-page-agent";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";

export type ToolState =
  | "call"
  | "input-streaming"
  | "result"
  | "error"
  | "input-available"
  | "output-available"
  | "output-error";

export type ToolInvocationProps =
  | {
      [K in keyof PayloadMcpUITools]: {
        toolName: K;
        state: ToolState;
        input?: PayloadMcpUITools[K]["input"];
        output?: PayloadMcpUITools[K]["output"];
      };
    }[keyof PayloadMcpUITools]
  | {
      toolName: string;
      state: ToolState;
      input?: any;
      output?: any;
    };

export function ToolInvocation({
  toolName,
  state,
  input,
  output,
}: ToolInvocationProps) {
  // Map internal ToolState to ToolUIPart["state"]
  const getMappedState = (s: ToolState): any => {
    switch (s) {
      case "call":
        return "input-available";
      case "input-streaming":
        return "input-streaming";
      case "input-available":
        return "input-available";
      case "result":
      case "output-available":
        return "output-available";
      case "error":
      case "output-error":
        return "output-error";
      default:
        return s;
    }
  };

  const mappedState = getMappedState(state);
  const isError = state === "error" || state === "output-error";

  return (
    <Tool>
      <ToolHeader title={toolName} type={`tool-${toolName}` as any} state={mappedState} />
      <ToolContent>
        {input && Object.keys(input).length > 0 && <ToolInput input={input} />}
        {output && (
          <ToolOutput
            output={!isError ? output : undefined}
            errorText={isError ? (typeof output === "string" ? output : JSON.stringify(output)) : undefined}
          />
        )}
      </ToolContent>
    </Tool>
  );
}


