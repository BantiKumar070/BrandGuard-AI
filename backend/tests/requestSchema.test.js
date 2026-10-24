import { test } from "node:test";
import assert from "node:assert/strict";
import { validateReviewRequest } from "../src/validators/requestSchema.js";

test("rejects missing or empty text", () => {
  assert.equal(validateReviewRequest({}, 100).ok, false);
  assert.equal(validateReviewRequest({ text: "   " }, 100).ok, false);
});

test("rejects text over the limit", () => {
  const result = validateReviewRequest({ text: "a".repeat(101) }, 100);
  assert.equal(result.ok, false);
  assert.match(result.errors[0], /too long/);
});

test("rejects a non-object body and a non-object profile", () => {
  assert.equal(validateReviewRequest(null, 100).ok, false);
  assert.equal(validateReviewRequest({ text: "hi", brandProfile: "x" }, 100).ok, false);
});

test("uses the sample profile when none is sent", () => {
  const result = validateReviewRequest({ text: "Hello" }, 100);
  assert.equal(result.ok, true);
  assert.equal(result.value.brandProfile.brandName, "Acme Core");
});

test("cleans a messy profile", () => {
  const result = validateReviewRequest(
    { text: "Hello", brandProfile: { brandName: "  Acme ", avoidWords: [" bad ", "", 5], preferredTerms: [{ from: "a", to: "" }, { from: "x", to: "y" }] } },
    100
  );
  assert.deepEqual(result.value.brandProfile.avoidWords, ["bad"]);
  assert.deepEqual(result.value.brandProfile.preferredTerms, [{ from: "x", to: "y" }]);
  assert.equal(result.value.brandProfile.brandName, "Acme");
});
