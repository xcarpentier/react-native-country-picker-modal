# Demo assets

Media used by the repository README. Nothing here is published to npm — the
package's `files` allowlist is limited to `src` and `lib`, so these files cost
GitHub clones only, never the tarball consumers download.

## Files

| File          | Referenced as  | Intrinsic size | Rendered at |
| ------------- | -------------- | -------------- | ----------- |
| `iOS.gif`     | iOS column     | 400 × 761      | 200 wide    |
| `Android.gif` | Android column | 400 × 733      | 200 wide    |
| `Web.gif`     | Web column     | 400 × 744      | 200 wide    |

Only `width` is set in the README `<img>` tags, never `height` — the three
clips have slightly different aspect ratios, and a shared fixed height would
squash them by a few percent each.

## Referencing them

The root README uses absolute `raw.githubusercontent.com` URLs rather than
relative paths, because npmjs.com renders the README without the repository
alongside it — a relative path shows a broken image on the package page. The
URLs point at `master`, so a new GIF goes live when its branch merges.

## Recording

Capture the example app (`yarn example start`) rather than a production app, so
the demo matches the props the README documents. Keep each clip under ~5 MB;
GitHub serves them on every README view, and a heavy GIF makes the page crawl.
