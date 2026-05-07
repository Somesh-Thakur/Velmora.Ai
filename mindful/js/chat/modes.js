export const modes = [
  {
    id: "auto",
    name: "Auto",
    short: "Detect the right help",
    description: "VelmoraCare.Ai reads the situation and chooses the most useful support style automatically.",
    icon: "target",
    starter: "Write what happened. VelmoraCare.Ai will choose the right mode."
  },
  {
    id: "fix",
    name: "Fix This Situation",
    short: "Resolve conflict",
    description: "Break down awkward moments, misunderstandings, and conflict into a precise action plan.",
    icon: "target",
    starter: "Tell me what happened, what you already said, and what you want to avoid."
  },
  {
    id: "message",
    name: "Draft a Message",
    short: "Texts and replies",
    description: "Write apologies, replies, boundary messages, and emotionally intelligent follow-ups.",
    icon: "message",
    starter: "Paste the message or describe what you need to say. Include the tone you want."
  },
  {
    id: "overthinking",
    name: "Overthinking Mode",
    short: "Facts, fears, assumptions",
    description: "Separate what is known from what is imagined, then identify controllable next steps.",
    icon: "split",
    starter: "Write the thought loop exactly as it is."
  },
  {
    id: "coach",
    name: "Pre-Conversation Coach",
    short: "Prepare hard talks",
    description: "Rehearse a difficult conversation, predict reactions, and prepare grounded responses.",
    icon: "coach",
    starter: "Describe who you need to talk to, the outcome you want, and what makes the conversation hard."
  },
  {
    id: "perspective",
    name: "Perspective Shift",
    short: "Understand the other side",
    description: "Map what the other person may be thinking, feeling, fearing, and protecting.",
    icon: "eye",
    starter: "Describe the other person's behavior and the context around it."
  }
];

export function findMode(id) {
  return modes.find(mode => mode.id === id) || modes[0];
}
