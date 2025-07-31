# AI Chatbot

A modern, responsive AI chatbot built with React, Vite, and Tailwind CSS. Connect with various AI providers including OpenAI, Anthropic, or run local AI models.

## Features

- 🤖 **Multi-Provider Support**: Connect to OpenAI, Anthropic, or local AI models
- 🎨 **Beautiful UI**: Modern, responsive design with Tailwind CSS
- ⚙️ **Configurable Settings**: Adjust model, temperature, and token limits
- 💬 **Real-time Chat**: Smooth conversation flow with typing indicators
- 📱 **Mobile Responsive**: Works perfectly on all devices
- 🔒 **Secure**: API keys stored locally in browser

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Configure AI Provider

Click the settings icon (⚙️) in the top-right corner and add your API key:

#### OpenAI

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to the settings
3. Select your preferred model (GPT-3.5 Turbo, GPT-4, etc.)

#### Anthropic (Claude)

1. Get your API key from [Anthropic Console](https://console.anthropic.com/)
2. Add it to the settings
3. The app will automatically use Claude models

#### Local AI (Ollama)

1. Install [Ollama](https://ollama.ai/)
2. Run a model: `ollama run llama2`
3. The app will connect to `http://localhost:11434`

## Project Structure

```
src/
├── components/
│   ├── ChatMessage.jsx      # Individual message component
│   ├── TypingIndicator.jsx  # Loading animation
│   └── SettingsModal.jsx    # AI configuration modal
├── services/
│   └── aiService.js         # AI API integration
├── App.jsx                  # Main application
├── main.jsx                 # React entry point
└── index.css               # Global styles
```

## Configuration Options

### Temperature

- **0.0**: Very focused, consistent responses
- **0.7**: Balanced creativity and focus
- **2.0**: Very creative, diverse responses

### Max Tokens

- **100-500**: Short, concise responses
- **1000-2000**: Medium-length responses
- **3000-4000**: Long, detailed responses

## Customization

### Adding New AI Providers

1. Add a new method in `src/services/aiService.js`:

```javascript
async callNewProvider(messages) {
  // Your API integration here
  const response = await fetch('your-api-endpoint', {
    // ... configuration
  })
  return response.data.content
}
```

2. Update the `getResponse` method to include your provider:

```javascript
case 'newprovider':
  return await this.callNewProvider(messages)
```

### Styling

The app uses Tailwind CSS for styling. You can customize the design by modifying:

- `src/index.css` for global styles
- Component files for specific styling
- `tailwind.config.js` for theme customization

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

- **Vercel**: Connect your GitHub repo for automatic deployment
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use the `gh-pages` package
- **PM2**: For Node.js hosting (as per your preferences)

## Environment Variables

For production, consider using environment variables for API keys:

```bash
# .env.local
VITE_OPENAI_API_KEY=your_openai_key
VITE_ANTHROPIC_API_KEY=your_anthropic_key
```

## Troubleshooting

### Common Issues

1. **API Key Not Working**

   - Verify your API key is correct
   - Check if you have sufficient credits
   - Ensure the API key has the right permissions

2. **Local AI Not Connecting**

   - Make sure Ollama is running
   - Check if the model is downloaded: `ollama list`
   - Verify the port (default: 11434)

3. **CORS Errors**
   - For local development, this shouldn't be an issue
   - For production, ensure your hosting provider allows the API calls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own applications!

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
