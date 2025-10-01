# ✍️ AI Creative Writing Assistant

![npm i agents command](./npm-agents-banner.svg)

<a href="https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/agents-starter"><img src="https://deploy.workers.cloudflare.com/button" alt="Deploy to Cloudflare"/></a>

An AI-powered Creative Writing Assistant built on Cloudflare's Agent platform, powered by [`agents`](https://www.npmjs.com/package/agents) and Llama 3. This application helps writers with all aspects of their creative process, from brainstorming ideas to structuring stories.

## Features

- ✍️ **Creative Writing Tools** - Brainstorm ideas, create characters, generate prompts
- 📖 **Story Development** - Build outlines, track progress, structure narratives
- ⏰ **Writing Sessions** - Schedule writing time and set creative goals
- 💬 **Interactive Chat** - Natural conversation with Llama 3 AI model
- 🛠️ **Smart Tools** - Automated writing assistance with contextual help
- 🌓 **Dark/Light Theme** - Comfortable writing environment
- ⚡️ **Real-time Responses** - Instant creative feedback and suggestions
- 🔄 **Memory & State** - Remembers your projects and writing preferences

## Prerequisites

- Cloudflare account with Workers AI enabled
- Llama 3 model access (included with Cloudflare Workers AI)

## Quick Start

1. Clone this repository:

```bash
git clone https://github.com/your-username/ai-creative-writing-assistant.git
cd ai-creative-writing-assistant
```

2. Install dependencies:

```bash
npm install
```

3. Set up Cloudflare Workers AI:

- Sign up for a [Cloudflare account](https://dash.cloudflare.com/sign-up)
- Enable Workers AI in your dashboard
- Get your Account ID and API Token

4. Configure your project:

Update `wrangler.jsonc` with your Cloudflare Account ID:

```jsonc
{
  "name": "ai-creative-writing-assistant",
  "main": "src/server.ts",
  "compatibility_date": "2025-08-03",
  "ai": {
    "binding": "AI",
    "remote": true
  }
}
```

5. Run locally:

```bash
npm start
```

6. Deploy to Cloudflare:

```bash
npm run deploy
```

## Writing Tools

The AI Writing Assistant comes with 6 powerful tools to help with your creative process:

### 🧠 **Brainstorm Story Ideas**

Generate creative story concepts, plot ideas, and writing prompts tailored to your preferred genre and theme.

**Example:** "Help me brainstorm a sci-fi story about time travel"

### 👤 **Create Character Profiles**

Build detailed character profiles with background, personality traits, motivations, strengths, and flaws.

**Example:** "Create a protagonist for my fantasy novel"

### ⏰ **Schedule Writing Sessions**

Set up dedicated writing time, reminders, and creative goal deadlines using flexible scheduling.

**Example:** "Schedule a writing session for tomorrow at 2 PM"

### 📊 **Track Writing Progress**

Record word counts, milestones, and project progress to stay motivated and organized.

**Example:** "I just finished chapter 3, update my progress"

### ✨ **Generate Writing Prompts**

Get creative writing prompts and exercises to spark inspiration and overcome writer's block.

**Example:** "Give me a character-focused writing prompt"

### 📖 **Create Story Outlines**

Build comprehensive story structures with plot points, character arcs, and key scenes.

**Example:** "Help me outline my mystery novel"

## How It Works

### AI-Powered Creativity

This Writing Assistant uses **Llama 3** (via Cloudflare Workers AI) to provide intelligent, contextual help with your writing projects. The AI:

- **Remembers your projects** and writing style preferences
- **Adapts suggestions** based on your genre and themes
- **Provides personalized feedback** and creative guidance
- **Learns from your interactions** to offer better assistance

### Smart Tool System

Each writing tool combines **structured templates** with **AI enhancement**:

1. **Tool Template** - Provides consistent formatting and structure
2. **AI Processing** - Llama 3 adds creativity, personalization, and context
3. **Dynamic Output** - Results are tailored to your specific needs and conversation history

### Memory & State Management

The assistant uses **Cloudflare Durable Objects** to:

- **Persist conversation history** across sessions
- **Remember your writing projects** and characters
- **Track your progress** and preferences
- **Maintain context** for better assistance

## Architecture

```
├── src/
│   ├── app.tsx        # Writing Assistant UI with chat interface
│   ├── server.ts      # Llama 3 AI agent with writing-focused system prompt
│   ├── tools.ts       # 6 writing tools (brainstorm, character, etc.)
│   ├── utils.ts       # Tool processing and message handling
│   └── styles.css     # Writing-themed UI styling
```

## Example Conversations

### Story Brainstorming

```
You: "I want to write a fantasy novel but I'm stuck on ideas"
Assistant: *uses brainstormStoryIdeas tool*
"I'll help you brainstorm some fantasy story concepts! Here are some creative ideas:

1. **The Memory Thief**: A protagonist discovers they can steal memories from others, but each stolen memory replaces one of their own...

Would you like me to elaborate on any of these concepts or help you develop characters for your chosen idea?"
```

### Character Development

```
You: "Create a mentor character for my protagonist"
Assistant: *uses createCharacter tool*
"**Character Profile: Marcus**

**Role:** Mentor in a fantasy story

**Background:**
- Marcus is a retired adventurer who lost his magical abilities
- Has a secret library of forbidden knowledge
- Recently discovered the protagonist has untapped potential

**Personality Traits:**
- Wise but sometimes cryptic in his teachings
- Protective of those he mentors
- Struggles with his own past mistakes

Would you like me to develop any aspect of Marcus further?"
```

### Writing Progress Tracking

```
You: "I just finished chapter 5, update my progress"
Assistant: *uses trackWritingProgress tool*
"📝 Writing Progress Updated for 'My Fantasy Novel'

Current word count: 25,000 words

🎉 Milestone: Chapter 5 complete

Keep up the great work! Every word brings you closer to your goal. Would you like to set a target for your next writing session?"
```

## Technology Stack

- **AI Model:** Llama 3 via Cloudflare Workers AI
- **Runtime:** Cloudflare Workers with Durable Objects
- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Backend:** Cloudflare Agents framework
- **State Management:** Durable Objects for persistent memory
- **Deployment:** Cloudflare Pages + Workers

## Assignment Requirements Met

This project fulfills all requirements for the Cloudflare Internship Assignment:

✅ **LLM:** Uses Llama 3 on Workers AI  
✅ **Workflow/Coordination:** Uses Workers and Durable Objects  
✅ **User Input:** Chat interface via Cloudflare Pages  
✅ **Memory/State:** Persistent state with Durable Objects

## Customization

### Adding New Writing Tools

To add a new writing tool, edit `src/tools.ts`:

```typescript
const newWritingTool = tool({
  description: "Your tool description for the AI",
  inputSchema: z.object({
    // Define parameters
  }),
  execute: async (
    {
      /* parameters */
    }
  ) => {
    // Tool logic here
    return "Your response";
  }
});

// Add to the tools export
export const tools = {
  // ... existing tools
  newWritingTool
} satisfies ToolSet;
```

### Modifying the Writing Assistant

- **System Prompt:** Edit the system prompt in `src/server.ts` to change the AI's personality
- **UI Theme:** Modify colors and styling in `src/styles.css`
- **Writing Tools:** Add new tools or modify existing ones in `src/tools.ts`
- **Memory:** Extend Durable Objects for additional state management

## Learn More

- [`agents`](https://github.com/cloudflare/agents/blob/main/packages/agents/README.md)
- [Cloudflare Agents Documentation](https://developers.cloudflare.com/agents/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)

## License

MIT
