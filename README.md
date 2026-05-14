# message-next-step

[![License: MIT](https://img.shields.io/badge/license-MIT-0F172A.svg)](LICENSE)
[![Node ≥18](https://img.shields.io/badge/node-%E2%89%A518-0F172A)](package.json)

**[Web app](https://tells.voiddo.com/message-next-step/?ref=message-next-step-readme)** · **[Live compare page](https://tells.voiddo.com/message-next-step/compare-chatgpt-gemini.html?ref=message-next-step-readme)** · **[Packaged compare brief](compare-chatgpt-gemini.md)** · **[Deep Dive](https://tells.voiddo.com/deep-dive/?ref=message-next-step-readme)** · **[Signal toolkit](https://tells.voiddo.com/signal-toolkit/?ref=message-next-step-readme)** · **[GitHub](https://github.com/voidd0/message-next-step)** · **[npm](https://www.npmjs.com/package/@v0idd0/message-next-step)** · **[All tools](https://tools.voiddo.com/?ref=message-next-step-catalog-readme)** · **[Contact](mailto:support@voiddo.com)**

---

`message-next-step` is a deterministic checker for one narrow question:

What should you do with this message right now?

It reads one incoming message and suggests one next step:

- `reply now`
- `wait`
- `ask one concrete question`
- `move to a call`
- `let it go`

It does not pretend to read the whole relationship. It gives a fast, explainable first pass when you are stuck between overreacting and overinterpreting in dating, recruiter, workplace, client, support, or family threads.

It also works as a narrower, faster alternative to ChatGPT or Gemini when the real question is not "help me think forever" but "what is the next move on this one message?"

## Why this exists

The paid product is [`tells`](https://tells.voiddo.com/?ref=message-next-step-readme), which reads what people leave unsaid across messages, people, and profiles.

But many users do not start with "analyze the whole pattern." They start with a smaller operational question:

- Should I answer this now?
- Are they asking for something real, or just creating pressure?
- Is this vague enough that I need one clarifying question?
- Is texting the wrong bandwidth for this?

That same question shows up outside dating too:

- recruiter loops where timing and seriousness are unclear
- client or account messages that may need a cleaner boundary
- support escalations that are getting too heated for chat
- family or cofounder threads where the real question is whether text is still working

`message-next-step` is that free first step. It gives a deterministic action recommendation before the user commits to a deeper paid read.

## Install

```bash
npm install -g @v0idd0/message-next-step
```

## Web app

Use the browser version here:

```text
https://tells.voiddo.com/message-next-step/?ref=message-next-step-readme
```

If you want the browser-side AI-alternative framing first:

```text
https://tells.voiddo.com/message-next-step/compare-chatgpt-gemini.html?ref=message-next-step-readme
```

If you want the packaged compare brief for npm/GitHub readers:

```text
compare-chatgpt-gemini.md
```

If the blocker is follow-up timing rather than reply content, use the sibling checker here:

```text
https://tells.voiddo.com/double-text-risk/?ref=message-next-step-readme
```

If the incoming message is warm but still too vague to treat as a real yes, check that layer here first:

```text
https://tells.voiddo.com/soft-yes-or-no/?ref=message-next-step-readme
```

## Usage

```bash
message-next-step "Can you confirm by Friday whether you want me to send the draft?"
```

```bash
cat incoming.txt | message-next-step
```

```bash
message-next-step --json "Maybe later. We'll see when things calm down."
```

```bash
message-next-step --file incoming.txt
```

## Example output

```text
posture: direct
directness: 7.9/10
ambiguity:  2.5/10
pressure:   3.2/10
escalation: 1/10
avoidance:  1/10
call shift: 1/10

next step: reply now
why: The text names a usable next step without much ambiguity.
- There is enough concrete signal to answer directly.

next:
Use tells when one message is not enough and you need the thread, the person, or the pattern over time.
- quick next paid step: https://tells.voiddo.com/deep-dive/?ref=message-next-step-cli
- recurring reads: https://tells.voiddo.com/?ref=message-next-step-cli
```

## What it scores

The tool uses transparent heuristics around six dimensions:

- `directness` — is there a real ask, timing, or next step?
- `ambiguity` — is timing or intent being left blurry?
- `pressure` — is force doing more work than content?
- `escalation` — is this message getting too hot for text?
- `avoidance` — is the sender stalling instead of deciding?
- `call shift` — are there enough cues that text is the wrong channel?

The recommendation is intentionally conservative. It is designed to stop bad reactive moves, not to invent certainty.

## Good use cases

- tense client, recruiter, or support texts
- dating or relationship messages with mixed clarity
- workplace follow-ups where you are unsure whether to push
- family messages where a call may be better than more texting
- any incoming message where your real question is "what do I do next?"

## Bad use cases

- therapy, legal, or crisis guidance
- deception detection
- full relationship analysis
- multi-message pattern reading

Those are outside this tool's scope. If the stakes are real and one message is not enough, use `tells`.

## Why not just use ChatGPT or Gemini?

Because the first question is often operational, not interpretive.

For a narrow next-step call, a deterministic tool is faster and easier to trust:

- no API key
- no prompt fiddling
- no latency roulette
- no surprise token bill
- same input gives the same output

Then, if the user needs the deeper read, the next step is not "more tokens." It is `tells`, which is built around subtext, conspicuous absence, pressure, and likely next move.

If you want the side-by-side framing inside the live browser route:

```text
https://tells.voiddo.com/message-next-step/compare-chatgpt-gemini.html?ref=message-next-step-readme
```

If you want the package-side compare brief instead:

```text
compare-chatgpt-gemini.md
```

## Paid next step

When the one-message answer is not enough, the paid ladder is simple:

- `Deep Dive` — `$19 once` for one loaded thread or one recurring person
- `Starter` — `$14.99/mo` for repeated message reading
- `Practitioner` — `$99.99/mo` for coaches, recruiters, mediators, trainers, or client-facing teams using this with clients

If the message-level answer is not enough, the fastest paid handoff is usually `Deep Dive`:

```text
https://tells.voiddo.com/deep-dive/?ref=message-next-step-readme
```

If you still want the wider browser-first free path first:

```text
https://tells.voiddo.com/signal-toolkit/?ref=message-next-step-readme
```

Start here:

```text
https://tells.voiddo.com/message-next-step/?ref=message-next-step-readme
```

## Related free checkers

If the next-step question turns out to be the wrong layer, route into the narrower free tool first:

- `double-text-risk` for deciding whether another outbound follow-up is too soon or too pushy: `https://tells.voiddo.com/double-text-risk/?ref=message-next-step-related-readme`
- `soft-yes-or-no` for deciding whether the incoming message is polite interest, real intent, or a warm stall before you commit to a direct reply: `https://tells.voiddo.com/soft-yes-or-no/?ref=message-next-step-related-readme`
- `replytone` for checking whether your drafted response sounds clear, warm, or too forceful: `https://tells.voiddo.com/replytone/?ref=message-next-step-related-readme`
- `ambiguity-meter` for scoring whether the incoming message is vague, evasive, or mixed: `https://tells.voiddo.com/ambiguity-meter/?ref=message-next-step-related-readme`
- `call-not-text` for deciding whether the thread is already too compressed or heated for another message: `https://tells.voiddo.com/call-not-text/?ref=message-next-step-related-readme`
- `ghost-or-go` for deciding whether ongoing silence means wait, one final ping, or close the loop: `https://tells.voiddo.com/ghost-or-go/?ref=message-next-step-related-readme`
- `raincheck-or-run` for deciding whether repeated reschedules and no-new-time messages are still workable or already a stall pattern: `https://tells.voiddo.com/raincheck-or-run/?ref=message-next-step-related-readme`

## Programmatic API

```javascript
import { analyzeMessageNextStep, formatReport } from "@v0idd0/message-next-step";

const result = analyzeMessageNextStep("You always do this. Call me right now!!!");

console.log(result.decision.action);
console.log(formatReport(result));
```

## Development

```bash
npm test
node bin/message-next-step.js "Maybe later. We'll see when things calm down."
```

## More from the studio

See [`from-the-studio.md`](from-the-studio.md) for the wider vøiddo catalogue.

## Compare surface

- live compare page: `https://tells.voiddo.com/message-next-step/compare-chatgpt-gemini.html?ref=message-next-step-readme`
- packaged compare brief: [`compare-chatgpt-gemini.md`](compare-chatgpt-gemini.md)

If you are positioning this tool against general-purpose AI assistants, use the dedicated comparison asset:

[`compare-chatgpt-gemini.md`](compare-chatgpt-gemini.md)

## Best next free exits

- `replytone` for checking whether your drafted response sounds warm, clear, or too forceful before you send it: `https://tells.voiddo.com/replytone/?ref=message-next-step-readme`
- `double-text-risk` for deciding whether a follow-up is timely, needy, or better left unsent: `https://tells.voiddo.com/double-text-risk/?ref=message-next-step-readme`
- `soft-yes-or-no` for deciding whether the incoming wording is a real yes, a warm maybe, or a polite stall before you over-commit to a reply: `https://tells.voiddo.com/soft-yes-or-no/?ref=message-next-step-readme`
- `ambiguity-meter` for checking whether the incoming message is vague, evasive, or mixed enough to justify a clarifier instead of a direct answer: `https://tells.voiddo.com/ambiguity-meter/?ref=message-next-step-readme`
- `call-not-text` for deciding whether the thread has outgrown text and needs a call, pause, or firmer channel switch: `https://tells.voiddo.com/call-not-text/?ref=message-next-step-readme`
- `ghost-or-go` for deciding whether ongoing silence after this message means wait, one final ping, or close the loop: `https://tells.voiddo.com/ghost-or-go/?ref=message-next-step-readme`
- `raincheck-or-run` for deciding whether repeated schedule slips, delays, or "maybe later" loops are still genuine or already a stall pattern: `https://tells.voiddo.com/raincheck-or-run/?ref=message-next-step-readme`

## License

MIT.

---

Built by [vøiddo](https://voiddo.com/) — a small studio shipping AI-flavoured products, free dev tools, Chrome extensions and weird browser games.
