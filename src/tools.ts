/**
 * Tool definitions for the Creative Writing Assistant
 * Tools can either require human confirmation or execute automatically
 */
import { tool, type ToolSet } from "ai";
import { z } from "zod/v3";

import type { Chat } from "./server";
import { getCurrentAgent } from "agents";
import { scheduleSchema } from "agents/schedule";

/**
 * Brainstorm story ideas tool that executes automatically
 * Generates creative story concepts and plot ideas
 */
const brainstormStoryIdeas = tool({
  description: "Generate creative story ideas, plot concepts, and writing prompts",
  inputSchema: z.object({ 
    genre: z.string().optional().describe("Genre of the story (e.g., sci-fi, fantasy, mystery)"),
    theme: z.string().optional().describe("Theme or mood (e.g., adventure, romance, horror)"),
    length: z.string().optional().describe("Story length (e.g., short story, novel, flash fiction)")
  }),
  execute: async ({ genre, theme, length }) => {
    const genreText = genre ? ` in the ${genre} genre` : '';
    const themeText = theme ? ` with a ${theme} theme` : '';
    const lengthText = length ? ` for a ${length}` : '';
    
    return `Here are some creative story ideas${genreText}${themeText}${lengthText}:

1. **The Memory Thief**: A protagonist discovers they can steal memories from others, but each stolen memory replaces one of their own.

2. **Time Capsule Mystery**: A character finds a time capsule from 50 years ago that contains a message addressed specifically to them.

3. **The Last Library**: In a world where all books have been digitized, one person discovers the last physical library and the secrets it holds.

4. **Parallel Lives**: A character meets their alternate self from a parallel universe, but something is subtly different about their counterpart.

5. **The Emotion Market**: In a world where emotions can be bought and sold, someone discovers their emotions are being stolen.

These ideas can be developed further with character development, world-building, and plot structure. Would you like me to elaborate on any of these concepts?`;
  }
});

/**
 * Create character tool that executes automatically
 * Generates detailed character profiles for stories
 */
const createCharacter = tool({
  description: "Generate detailed character profiles with background, personality, and motivations",
  inputSchema: z.object({
    name: z.string().optional().describe("Character name (if not provided, will suggest names)"),
    role: z.string().describe("Character's role in the story (e.g., protagonist, antagonist, mentor)"),
    genre: z.string().optional().describe("Story genre for context"),
    age: z.number().optional().describe("Character age")
  }),
  execute: async ({ name, role, genre, age }) => {
    const nameText = name || "Alex";
    const ageText = age ? `, age ${age}` : "";
    const genreText = genre ? ` in a ${genre} story` : "";
    
    return `**Character Profile: ${nameText}**

**Role:** ${role}${genreText}${ageText}

**Background:**
- ${nameText} grew up in a small town but always dreamed of something bigger
- Has a secret talent they've never shared with anyone
- Recently experienced a life-changing event that set them on their current path

**Personality Traits:**
- Curious and observant, often notices details others miss
- Loyal to friends but sometimes struggles with trust
- Has a dry sense of humor that emerges in stressful situations
- Tends to overthink decisions but acts decisively when it matters most

**Motivations:**
- Primary: Seeks to understand their place in the world
- Secondary: Wants to protect those they care about
- Hidden: Fears being forgotten or insignificant

**Strengths:**
- Excellent at reading people and situations
- Natural problem-solver
- Adaptable and resourceful

**Flaws:**
- Sometimes too self-critical
- Tends to take on others' problems as their own
- Can be stubborn when they believe they're right

**Character Arc Potential:**
This character could grow from someone who doubts their own worth to someone who realizes their unique perspective makes them invaluable to their story's resolution.

Would you like me to develop any aspect of this character further or create additional characters?`;
  }
});

/**
 * Schedule writing session tool - executes automatically
 * Helps writers set up dedicated writing time
 */
