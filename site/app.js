import { analyzeMessageNextStep } from "../src/index.js";

const examples = {
  direct: {
    text: "Can you confirm by Friday whether you want me to send the draft?"
  },
  vague: {
    text: "Maybe later. We'll see when things calm down."
  },
  heated: {
    text: "You always do this. Call me right now!!!"
  }
};

const upgradeOffers = [
  {
    key: "deep-dive",
    label: "Deep Dive",
    price: "$19 once",
    href: "https://tells.voiddo.com/deep-dive/?ref=message-next-step-deep-dive",
    note: "Use when one incoming message is only the entry point into a loaded thread or recurring person."
  },
  {
    key: "starter",
    label: "Starter",
    price: "$14.99/mo",
    href: "https://tells.voiddo.com/?ref=message-next-step-starter",
    note: "Use when you keep reading real incoming messages and want recurring message-level support."
  },
  {
    key: "practitioner",
    label: "Practitioner",
    price: "$99.99/mo",
    href: "https://tells.voiddo.com/for-coaches/?ref=message-next-step-practitioner",
    note: "Use when incoming-message analysis becomes part of coaching, recruiting, mediation, or support workflows."
  }
];

const metricOrder = [
  ["directness", "directness"],
  ["ambiguity", "ambiguity"],
  ["pressure", "pressure"],
  ["escalation", "escalation"],
  ["avoidance", "avoidance"],
  ["callShift", "call shift"]
];

const messageInput = document.querySelector("#message-input");
const analyzeButton = document.querySelector("#analyze-button");
const clearButton = document.querySelector("#clear-button");
const decisionChip = document.querySelector("#decision-chip");
const postureChip = document.querySelector("#posture-chip");
const summaryLine = document.querySelector("#summary-line");
const counterLine = document.querySelector("#counter-line");
const whyList = document.querySelector("#why-list");
const meterGrid = document.querySelector("#meter-grid");
const promptsList = document.querySelector("#prompts-list");
const primaryUpgradeLink = document.querySelector("#primary-upgrade-link");
const examplePills = [...document.querySelectorAll(".example-pill")];

function meterState(name, value) {
  if (name === "directness") {
    return value >= 6 ? "good" : value >= 4.5 ? "warn" : "alert";
  }
  if (name === "ambiguity" || name === "pressure" || name === "escalation" || name === "avoidance" || name === "callShift") {
    return value >= 6 ? "alert" : value >= 4.5 ? "warn" : "good";
  }
  return "good";
}

function chooseUpgrade(result) {
  if (result.decision.action === "move to a call" || result.metrics.callShift >= 6) {
    return {
      featuredKey: "starter",
      summary:
        "If the thread keeps compressing nuance into bad texting, recurring support is stronger than another one-off guess."
    };
  }

  if (result.metrics.ambiguity >= 6 || result.metrics.avoidance >= 5.5) {
    return {
      featuredKey: "deep-dive",
      summary:
        "If the wording keeps you filling in missing intent, move into a fuller thread or person-level read instead of re-reading the same sentence."
    };
  }

  if (result.metrics.pressure >= 5.5 && result.metrics.directness < 5.5) {
    return {
      featuredKey: "practitioner",
      summary:
        "High-pressure, low-clarity messaging tends to repeat across clients, recruits, and relationships. The practitioner lane fits repeated analysis work."
    };
  }

  return {
    featuredKey: "deep-dive",
    summary:
      "If this one-message answer still leaves doubt, the next paid step is not more broad prompting. It is a fuller read of the thread or person."
  };
}

function renderMeters(metrics) {
  meterGrid.innerHTML = "";
  metricOrder.forEach(([name, label]) => {
    const value = metrics[name];
    const card = document.createElement("article");
    card.className = `meter-card ${meterState(name, value)}`;
    card.innerHTML = `
      <div class="meter-top">
        <span class="meter-name">${label}</span>
        <span class="meter-value">${value.toFixed(1)}/10</span>
      </div>
      <div class="meter-track" aria-hidden="true">
        <div class="meter-fill" style="width:${Math.max(4, value * 10)}%"></div>
      </div>
    `;
    meterGrid.append(card);
  });
}

