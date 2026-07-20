const core = require('@actions/core');
const github = require('@actions/github');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function run() {
  try {
    // 1. Get Inputs
    const githubToken = core.getInput('github-token', { required: true });
    const geminiApiKey = core.getInput('gemini-api-key', { required: true });

    // 2. Verify we are on a pull_request event
    const context = github.context;
    if (context.eventName !== 'pull_request') {
      core.setFailed('This action only runs on pull_request events.');
      return;
    }

    const payload = context.payload;
    if (!payload.pull_request) {
      core.setFailed('Pull request payload is missing.');
      return;
    }

    const prNumber = payload.pull_request.number;
    const owner = context.repo.owner;
    const repo = context.repo.repo;

    // 3. Get the raw diff of the pull request using Octokit
    const octokit = github.getOctokit(githubToken);
    
    // Fetch PR data with custom mediaType to get diff
    const { data: diff } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
      mediaType: {
        format: 'diff',
      },
    });

    if (!diff) {
      core.info('No diff found. Nothing to review.');
      return;
    }

    // 4. Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // 5. Construct the Prompt for the Senior Engineer persona
    const prompt = `Act as a Senior Software Engineer. Please review the following git diff for bugs, performance issues, and security vulnerabilities. 
Keep your feedback concise, actionable, and professional. 
Focus only on significant issues.

Here is the git diff:
${diff}
`;

    // 6. Generate Review
    const result = await model.generateContent(prompt);
    const reviewComment = result.response.text();

    // 7. Post the Review as a Comment on the PR
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: reviewComment,
    });

    core.info('Successfully posted the Gemini review on the pull request!');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