const scheduleWritingSession = tool({
  description: "Schedule a writing session, reminder, or writing goal deadline",
  inputSchema: scheduleSchema,
  execute: async ({ when, description }) => {
    // we can now read the agent context from the ALS store
    const { agent } = getCurrentAgent<Chat>();

    function throwError(msg: string): string {
      throw new Error(msg);
    }
    if (when.type === "no-schedule") {
      return "Not a valid schedule input";
    }
    const input =
      when.type === "scheduled"
        ? when.date // scheduled
        : when.type === "delayed"
          ? when.delayInSeconds // delayed
          : when.type === "cron"
            ? when.cron // cron
            : throwError("not a valid schedule input");
    try {
      agent!.schedule(input!, "executeTask", description);
    } catch (error) {
      console.error("error scheduling task", error);
      return `Error scheduling task: ${error}`;
    }
    return `Task scheduled for type "${when.type}" : ${input}`;
  }
});

/**
 * Tool to list all scheduled tasks
 * This executes automatically without requiring human confirmation
 */
const getScheduledTasks = tool({
  description: "List all tasks that have been scheduled",
  inputSchema: z.object({}),
  execute: async () => {
    const { agent } = getCurrentAgent<Chat>();

    try {
      const tasks = agent!.getSchedules();
      if (!tasks || tasks.length === 0) {
        return "No scheduled tasks found.";
      }
      return tasks;
    } catch (error) {
      console.error("Error listing scheduled tasks", error);
      return `Error listing scheduled tasks: ${error}`;
    }
  }
});

/**
 * Tool to cancel a scheduled task by its ID
 * This executes automatically without requiring human confirmation
 */
const cancelScheduledTask = tool({
  description: "Cancel a scheduled task using its ID",
  inputSchema: z.object({
    taskId: z.string().describe("The ID of the task to cancel")
  }),
  execute: async ({ taskId }) => {
    const { agent } = getCurrentAgent<Chat>();
    try {
      await agent!.cancelSchedule(taskId);
      return `Task ${taskId} has been successfully canceled.`;
    } catch (error) {
      console.error("Error canceling scheduled task", error);
      return `Error canceling task ${taskId}: ${error}`;
    }
  }
});

/**
 * Track writing progress tool that executes automatically
 * Records word count and writing milestones
 */
const trackWritingProgress = tool({
  description: "Record writing progress, word count, or writing milestones",
  inputSchema: z.object({
    projectName: z.string().describe("Name of the writing project"),
    wordCount: z.number().describe("Current word count"),
    milestone: z.string().optional().describe("Any milestone reached (e.g., 'Chapter 3 complete')")
  }),
  execute: async ({ projectName, wordCount, milestone }) => {
    const milestoneText = milestone ? `\n\n🎉 Milestone: ${milestone}` : '';
    return `📝 Writing Progress Updated for "${projectName}"

Current word count: ${wordCount.toLocaleString()} words${milestoneText}

Keep up the great work! Every word brings you closer to your goal. Would you like to set a target for your next writing session?`;
  }
});

/**
 * Generate writing prompt tool that executes automatically
 * Provides creative writing prompts and exercises
 */
const generateWritingPrompt = tool({
  description: "Generate creative writing prompts and exercises to inspire writing",
  inputSchema: z.object({
    type: z.string().optional().describe("Type of prompt (e.g., character, dialogue, setting, conflict)"),
    difficulty: z.string().optional().describe("Difficulty level (beginner, intermediate, advanced)")
  }),
  execute: async ({ type, difficulty }) => {
    const typeText = type ? ` (${type} focused)` : '';
    const difficultyText = difficulty ? ` for ${difficulty} writers` : '';
    
    const prompts = [
      "Write about a character who discovers their reflection in a mirror is acting independently.",
      "Create a dialogue between two people where one is lying, but the reader doesn't know which one.",
      "Describe a setting where time moves differently than normal - maybe slower in some areas, faster in others.",
      "Write a scene where a character must make an impossible choice between two things they love equally.",
      "Start a story with the line: 'The last thing I expected to find in my grandmother's attic was...'",
      "Write about a character who can hear other people's thoughts, but only when they're thinking about them.",
      "Create a scene where two old friends meet for the first time in years, but one of them doesn't recognize the other.",
      "Write about a place that exists only in dreams, but someone finds a way to bring objects back from it."
    ];
    
    const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    return `✨ Writing Prompt${typeText}${difficultyText}

**Prompt:** ${selectedPrompt}

**Tips for this prompt:**
- Focus on sensory details to bring the scene to life
- Consider the emotional impact on your characters
- Think about what makes this situation unique or unexpected
- Don't worry about perfect prose - just start writing!

**Extension ideas:**
- What happens next in this scenario?
- How do other characters react?
- What are the consequences of this situation?
- How does this change your character's world?

Set a timer for 15-30 minutes and see where this prompt takes you!`;
  }
});

