<div align="center">
    <img src="https://raw.githubusercontent.com/agentuity/cli/refs/heads/main/.github/Agentuity.png" alt="Agentuity" width="100"/> <br/>
    <strong>Build Agents, Not Infrastructure</strong> <br/>
<br />
</div>

# 🤖 NodeJS Agent Project

Welcome to your Agentuity NodeJS Agent project! This README provides essential information to help you get started with developing, testing, and deploying your AI agents.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 22 or higher

## 🚀 Getting Started

### Authentication

Before using Agentuity, you need to authenticate:

```bash
agentuity login
```

This command will open a browser window where you can log in to your Agentuity account.

### Creating a New Agent

To create a new agent in your project:

```bash
agentuity agent new
```

Follow the interactive prompts to configure your agent.

### Development Mode

Run your project in development mode with:

```bash
agentuity dev
```

This will start your project and open a new browser window connecting your Agent to the Agentuity Console in Live Mode, allowing you to test and debug your agent in real-time.

## 🌐 Deployment

When you're ready to deploy your agent to the Agentuity Cloud:

```bash
agentuity deploy
```

This command will bundle your agent and deploy it to the cloud, making it accessible via the Agentuity platform.

## 📚 Project Structure

```
├── agents/             # Agent definitions and implementations
├── node_modules/       # Dependencies
├── package.json        # Project dependencies and scripts
└── agentuity.yaml      # Agentuity project configuration
```

## 🔧 Configuration

Your project configuration is stored in `agentuity.yaml`. This file defines your agents, development settings, and deployment configuration.

## ✉️ Email Actions

The `actions` agent can create and store email automation rules from plain text instructions. Rules can include specific events, custom behaviors, and notification preferences. Each rule is saved using the following structure:

```ts
interface EmailAction {
  id: string;
  description: string;
  event: string; // event that triggers the rule
  action: string; // action to perform
  criteria?: string; // optional filters
  notify?: {
    method: 'email' | 'sms' | 'push';
    frequency?: 'immediate' | 'daily' | 'weekly';
  };
  createdAt: string;
}
```

Example requests include:
- "send me a notification of an urgent email or from someone that I am actively engaged in a conversation with."
- "summarize my inbox every morning but only include important emails in the summary."

To see the actions you've already saved, ask the `actions` agent with a natural language prompt such as "show my saved actions". The agent will return the current action objects as JSON.

## 🗒️ Email Preferences

The `preferences` agent will manage user-defined email settings. For now it returns a placeholder response so you can build additional features later.

## 🛠️ Advanced Usage

### Environment Variables

You can set environment variables for your project:

```bash
agentuity env set KEY=VALUE
```

### Secrets Management

For sensitive information, use secrets:

```bash
agentuity env set --secret KEY=VALUE
```

## 📖 Documentation

For comprehensive documentation on the Agentuity JavaScript SDK, visit:
[https://agentuity.dev/SDKs/javascript](https://agentuity.dev/SDKs/javascript)

## 🆘 Troubleshooting

If you encounter any issues:

1. Check the [documentation](https://agentuity.dev/SDKs/javascript)
2. Join our [Discord community](https://discord.com/invite/vtn3hgUfuc) for support
3. Contact the Agentuity support team

## 📝 License

This project is licensed under the terms specified in the LICENSE file.
