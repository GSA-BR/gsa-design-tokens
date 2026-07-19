#!/usr/bin/env bash
# CHANGELOG gate (ADR-0020 D2 / Painel R-4, hardened per review EX-3):
# the tag name is matched LITERALLY — never interpreted as a regex — so
# `v2.0.0` cannot be satisfied by a line like `## v2x0x0`.
#
# Usage: check-changelog.sh <tag> [changelog-file]
set -euo pipefail

TAG="${1:?usage: check-changelog.sh <tag> [changelog-file]}"
FILE="${2:-CHANGELOG.md}"

# Accept exactly: "## <tag>" at line start, followed by end-of-line or a
# separator that cannot be part of a version (space or em dash). A hyphen is
# NOT a valid separator: it can start a semver prerelease (v1.0.0-rc.1), so
# accepting "## <tag>-"* would let tag v1.0.0 pass on an rc-only entry.
while IFS= read -r line; do
  case "$line" in
    "## ${TAG}" | "## ${TAG} "* | "## ${TAG}—"*)
      echo "CHANGELOG entry found for ${TAG}."
      exit 0
      ;;
  esac
done < "$FILE"

echo "::error::no ${FILE} entry found for ${TAG} — the release job fails without one." >&2
exit 1
