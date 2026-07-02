const Anthropic = require("@anthropic-ai/sdk");
const { success, error } = require("../utils/response");
const ToolRun = require("../models/ToolRun");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

exports.runAITool = async (req, res, next) => {
  try {
    const { toolName, input, category, systemPrompt } = req.body;
    const start = Date.now();

    if (req.user && !req.user.canUseAI()) {
      return error(res, "AI credits exhausted. Resets daily.", 429);
    }

    const sys = systemPrompt || `You are NanoTools AI. The user is using the "${toolName}" tool in the ${category} category. Provide high-quality, practical output. Be concise and directly useful.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: sys,
      messages: [{ role: "user", content: input }],
    });

    const output = message.content[0].text;

    if (req.user) {
      req.user.aiCredits = Math.max(0, req.user.aiCredits - 1);
      req.user.dailyRuns += 1;
      await req.user.save();
    }

    await ToolRun.create({
      userId: req.user?._id,
      toolName, category, isAI: true,
      inputSize: input.length, outputSize: output.length,
      duration: Date.now() - start, status: "success",
      ip: req.ip, userAgent: req.get("user-agent"),
    });

    success(res, { output, creditsRemaining: req.user?.aiCredits }, "AI tool completed");
  } catch (err) { next(err); }
};

exports.streamAITool = async (req, res, next) => {
  try {
    const { toolName, input, systemPrompt } = req.body;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      stream: true,
      system: systemPrompt || `You are NanoTools AI running the "${toolName}" tool.`,
      messages: [{ role: "user", content: input }],
    });

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) { next(err); }
};

exports.recommend = async (req, res, next) => {
  try {
    const { query, tools } = req.body;
    const toolList = tools.map((t) => `${t.name} (${t.category}): ${t.description}`).join("\n");

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system: "You are NanoTools AI assistant. Given a user task, recommend 1-3 tools from the list. Respond as JSON: { recommendations: [{name, reason}] }",
      messages: [{ role: "user", content: `Task: ${query}\n\nAvailable tools:\n${toolList}` }],
    });

    let recommendations;
    try { recommendations = JSON.parse(message.content[0].text).recommendations; }
    catch { recommendations = []; }

    success(res, { recommendations });
  } catch (err) { next(err); }
};