/**
 * Create story outline tool that executes automatically
 * Helps structure stories with plot points and character arcs
 */
const createStoryOutline = tool({
  description: "Generate story outlines with plot structure, character arcs, and key scenes",
  inputSchema: z.object({
    storyTitle: z.string().describe("Title or concept of the story"),
    genre: z.string().optional().describe("Story genre"),
    length: z.string().optional().describe("Intended length (short story, novella, novel)"),
    mainConflict: z.string().optional().describe("Main conflict or challenge")
  }),
  execute: async ({ storyTitle, genre, length, mainConflict }) => {
    const genreText = genre ? ` (${genre})` : '';
    const lengthText = length ? ` for a ${length}` : '';
    const conflictText = mainConflict ? `\n\n**Main Conflict:** ${mainConflict}` : '';
    
    return `📖 Story Outline: "${storyTitle}"${genreText}${lengthText}${conflictText}

**ACT I - Setup (25%)**
- **Opening Scene:** Introduce protagonist in their ordinary world
- **Inciting Incident:** Event that sets the story in motion
- **Plot Point 1:** Character makes a decision that commits them to the journey

**ACT II - Confrontation (50%)**
- **First Obstacle:** Initial challenge that tests the protagonist
- **Midpoint:** Major revelation or plot twist that changes everything
- **Dark Moment:** Lowest point where all seems lost
- **Plot Point 2:** Character finds inner strength or new approach

**ACT III - Resolution (25%)**
- **Climax:** Final confrontation with the main conflict
- **Resolution:** How the character's world is changed
- **Denouement:** Brief glimpse of the new normal

**Character Arc:**
- **Starting Point:** What the character wants vs. what they need
- **Growth:** How they change throughout the story
- **Ending:** How they're different by the end

**Key Scenes to Develop:**
1. The moment the protagonist realizes they can't go back
2. A scene that shows the antagonist's motivation
3. The protagonist's biggest failure and what they learn from it
4. The moment of truth where character must choose their path

**Questions to Consider:**
- What does your character want most?
- What's stopping them from getting it?
- What do they learn about themselves?
- How does the world change because of their journey?

Would you like me to elaborate on any section of this outline?`;
  }
});

/**
 * Export all available tools
 * These will be provided to the AI model to describe available capabilities
 */
export const tools = {
  brainstormStoryIdeas,
  createCharacter,
  scheduleWritingSession,
  getScheduledTasks,
  cancelScheduledTask,
  trackWritingProgress,
  generateWritingPrompt,
  createStoryOutline
} satisfies ToolSet;

/**
 * Implementation of confirmation-required tools
 * This object contains the actual logic for tools that need human approval
 * Each function here corresponds to a tool above that doesn't have an execute function
 * 
 * Note: All current tools execute automatically, so this object is empty.
 * Add tools here if you want to require human confirmation for certain actions.
 */
export const executions = {
  // Example of a confirmation-required tool:
  // publishStory: async ({ storyTitle, content }: { storyTitle: string, content: string }) => {
  //   console.log(`Publishing story: ${storyTitle}`);
  //   return `Story "${storyTitle}" has been published successfully!`;
  // }
};