function renderUpgradePath(result) {
  const upgrade = chooseUpgrade(result);
  const featured = upgradeOffers.find((offer) => offer.key === upgrade.featuredKey);
  primaryUpgradeLink.href = featured.href;
  primaryUpgradeLink.textContent =
    featured.key === "deep-dive" ? "use the $19 Deep Dive" : featured.key === "starter"
      ? "move into tells Starter"
      : "use Practitioner";

  const items = [];

  const summaryItem = document.createElement("li");
  summaryItem.textContent = upgrade.summary;
  items.push(summaryItem);

  const paidItem = document.createElement("li");
  paidItem.textContent = `${featured.label} ${featured.price} is the best next paid step if this one-message check is not enough.`;
  items.push(paidItem);

  return items;
}

function resetWaitingState() {
  decisionChip.textContent = "paste a message";
  decisionChip.dataset.verdict = "waiting";
  postureChip.textContent = "waiting";
  summaryLine.textContent =
    "Use one incoming message to get a deterministic next-step call before you overreply, overwait, or overread.";
  counterLine.textContent = "0 words · 0 questions";
  whyList.innerHTML = "<li>Paste one incoming message to get a deterministic action recommendation.</li>";
  promptsList.innerHTML =
    "<li>This checker is narrow on purpose. It scores one incoming message, not the whole relationship, account, or chat history.</li>";
  meterGrid.innerHTML = "";
}

function renderResult() {
  const text = String(messageInput.value || "").trim();
  if (!text) {
    resetWaitingState();
    return null;
  }

  const result = analyzeMessageNextStep(text);
  decisionChip.textContent = result.decision.action;
  decisionChip.dataset.verdict = result.decision.action;
  postureChip.textContent = result.posture;
  summaryLine.textContent = result.decision.summary;
  counterLine.textContent = `${result.counters.words} words · ${result.counters.questions} question${result.counters.questions === 1 ? "" : "s"}`;

  whyList.innerHTML = "";
  result.decision.reasons.forEach((line) => {
    const item = document.createElement("li");
    item.textContent = line;
    whyList.append(item);
  });

  promptsList.innerHTML = "";
  const promptLines = result.followUps.length
    ? result.followUps
    : ["No follow-up prompt is needed yet. The current message already supports a cleaner direct move."];
  promptLines.forEach((line) => {
    const item = document.createElement("li");
    item.textContent = line;
    promptsList.append(item);
  });

  const freeMove = document.createElement("li");
  freeMove.textContent =
    "If the message sounds warm but still too vague to trust, switch to soft-yes-or-no before you overcommit to the reply.";
  promptsList.append(freeMove);

  const delayMove = document.createElement("li");
  delayMove.textContent =
    "If this turns into delay, reschedule, or no-new-time loops instead of a real answer, switch to raincheck-or-run next.";
  promptsList.append(delayMove);

  renderUpgradePath(result).forEach((item) => promptsList.append(item));
  renderMeters(result.metrics);
  return result;
}

function setExample(name) {
  const example = examples[name];
  examplePills.forEach((pill) => {
    const isActive = pill.dataset.example === name;
    pill.classList.toggle("active", isActive);
    pill.setAttribute("aria-pressed", String(isActive));
  });
  messageInput.value = example.text;
  renderResult();
}

analyzeButton.addEventListener("click", renderResult);
clearButton.addEventListener("click", () => {
  messageInput.value = "";
  resetWaitingState();
  messageInput.focus();
});

messageInput.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    renderResult();
  }
});

examplePills.forEach((pill) => {
  pill.addEventListener("click", () => setExample(pill.dataset.example));
});

setExample("direct");
