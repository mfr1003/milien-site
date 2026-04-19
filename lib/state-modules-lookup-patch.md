# Integration Patch: Property Lookup Block into state-modules.js

## Step 1 — Add import at top of state-modules.js

Add this line at the very top of state-modules.js, before the `const STATE_MODULES = {` line:

```javascript
import { buildPropertyLookupBlock } from './property-lookup.js';
```

---

## Step 2 — Inject into buildDocumentPrompt()

In `buildDocumentPrompt()`, find the Document 3 section of the prompt string.
Currently it reads:

```javascript
═══════════════════════════════════════
DOCUMENT 3: FILING INSTRUCTIONS FOR ${claimantName.toUpperCase()}
═══════════════════════════════════════

Plain-language step-by-step instructions specific to ${module.name} law covering:

STEP 1 — SEND THE DEMAND LETTER TODAY (certified mail, why it matters)
STEP 2 — WAIT 10 DAYS (if paid, great; if not, proceed)
```

Add the property lookup block immediately after the STEP 3/4 notarization step,
before the STEP for "CONFIRM THE LEGAL DESCRIPTION." Replace:

```javascript
STEP ${...} — CONFIRM THE LEGAL DESCRIPTION (how to look it up at ${propertyCounty} County ${module.filingOffice})
```

With:

```javascript
STEP ${...} — VERIFY THE PROPERTY OWNER AND LEGAL DESCRIPTION

${buildPropertyLookupBlock(stateCode, propertyCounty)}
```

---

## Step 3 — Inject into buildAutoDocumentPrompt() (automotive track)

In `buildAutoDocumentPrompt()`, the automotive track documents don't use property
lookup (vehicle liens don't require real property descriptions). No change needed there.

---

## Step 4 — Add to each state's documentPrompt context (AI system prompt)

In each state's `documentPrompt` function, the AI receives context about what to include
in Document 3. Add this line to the KEY REQUIREMENTS section of each state's prompt:

```javascript
- PROPERTY OWNER VERIFICATION: In Document 3, include the property lookup instructions
  for ${module.name} exactly as provided in the PROPERTY LOOKUP VERIFICATION block.
  Do not paraphrase or abbreviate the lookup URL or instructions.
```

This is already handled by the shared prompt injection in Step 2 above if you use
the `buildPropertyLookupBlock()` output in the main prompt body rather than inside
the individual state `documentPrompt()` functions. Recommended approach: inject via
Step 2 at the shared level so it applies to all states uniformly.

---

## Verification check after integration

After integrating, test with at least three states:
- MI (BS&A Online — county-level with known statewide tool)
- GA (GSCCCA — true statewide portal)
- TX (CAD — county-by-county with directory)

For each, generate a test document and confirm Document 3 contains:
1. The correct lookup system name for that state
2. The correct primary URL
3. The correct legal description note
4. The critical owner-name-must-match warning

