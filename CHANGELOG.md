# Changelog

All notable changes to MOC Studio will be documented in this file.

## [Unreleased]

### Fixed
- **Mobile Sidebar Theme** (2026-02-13)
  - Fixed mobile sidebar (Sheet) not respecting light/dark theme
  - Changed from hardcoded dark colors to CSS variables that respond to theme
  - Mobile sidebar now correctly shows light theme when app is in light mode
  - Commit: `f65a9cd96789f303336dad020c1ef8cf6f90e63c`

### Added
- **Branding Removal** (2026-02-13)
  - Added `useRemoveBranding` hook to automatically remove third-party branding
  - Added CSS rules to hide branding elements
  - Integrated hook in App component for automatic execution
  - Commits: `91ae1cd`, `65cc623`, `753cdd2`

- **Facilities Theme Alignment** (2026-02-13)
  - Fixed Facilities page to use consistent Ultra-Modern 2026 theme
  - Changed `bg-gradient-primary` to `gradient-cyber` for icon backgrounds
  - Aligned with Dashboard theme styling
  - Commit: `e7c3eb0f6b3c767a508e7566765d8fb1e0fcf1ef`

- **MOC Approvers Workflow** (2026-02-13)
  - Created migration to setup automatic MOC approvers assignment
  - Auto-grants `approval_committee` role to administrators
  - Creates trigger to auto-assign approvers when MOC is submitted
  - Backfills existing submitted MOCs with approvers
  - Added `can_approve_mocs()` helper function
  - Files: `20260213140000_setup_moc_approvers_workflow.sql`
  - Documentation: `CODEX_PROMPT_FIX_MOC_APPROVERS.md`, `QUICK_FIX_APPROVERS.md`

## Previous Changes

### 2026-02-12
- Enhanced Dashboard with Ultra-Modern 2026 theme
- Added 27 example MOCs with diverse formats
- Implemented glassmorphism cards and neon gradients

### 2026-02-09
- Initial database schema setup
- User roles and permissions system
- MOC request workflow implementation

---

## Version Format

This project follows [Semantic Versioning](https://semver.org/):
- MAJOR version for incompatible API changes
- MINOR version for new functionality in a backwards compatible manner
- PATCH version for backwards compatible bug fixes

## Categories

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes
