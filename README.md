# Gemini PR Reviewer

🚀 **Gemini PR Reviewer** is a custom GitHub Action that leverages the power of Google's Gemini AI (`gemini-1.5-flash`) to automatically review your Pull Requests. It acts as a Senior Software Engineer, reviewing your git diff for bugs, performance issues, and security vulnerabilities, and posts a professional, actionable comment directly on your PR.

## Features

- **Automated Code Review:** Get instant feedback on your PRs as soon as they are opened or updated.
- **AI-Powered Insights:** Uses the advanced `gemini-1.5-flash` model for high-quality, context-aware code analysis.
- **Easy Integration:** Simple to set up in any GitHub repository with minimal configuration.

## Inputs

| Name | Description | Required |
|------|-------------|----------|
| `github-token` | The GitHub token for your repository (usually `${{ secrets.GITHUB_TOKEN }}`). | **Yes** |
| `gemini-api-key` | Your Google Gemini API Key. You need to store this in your GitHub repository secrets. | **Yes** |

## Usage

Create a new file in your repository at `.github/workflows/review.yml` and add the following configuration:

```yaml
name: "AI Code Review"

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  pull-requests: write
  contents: read

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Gemini PR Reviewer
        uses: ./ # Replace with your action's repo like `username/repo-name@v1` if using externally
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          gemini-api-key: ${{ secrets.GEMINI_API_KEY }}
```

> **Important**: Ensure you have added `GEMINI_API_KEY` to your repository's **Secrets and variables > Actions**.

## How It Works

1. The action triggers on `pull_request` events.
2. It fetches the raw git diff of the pull request using the GitHub API.
3. The diff is sent to Google's Gemini API with a strict prompt to review the code for:
   - Bugs 🐛
   - Performance Issues ⚡️
   - Security Vulnerabilities 🔒
4. Gemini returns a concise, actionable review.
5. The action posts the review as a comment on the PR.

## Development

If you'd like to contribute or modify this action:

1. Clone the repository and run `npm install`.
2. Make your changes in `index.js`.
3. Run `npm run build` to compile the action using `@vercel/ncc`.
4. Commit both `index.js` and the updated `dist/` directory.

## License

This project is licensed under the MIT License.
