# Data Sources Guide

This document explains how to add, update, or remove datasets in OpenDataset Explorer.

## Where data lives

All dataset records are stored in a single JSON file:

```
src/data/datasets.json
```

The app loads this file at build time. There is no runtime API or database.

## Dataset schema

Each object in the array must include these fields:

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique slug (lowercase, hyphenated). Used in URLs. |
| `name` | string | Display name |
| `short_description` | string | One- to two-sentence summary |
| `topics` | string[] | Research topics (e.g. `depression`, `genomics`) |
| `domains` | string[] | Broad fields (e.g. `biomedical`, `social science`) |
| `modalities` | string[] | Data types (e.g. `MRI`, `survey`, `tabular`) |
| `country_or_region` | string | Geographic scope |
| `population` | string | Who the data describes |
| `human_participants` | boolean | Whether data includes human participants |
| `sample_size` | number \| null | Approximate N; use `null` if varies or unknown |
| `longitudinal` | boolean | Whether the study/resource is longitudinal |
| `access_type` | string | One of: `open_access`, `restricted`, `application_required` |
| `license` | string | License or access policy name |
| `data_format` | string[] | File formats (e.g. `CSV`, `BIDS`) |
| `repository` | string | Hosting organization or platform |
| `url` | string | Official source URL (https) |
| `citation` | string | Recommended citation text |
| `last_verified` | string | ISO date `YYYY-MM-DD` when metadata was last checked |
| `tags` | string[] | Additional search keywords |
| `notes` | string | Helpful context for researchers |
| `limitations` | string | Caveats, access constraints, coverage gaps |
| `see_also` | object[] (optional) | Related open-access resources — see below |

### Optional: `see_also` links

Each `see_also` object can link to another catalog entry or an external resource:

| Field | Type | Description |
|---|---|---|
| `id` | string (optional) | Catalog `id` for in-app links (e.g. `zenodo`) |
| `name` | string | Display name |
| `url` | string (optional) | External https URL (use when `id` is omitted) |
| `description` | string (optional) | Short context shown on detail pages |

Either `id` or `url` should be provided. Use `id` for entries in this catalog; use `url` for external registries and tools.

### Example entry

```json
{
  "id": "example-cohort",
  "name": "Example Cohort Study",
  "short_description": "Brief description of the resource.",
  "topics": ["mental health", "depression"],
  "domains": ["biomedical"],
  "modalities": ["questionnaire", "MRI"],
  "country_or_region": "United States",
  "population": "Adults aged 18+",
  "human_participants": true,
  "sample_size": 10000,
  "longitudinal": true,
  "access_type": "application_required",
  "license": "Study-specific DUA",
  "data_format": ["CSV"],
  "repository": "Example Repository",
  "url": "https://example.org/dataset",
  "citation": "Author A, et al. Title. Journal. Year.",
  "last_verified": "2026-03-01",
  "tags": ["cohort", "depression"],
  "notes": "Registration required.",
  "limitations": "US-only population."
}
```

## Search indexing

Fuse.js searches these fields (weighted):

- `name`
- `short_description`
- `topics`
- `tags`
- `modalities`
- `repository`
- `country_or_region`
- `citation`

Use descriptive `topics` and `tags` so researchers can find datasets by keyword.

## Filter facets

Filters are derived automatically from unique values in the JSON file, except:

- **Access type** — fixed enum (`open_access`, `restricted`, `application_required`)
- **Longitudinal** / **Human participants** — boolean fields on each record
- **Sample size** — numeric range filter on `sample_size` (records with `null` are excluded when a range is set)

## Adding a new dataset

1. Confirm the resource has an official public page or documentation.
2. Copy an existing entry in `datasets.json` as a template.
3. Assign a unique `id` (check existing IDs first).
4. Fill all required fields accurately — do not guess access policies or licenses.
5. Set `last_verified` to today's date.
6. Run validation:

   ```bash
   npm run verify
   npm run build
   ```

7. Open a pull request with your changes.

## Updating an existing dataset

1. Find the entry by `id` in `datasets.json`.
2. Update only fields that have changed at the source.
3. Bump `last_verified` to the date you re-checked the source.
4. Run `npm run verify` and `npm run build`.

## Removing a dataset

Remove the object from the array. If the resource is deprecated, consider keeping the entry with updated `notes` and `limitations` pointing users to a successor instead of deleting outright.

## Quality standards

- Link to the **official** source URL, not mirrors or unofficial copies.
- Do not claim completeness or endorse specific datasets.
- Prefer primary program/repository pages over blog posts.
- Use `null` for `sample_size` when the platform hosts many studies with varying N.
- Keep `short_description` factual and neutral.

## Validation checklist

Before submitting:

- [ ] `id` is unique and URL-safe
- [ ] `url` resolves and points to the official source
- [ ] `access_type` matches the source's current policy
- [ ] `citation` is accurate or uses a standard repository citation format
- [ ] `last_verified` is updated
- [ ] `npm run verify` passes
- [ ] `npm run build` succeeds

## OSF integration

The catalog includes an [Open Science Framework (OSF)](https://osf.io/) platform entry (`id: osf`). To refresh OSF metadata from the official API at build or maintenance time:

```bash
npm run sync:osf
```

This script fetches the current public resource count from the OSF API v2 and updates the OSF entry's `notes` and `last_verified` fields in `datasets.json`. It does not ingest individual OSF projects — add the platform, not per-study uploads (see [CONTRIBUTING.md](./CONTRIBUTING.md)).

External open-access discovery tools are listed in `src/data/open-access-resources.json` and shown on the About page.
