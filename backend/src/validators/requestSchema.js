// Validates and cleans the body of POST /api/review.
// Returns { ok: true, value } or { ok: false, errors: [...] }.
import sampleProfile from "../data/sampleBrandProfile.json" with { type: "json" };

const LIMITS = {
  brandName: 60,
  voiceItems: 10,
  voiceLength: 40,
  listItems: 50,
  termLength: 60,
  notes: 500,
};

function cleanString(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanStringList(value, maxItems, maxLength) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => cleanString(item, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function cleanTermPairs(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((pair) => ({
      from: cleanString(pair?.from, LIMITS.termLength),
      to: cleanString(pair?.to, LIMITS.termLength),
    }))
    .filter((pair) => pair.from && pair.to)
    .slice(0, LIMITS.listItems);
}

export function cleanBrandProfile(profile) {
  if (profile === undefined || profile === null) return structuredClone(sampleProfile);
  return {
    brandName: cleanString(profile.brandName, LIMITS.brandName) || "Your brand",
    voice: cleanStringList(profile.voice, LIMITS.voiceItems, LIMITS.voiceLength),
    avoidWords: cleanStringList(profile.avoidWords, LIMITS.listItems, LIMITS.termLength),
    preferredTerms: cleanTermPairs(profile.preferredTerms),
    notes: cleanString(profile.notes, LIMITS.notes),
  };
}

export function validateReviewRequest(body, maxTextLength) {
  const errors = [];
  if (!body || typeof body !== "object") {
    return { ok: false, errors: ["Request body must be a JSON object."] };
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) errors.push("Please enter some content to review.");
  if (text.length > maxTextLength) {
    errors.push(`Content is too long. Please keep it under ${maxTextLength} characters.`);
  }
  if (
    body.brandProfile !== undefined &&
    (typeof body.brandProfile !== "object" || body.brandProfile === null || Array.isArray(body.brandProfile))
  ) {
    errors.push("brandProfile must be an object.");
  }
  if (errors.length > 0) return { ok: false, errors };

  return { ok: true, value: { text, brandProfile: cleanBrandProfile(body.brandProfile) } };
}
