const URGENCY_PHRASES = [
  "asap",
  "urgent",
  "today",
  "by tonight",
  "right now",
  "need an answer",
  "let me know today",
  "before friday",
  "can you confirm"
];

const DELAY_PHRASES = [
  "maybe later",
  "we'll see",
  "not right now",
  "another time",
  "sometime",
  "for now",
  "eventually",
  "when things calm down"
];

const SPECIFICITY_PHRASES = [
  "tomorrow",
  "friday",
  "monday",
  "confirm by",
  "at 3",
  "call at",
  "meet at",
  "send me",
  "i can do",
  "let's talk",
  "reply by",
  "next week"
];

const CALL_PHRASES = [
  "call me",
  "can we talk",
  "let's talk",
  "jump on a call",
  "phone call",
  "talk later",
  "need to talk"
];

const BLAME_PHRASES = [
  "you're overthinking",
  "you always do this",
  "don't start",
  "calm down",
  "that's not what i meant",
  "why are you making this about you",
  "you're making this harder"
];

const SOFTENERS = [
  "thanks",
  "appreciate",
  "glad",
  "happy to",
  "makes sense",
  "understand"
];

function clamp(value, min = 0, max = 10) {
  return Math.max(min, Math.min(max, value));
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function countMatches(text, phrases) {
  return phrases.reduce((count, phrase) => {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    const hits = text.match(regex);
    return count + (hits ? hits.length : 0);
  }, 0);
}

function buildDecision(metrics, counters) {
  const reasons = [];
  let action = "ask one concrete question";
  let summary =
    "The message is not clear enough on timing or intent to justify filling the blanks with optimism.";

  if (
    metrics.escalation >= 6 ||
    (metrics.callShift >= 5.5 && metrics.pressure >= 5) ||
    (metrics.callShift >= 4.5 && counters.exclamations >= 2)
  ) {
    action = "move to a call";
    summary =
      "The text is carrying enough heat or compression that another round of texting will probably distort it further.";
    reasons.push("Escalation is high enough that text is the wrong bandwidth.");
  } else if (metrics.directness >= 6.5 && metrics.pressure <= 5 && metrics.ambiguity <= 4.5) {
    action = "reply now";
    summary = "The text names a usable next step without much ambiguity.";
    reasons.push("There is enough concrete signal to answer directly.");
  } else if (metrics.avoidance >= 5 && metrics.pressure <= 4.5) {
    action = "wait";
    summary = "The message leans toward delay rather than a clean request. Pushing now is unlikely to improve clarity.";
    reasons.push("Delay language is stronger than commitment language.");
  } else if (metrics.blame >= 6.5 && metrics.directness <= 4.5) {
    action = "let it go";
    summary = "The text shifts the frame onto your reaction without offering much constructive direction back.";
    reasons.push("Blame or minimising language is doing more work than the actual issue.");
  } else {
    reasons.push("One concrete follow-up will surface whether the sender has a real next step or not.");
  }

  if (metrics.ambiguity >= 5) {
    reasons.push("Timing or intent stays unresolved in the current wording.");
  }
  if (metrics.pressure >= 6) {
    reasons.push("The message carries more force than detail.");
  }
  if (counters.questions >= 3) {
    reasons.push("Stacked questions increase friction without adding clarity.");
  }

  return {
    action,
    summary,
    reasons: [...new Set(reasons)].slice(0, 3)
  };
}

function buildFollowUpPrompts(metrics) {
  const prompts = [];

  if (metrics.ambiguity >= 5) {
    prompts.push("What exactly are you asking me to decide or confirm?");
  }
  if (metrics.directness < 5.5) {
    prompts.push("What timing are you actually proposing?");
  }
  if (metrics.pressure >= 6) {
    prompts.push("I can answer this better on a call than in fragments here.");
  }
  if (metrics.avoidance >= 5) {
    prompts.push("If now is not the right time, when should I revisit this?");
  }

  return [...new Set(prompts)].slice(0, 3);
}

export function analyzeMessageNextStep(input) {
  const text = String(input || "").trim();
  if (!text) {
    throw new Error("message-next-step needs message text");
  }

  const lower = text.toLowerCase();
  const exclamations = (text.match(/!/g) || []).length;
  const questions = (text.match(/\?/g) || []).length;
  const uppercaseWords = (text.match(/\b[A-Z]{3,}\b/g) || []).length;
  const words = text.split(/\s+/).filter(Boolean);
  const sentences = Math.max(
    1,
    text.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean).length
  );

  const urgencyHits = countMatches(lower, URGENCY_PHRASES);
  const delayHits = countMatches(lower, DELAY_PHRASES);
  const specificityHits = countMatches(lower, SPECIFICITY_PHRASES);
  const callHits = countMatches(lower, CALL_PHRASES);
  const blameHits = countMatches(lower, BLAME_PHRASES);
  const softenerHits = countMatches(lower, SOFTENERS);

  const directness = clamp(4 + specificityHits * 1.35 + urgencyHits * 0.8 - delayHits * 0.6);
  const ambiguity = clamp(3 + delayHits * 1.25 - specificityHits * 0.5);
  const pressure = clamp(2 + urgencyHits * 1.25 + blameHits * 0.8 + uppercaseWords * 0.9 + exclamations * 0.45 - softenerHits * 0.35);
  const escalation = clamp(1 + blameHits * 1.8 + callHits * 0.9 + exclamations * 0.8 + uppercaseWords * 0.9);
  const avoidance = clamp(1 + delayHits * 1.35 - specificityHits * 0.25);
  const callShift = clamp(1 + callHits * 2.4 + Math.max(0, escalation - 5) * 0.45);

  const metrics = {
    directness: round1(directness),
    ambiguity: round1(ambiguity),
    pressure: round1(pressure),
    escalation: round1(escalation),
    avoidance: round1(avoidance),
    callShift: round1(callShift)
  };

  let posture = "mixed";
  if (metrics.directness >= 6.5 && metrics.ambiguity <= 4.5) {
    posture = "direct";
  } else if (metrics.avoidance >= 5) {
    posture = "avoidant";
  } else if (metrics.escalation >= 6 || metrics.callShift >= 5.5) {
    posture = "heated";
  }

  return {
    posture,
    metrics,
    decision: buildDecision(metrics, { questions, exclamations }),
    followUps: buildFollowUpPrompts(metrics),
    counters: {
      words: words.length,
      sentences,
      questions
    }
  };
}

export function formatReport(result) {
  const lines = [
    `posture: ${result.posture}`,
    `directness: ${result.metrics.directness}/10`,
    `ambiguity:  ${result.metrics.ambiguity}/10`,
    `pressure:   ${result.metrics.pressure}/10`,
    `escalation: ${result.metrics.escalation}/10`,
    `avoidance:  ${result.metrics.avoidance}/10`,
    `call shift: ${result.metrics.callShift}/10`,
    "",
    `next step: ${result.decision.action}`,
    `why: ${result.decision.summary}`
  ];

  for (const reason of result.decision.reasons) {
    lines.push(`- ${reason}`);
  }

  if (result.followUps.length) {
    lines.push("", "follow-up prompts:");
    result.followUps.forEach((prompt, index) => {
      lines.push(`${index + 1}. ${prompt}`);
    });
  }

  lines.push(
    "",
    "next:",
    "Use tells when one message is not enough and you need the thread, the person, or the pattern over time.",
    "- quick next paid step: https://tells.voiddo.com/deep-dive/?ref=message-next-step-cli",
    "- recurring reads: https://tells.voiddo.com/?ref=message-next-step-cli"
  );

  return lines.join("\n");
}
