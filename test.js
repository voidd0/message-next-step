import assert from "node:assert/strict";
import { analyzeMessageNextStep } from "./src/index.js";

const direct = analyzeMessageNextStep(
  "Can you confirm by Friday whether you want me to send the draft?"
);
assert.equal(direct.posture, "direct");
assert.equal(direct.decision.action, "reply now");
assert.ok(direct.metrics.directness >= 7);

const avoidant = analyzeMessageNextStep(
  "Maybe later. We'll see when things calm down."
);
assert.equal(avoidant.posture, "avoidant");
assert.equal(avoidant.decision.action, "wait");
assert.ok(avoidant.metrics.avoidance >= 5);

const heated = analyzeMessageNextStep(
  "You always do this. Call me right now!!!"
);
assert.equal(heated.posture, "heated");
assert.equal(heated.decision.action, "move to a call");
assert.ok(heated.metrics.escalation >= 6);

const vague = analyzeMessageNextStep("I don't know, maybe sometime later. We'll see.");
assert.equal(vague.decision.action, "ask one concrete question");
assert.ok(vague.metrics.ambiguity >= 5);

console.log("message-next-step tests passed");
