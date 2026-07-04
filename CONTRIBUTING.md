# Contributing to OpenDataset Explorer

Thank you for helping improve this dataset discovery tool. Contributions are welcome for dataset entries, bug fixes, UI improvements, and documentation.

## What we accept

### Dataset contributions

- Well-known research repositories, cohorts, and data platforms
- Accurate metadata verified against official sources
- Neutral, factual descriptions (no marketing language)

### Code contributions

- Bug fixes and accessibility improvements
- Performance improvements that stay within the static-site architecture
- UI polish that matches the existing clinical/reference style

## What we do not accept

- Claims that the catalog is exhaustive or authoritative
- Scraped or unverified metadata
- Backend services, analytics, or user tracking
- Datasets linking to unofficial mirrors or pirated content
- Entries for individual study datasets inside a platform (add the platform/repository instead, unless it is a landmark standalone resource)

## Dataset contribution process

1. Read [DATA_SOURCES.md](./DATA_SOURCES.md) for the schema and field definitions.
2. Add or update an entry in `src/data/datasets.json`.
3. Verify the official source URL and access policy.
4. Run checks locally:

   ```bash
   npm install
   npm run verify
   npm run build
   ```

5. Open a pull request describing:
   - What you added or changed
   - The official source you consulted
   - The date you verified the information

### PR title examples

- `Add NHANES dataset entry`
- `Update UK Biobank access type and last_verified`
- `Fix OpenNeuro modality tags`

## Code contribution process

1. Fork the repository and create a feature branch.
2. Keep changes focused and minimal.
3. Match existing code style (TypeScript, functional React components, plain CSS).
4. Ensure `npm run build` and `npm run verify` pass.
5. Open a pull request with a clear description and screenshots for UI changes.

## Style guidelines

- **UI:** Clean, professional, reference-tool aesthetic. Mobile-first.
- **Copy:** Factual, concise, no hype. Include limitations where relevant.
- **IDs:** Lowercase, hyphen-separated (`my-dataset-name`).
- **Dates:** ISO format `YYYY-MM-DD` for `last_verified`.

## Review criteria

Reviewers will check:

- Metadata accuracy against official sources
- Unique `id` and valid JSON schema
- Appropriate `access_type` and `license` fields
- No tracking, backend dependencies, or scope creep
- Build and verify scripts pass

## Questions

Open an issue for questions about whether a dataset fits the catalog scope, or to report incorrect metadata.

## Disclaimer

Contributors are responsible for ensuring information is accurate at the time of submission. The maintainers may edit entries for clarity, consistency, or corrections without implying endorsement.
