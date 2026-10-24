import { test } from "node:test";
import assert from "node:assert/strict";
import { createReviewHandler } from "../src/routes/reviewHandler.js";

function fakeRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
}

test("returns 400 with a friendly message for empty content", async () => {
  const res = fakeRes();
  await createReviewHandler()({ body: { text: "" } }, res);
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.error.code, "INVALID_REQUEST");
});

test("returns a full review for normal content", async () => {
  const res = fakeRes();
  await createReviewHandler()({ body: { text: "Cheap and guaranteed!!!" } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.analysisMode, "rules_only");
  assert.equal(res.body.humanReviewRequired, true);
  assert.equal(res.body.overallAssessment, "needs_review");
  assert.ok(res.body.issues.length >= 3);
  assert.deepEqual(Object.keys(res.body.issues[0]).sort(), ["category", "reason", "severity", "snippet", "suggestion"]);
});

test("changing the avoid list changes the result", async () => {
  const send = async (avoidWords) => {
    const res = fakeRes();
    await createReviewHandler()({ body: { text: "A fantastic offer.", brandProfile: { brandName: "X", avoidWords } } }, res);
    return res.body.issues.length;
  };
  assert.equal(await send([]), 0);
  assert.equal(await send(["fantastic"]), 1);
});

test("hides internal errors from the user", async () => {
  const res = fakeRes();
  const handler = createReviewHandler({ review: async () => { throw new Error("secret stack detail"); } });
  await handler({ body: { text: "Hello" } }, res);
  assert.equal(res.statusCode, 500);
  assert.doesNotMatch(JSON.stringify(res.body), /secret/);
});

test("handles very long input with a clear error", async () => {
  const res = fakeRes();
  await createReviewHandler({ maxTextLength: 50 })({ body: { text: "a".repeat(51) } }, res);
  assert.equal(res.statusCode, 400);
  assert.match(res.body.error.message, /too long/);
});
