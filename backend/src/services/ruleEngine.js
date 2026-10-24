// Deterministic checks: exact words, preferred terms, risky claims and simple style problems.
// Every finding follows the shape documented in PROJECT_MASTER_PLAN.txt (section 12).

const SEVERITY_ORDER = { high: 0, medium: 1, low: 2 };

const CLAIM_PATTERNS = [
  {
    regex: /\b(?:guarantee[ds]?|guaranteeing)\b/gi,
    severity: "high",
    reason: "This is an absolute promise that is hard to prove.",
  },
  {
    regex: /\b100\s?%/g,
    severity: "high",
    reason: "A 100% claim is absolute and usually needs strong supporting evidence.",
  },
  {
    regex: /\b(?:clinically proven|scientifically proven|proven to|risk[- ]free|no side effects|cures?|miracle)\b/gi,
    severity: "high",
    reason: "Health or result claims like this need approved evidence before publishing.",
  },
  {
    regex: /(?:#\s?1\b|\bno\.?\s?1\b|\bnumber one\b|\bbest\b|\bunbeatable\b|\bworld'?s (?:best|leading|first)\b)/gi,
    severity: "medium",
    reason: "A superlative or ranking claim should be backed by an approved source.",
  },
  {
    regex: /\b\d{1,3}(?:\.\d+)?\s?(?:%|percent)/gi,
    severity: "medium",
    reason: "A statistic should point to an approved, current source.",
  },
];

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Whole-word / whole-phrase matcher so "cheap" does not match "cheaper" or "escheat".
function phraseRegex(phrase) {
  return new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegex(phrase)}(?![\\p{L}\\p{N}])`, "giu");
}

function findAll(regex, text) {
  return [...text.matchAll(regex)].map((match) => ({
    snippet: match[0],
    start: match.index,
    end: match.index + match[0].length,
  }));
}

function overlaps(issue, others) {
  return others.some((other) => issue.start < other.end && other.start < issue.end);
}

function matchCase(original, replacement) {
  if (original === original.toUpperCase() && original.length > 1) return replacement.toUpperCase();
  if (original[0] === original[0].toUpperCase()) return replacement[0].toUpperCase() + replacement.slice(1);
  return replacement;
}

function checkAvoidWords(text, profile) {
  return profile.avoidWords.flatMap((word) =>
    findAll(phraseRegex(word), text).map((hit) => ({
      ...hit,
      category: "terminology",
      severity: "high",
      reason: `“${word}” is on the brand's avoid list.`,
      suggestion: "Try specific wording you can support.",
    }))
  );
}

function checkPreferredTerms(text, profile) {
  return profile.preferredTerms.flatMap(({ from, to }) =>
    findAll(phraseRegex(from), text).map((hit) => ({
      ...hit,
      category: "terminology",
      severity: "medium",
      reason: `Use the approved term “${to}” rather than “${from}”.`,
      suggestion: `Replace “${hit.snippet}” with “${matchCase(hit.snippet, to)}” where appropriate.`,
      replacement: matchCase(hit.snippet, to),
    }))
  );
}

function checkClaims(text) {
  return CLAIM_PATTERNS.flatMap(({ regex, severity, reason }) =>
    findAll(new RegExp(regex.source, regex.flags), text).map((hit) => ({
      ...hit,
      category: "claim_risk",
      severity,
      reason: `${reason} Verify it against approved evidence; this is not a statement that the claim is false.`,
      suggestion: "Add an approved source or soften the wording.",
    }))
  );
}

function checkStyle(text) {
  const exclamations = findAll(/!{2,}/g, text).map((hit) => ({
    ...hit,
    category: "style",
    severity: "low",
    reason: "Repeated exclamation marks can feel pushy.",
    suggestion: 'Try a single “!” or none.',
    replacement: "!",
  }));
  const shouting = findAll(/\b\p{Lu}{5,}\b/gu, text).map((hit) => ({
    ...hit,
    category: "tone",
    severity: "low",
    reason: "Words in all capitals can read as shouting.",
    suggestion: "Try normal capitalisation.",
    replacement: hit.snippet[0] + hit.snippet.slice(1).toLowerCase(),
  }));
  return [...exclamations, ...shouting];
}

// Keeps the most specific finding when two rules flag the same text.
function removeOverlaps(issues) {
  const kept = [];
  issues.forEach((issue) => {
    if (!overlaps(issue, kept)) kept.push(issue);
  });
  return kept;
}

export function runRules(text, brandProfile) {
  const prioritised = [
    ...checkAvoidWords(text, brandProfile),
    ...checkPreferredTerms(text, brandProfile),
    ...checkClaims(text),
    ...checkStyle(text),
  ];
  return removeOverlaps(prioritised).sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || a.start - b.start
  );
}

// Builds a suggested draft by applying only safe, mechanical replacements.
// Avoid-words and risky claims are NOT rewritten automatically - a human decides those.
export function buildRevisedDraft(text, issues) {
  return issues
    .filter((issue) => issue.replacement)
    .sort((a, b) => b.start - a.start)
    .reduce((draft, issue) => draft.slice(0, issue.start) + issue.replacement + draft.slice(issue.end), text);
}
