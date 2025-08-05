# VoiceBot by Sumanth SV

A voice-enabled AI chatbot that lets users have conversations with Sumanth SV's AI persona using speech recognition and text-to-speech technology.

## Features

- 🎤 **Voice Input**: Click to start/stop voice recording using Web Speech API
- 💬 **AI Conversations**: Powered by OpenAI GPT-4 with Sumanth SV's custom persona
- 🔊 **Text-to-Speech**: Hear responses spoken aloud using browser's speech synthesis
- 📱 **Responsive Design**: Beautiful, mobile-friendly interface built with Tailwind CSS
- 💾 **Chat History**: Full conversation history with timestamps
- 🧹 **Easy Management**: Clear conversations and stop speech with dedicated controls

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with glassmorphism effects
- **Voice Input**: Web Speech API (SpeechRecognition)
- **AI**: OpenAI GPT-4 Chat API
- **Voice Output**: Web SpeechSynthesis API
- **Icons**: Lucide React

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Navigate to "API keys" section
4. Click "Create new secret key"
5. Copy the key and add it to your `.env` file

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Deployment

### Vercel Deployment

1. Fork this repository
2. Visit [Vercel](https://vercel.com) and sign in
3. Click "New Project" and import your repository
4. Add environment variable:
   - Key: `VITE_OPENAI_API_KEY`
   - Value: Your OpenAI API key
5. Deploy!

### Netlify Deployment

1. Build the project: `npm run build`
2. Visit [Netlify](https://netlify.com) and sign in
3. Drag and drop the `dist` folder to deploy
4. Or connect your GitHub repository for automatic deployments
5. Add environment variable in Site Settings > Environment Variables

## Browser Compatibility

- **Voice Recognition**: Chrome, Safari, Edge (latest versions)
- **Speech Synthesis**: All modern browsers
- **Recommended**: Chrome for best voice recognition accuracy

## Usage Tips

1. **Click the microphone** to start recording your question
2. **Speak clearly** and wait for the transcription to appear
3. **The bot will respond** both in text and speech
4. **Use the volume button** to stop speech playback
5. **Clear conversations** with the trash button when needed

## Sample Questions to Try

- "What should we know about your life story in a few sentences?"
- "What's your #1 superpower?"
- "What are the top 3 areas you'd like to grow in?"
- "What misconception do your coworkers have about you?"
- "How do you push your boundaries and limits?"

## Troubleshooting

### Voice Recognition Not Working
- Ensure you're using Chrome or Safari
- Check microphone permissions
- Make sure page is served over HTTPS (required for production)

### API Errors
- Verify your OpenAI API key is correct
- Check you have credits in your OpenAI account
- Ensure environment variable is properly set

### Speech Synthesis Issues
- Try different browsers if voice doesn't work
- Check system volume settings
- Some browsers require user interaction before enabling speech

## Development

### Project Structure

```
src/
├── components/
│   ├── ChatMessage.tsx    # Individual chat message component
│   └── MicButton.tsx      # Voice recording button
├── utils/
│   ├── openai.ts         # OpenAI API integration
│   └── speech.ts         # Speech synthesis utilities
├── types/
│   └── speech.d.ts       # TypeScript definitions for Web Speech API
└── App.tsx               # Main application component
```

### Key Features Implementation

- **Voice Recognition**: Uses native Web Speech API with fallbacks
- **AI Integration**: OpenAI GPT-4 with custom persona injection
- **Speech Synthesis**: Native browser TTS with voice optimization
- **State Management**: React hooks for conversation and UI state
- **Error Handling**: Comprehensive error boundaries and user feedback

## License

MIT License - feel free to use this project as a starting point for your own voice-enabled applications!

## Credits

Built by following modern React best practices with a focus on accessibility and user experience. The AI persona represents Sumanth SV's professional background and communication style.