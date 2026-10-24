import { test } from "node:test";
import assert from "node:assert/strict";
import { runRules, buildRevisedDraft } from "../src/services/ruleEngine.js";

const profile = {
  brandName: "Northstar",
  voice: [],
  avoidWords: ["guaranteed", "world-class"],
  preferredTerms: [{ from: "cheap", to: "affordable" }],
  notes: "",
};

test("flags an avoid-list word as high severity terminology", () => {
  const issues = runRules("Our service is world-class.", profile);
  assert.equal(issues.length, 1);
  assert.equal(issues[0].category, "terminology");
  assert.equal(issues[0].severity, "high");
  assert.equal(issues[0].snippet, "world-class");
});

test("avoid-list wins over claim rule for the same word (no duplicate noise)", () => {
  const issues = runRules("Results are guaranteed.", profile);
  assert.equal(issues.length, 1);
  assert.equal(issues[0].category, "terminology");
});

test("claim rules flag guarantees when the word is not in the avoid list", () => {
  const issues = runRules("We guarantee fast delivery.", { ...profile, avoidWords: [] });
  assert.equal(issues[0].category, "claim_risk");
  assert.match(issues[0].reason, /not a statement that the claim is false/);
});

test("preferred term is flagged and replaced with matching capitalisation", () => {
  const text = "Cheap plans for everyone.";
  const issues = runRules(text, profile);
  assert.match(issues[0].suggestion, /Replace .Cheap. with .Affordable./);
  assert.equal(buildRevisedDraft(text, issues), "Affordable plans for everyone.");
});

test("does not match inside longer words", () => {
  assert.equal(runRules("The cheaper option and escheat.", profile).length, 0);
});

test("flags statistics, repeated exclamation marks and all-caps words", () => {
  const text = "AMAZING 40% today!!!";
  const categories = runRules(text, { ...profile, avoidWords: [] }).map((i) => i.category).sort();
  assert.deepEqual(categories, ["claim_risk", "style", "tone"]);
});

test("revised draft only applies safe replacements and keeps risky claims for a human", () => {
  const text = "Guaranteed results!!!";
  const issues = runRules(text, profile);
  assert.equal(buildRevisedDraft(text, issues), "Guaranteed results!");
});

test("clean text produces no findings", () => {
  assert.deepEqual(runRules("Welcome to our new plans.", profile), []);
});

test("issues are sorted by severity", () => {
  const issues = runRules("Cheap and guaranteed!!!", profile);
  assert.deepEqual(issues.map((i) => i.severity), ["high", "medium", "low"]);
});
