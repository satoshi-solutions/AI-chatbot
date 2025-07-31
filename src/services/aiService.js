// AI Service for handling different AI provider APIs

class AIService {
  constructor() {
    this.settings = this.loadSettings()
  }

  loadSettings() {
    const saved = localStorage.getItem('chatbot-settings')


    return saved ? JSON.parse(saved) : {
      apiKey: '',
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000
    }
  }

  async callOpenAI(messages) {
    if (!this.settings.apiKey) {
      throw new Error('API key not configured. Please add your OpenAI API key in settings.')
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.settings.apiKey}`
        },
        body: JSON.stringify({
          model: this.settings.model,
          messages: messages,
          temperature: this.settings.temperature,
          max_tokens: this.settings.maxTokens,
          stream: false
        })
      })

      if (!response.ok) {
        const error = await response.json()
        const errorMessage = error.error?.message || 'Failed to get response from OpenAI'
        
        // Handle specific error cases
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.')
        } else if (response.status === 402) {
          throw new Error('Payment required. Please check your OpenAI billing.')
        } else if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenAI API key.')
        } else {
          throw new Error(errorMessage)
        }
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      // If it's a network error or API error, provide a helpful fallback
      if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection.')
      }
      throw error
    }
  }

  async callAnthropic(messages) {
    if (!this.settings.apiKey) {
      throw new Error('API key not configured. Please add your Anthropic API key in settings.')
    }

    // Convert messages to Claude format
    const systemMessage = messages.find(m => m.role === 'system')?.content || 'You are a helpful AI assistant.'
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content).join('\n')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.settings.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: this.settings.maxTokens,
        temperature: this.settings.temperature,
        system: systemMessage,
        messages: [
          {
            role: 'user',
            content: userMessages
          }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to get response from Anthropic')
    }

    const data = await response.json()
    return data.content[0].text
  }

  async callLocalAI(messages) {
    // For local AI models (like Ollama, LM Studio, etc.)
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama2', // or whatever model you have running
        messages: messages,
        stream: false,
        options: {
          temperature: this.settings.temperature,
          num_predict: this.settings.maxTokens
        }
      })
    })

    if (!response.ok) {
      throw new Error('Failed to get response from local AI')
    }

    const data = await response.json()
    return data.message.content
  }

  async getResponse(messages, provider = 'openai') {
    try {
      switch (provider) {
        case 'openai':
          return await this.callOpenAI(messages)
        case 'anthropic':
          return await this.callAnthropic(messages)
        case 'local':
          return await this.callLocalAI(messages)
        default:
          throw new Error(`Unsupported provider: ${provider}`)
      }
    } catch (error) {
      console.error('AI Service Error:', error)
      
      // Provide fallback response when API fails
      return this.getFallbackResponse(messages, error.message)
    }
  }

  getFallbackResponse(messages, errorMessage) {
    const lastMessage = messages[messages.length - 1]?.content || ''
    const lowerMessage = lastMessage.toLowerCase()
    
    // Smart fallback responses based on the user's message
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm currently in demo mode due to API issues. I'd be happy to help you with general questions!"
    } else if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
      return "I'm here to help! Since I'm in demo mode, I can provide general guidance and information. What would you like to know?"
    } else if (lowerMessage.includes('weather')) {
      return "I can't check real-time weather in demo mode, but I can tell you about weather patterns and climate information!"
    } else if (lowerMessage.includes('time') || lowerMessage.includes('date')) {
      return `The current time is ${new Date().toLocaleString()}. I'm in demo mode, so I can't access real-time data, but I can help with other questions!`
    } else if (lowerMessage.includes('joke') || lowerMessage.includes('funny')) {
      return "Why don't scientists trust atoms? Because they make up everything! 😄 (Demo mode response)"
    } else if (lowerMessage.includes('thank')) {
      return "You're welcome! I'm glad I could help, even in demo mode. Feel free to ask more questions!"
    } else {
      return `I understand you're asking about "${lastMessage}". I'm currently in demo mode due to: ${errorMessage}. I can still help with general questions and provide information on various topics!`
    }
  }

  // Helper method to format messages for different APIs
  formatMessages(conversationHistory) {
    return conversationHistory.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    }))
  }
}

export default new AIService() 