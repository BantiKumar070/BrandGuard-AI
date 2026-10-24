// Converts between the brand profile object (used by the API) and plain-text form fields.
const splitList = (text) => text.split(/[,\n]/).map((item) => item.trim()).filter(Boolean);

export function profileToForm(profile) {
  return {
    brandName: profile.brandName || "",
    voice: (profile.voice || []).join(", "),
    avoidWords: (profile.avoidWords || []).join(", "),
    preferredTerms: (profile.preferredTerms || []).map((pair) => `${pair.from} -> ${pair.to}`).join("\n"),
    notes: profile.notes || "",
  };
}

export function formToProfile(form) {
  const preferredTerms = form.preferredTerms
    .split("\n")
    .map((line) => line.split("->").map((part) => part.trim()))
    .filter(([from, to]) => from && to)
    .map(([from, to]) => ({ from, to }));
  return {
    brandName: form.brandName.trim(),
    voice: splitList(form.voice),
    avoidWords: splitList(form.avoidWords),
    preferredTerms,
    notes: form.notes.trim(),
  };
}
