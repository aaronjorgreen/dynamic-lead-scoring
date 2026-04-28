# GitHub Issues Guide

This guide defines the standard process an AI Coding Agent should use when interacting with GitHub issues for this repository.

## 1. Issue Creation
- **Tool**: `mcp_github-mcp-server_issue_write` (using `method: "create"`)
- **Title**: Provide a clear, actionable summary of the bug or feature.
- **Body**: Give comprehensive details depending on the ticket type:
  - For bugs: Include steps to reproduce, expected behavior, and actual behavior.
  - For features: Include user story, requirements, and acceptance criteria.
- **Linking**: Clearly link the issue to any relevant repository files, pull requests, or other related issues in the body.

## 2. Labelling
- Agents should provide appropriate semantic labels when creating or updating issues.
- Examples include `bug`, `enhancement`, `documentation`, `help wanted`.
- Use the `labels` array property in the `mcp_github-mcp-server_issue_write` tool.

## 3. Issue Management
- **Tool**: `mcp_github-mcp-server_issue_write` (using `method: "update"`)
- Update issues as progress is made to keep the state accurate.
- If additional discussion or investigation logs are needed, utilize the `mcp_github-mcp-server_add_issue_comment` tool to append notes rather than aggressively modifying the main issue body.
- When an issue is picked up, assign it to the responsible party (or leave unassigned if working autonomously).

## 4. Issue Closure
- **Tool**: `mcp_github-mcp-server_issue_write` (using `method: "update"` and `state: "closed"`)
- Ensure all acceptance criteria have been achieved or the bug is confirmed fixed.
- If closing an issue due to alternative reasons, utilize the `state_reason` option (e.g., `completed`, `not_planned`, or `duplicate`).
- Link the pull request or commit that resolves the issue when closing it to provide traceability.
