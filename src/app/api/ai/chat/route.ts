import { NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@supabase/supabase-js"
import { tools } from "@/lib/ai/tools"
import { executeTool } from "@/lib/ai/executor"

export async function POST(req: Request) {
  const { message, history = [] } = await req.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const modelClient = openai.responses("gpt-4.1-mini")

  try {
    // Initial model call
    let response = await modelClient.create({
      input: [
        ...history,
        {
          role: "user",
          content: message,
        },
      ],
      tools,
      system: `
        You are an AI CRM assistant.

        Rules:
        - NEVER invent data.
        - ALWAYS use tools to read or modify database data.
        - If information is missing, ask a clarification question.
        - If a contact name is ambiguous, call list_contacts first.
        - You may call multiple tools in sequence to complete a task.
        - After tool results are returned, generate a helpful confirmation message.
      `,
    })

    // 🔁 Agent loop (multi-step tool execution)
    while (true) {
      const toolCalls = response.output.filter(
        (item: any) => item.type === "tool_call"
      )

      if (!toolCalls.length) break

      const toolResults = []

      for (const call of toolCalls) {
        const result = await executeTool(
          call.name,
          call.arguments,
          user.id,
          supabase
        )

        toolResults.push({
          type: "tool_result",
          tool_call_id: call.id,
          output: JSON.stringify(result),
        })
      }

      // Send tool results back to model
      response = await modelClient.create({
        input: [...response.output, ...toolResults],
        tools,
      })
    }

    return NextResponse.json({
      reply: response.output_text,
      raw: response.output, // useful for debugging (optional)
    })
  } catch (error: any) {
    console.error("Chat route error:", error)

    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error?.message ?? "Unknown error",
      },
      { status: 500 }
    )
  }
}
