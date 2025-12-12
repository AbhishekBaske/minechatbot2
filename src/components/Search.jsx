import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { IoArrowBack, IoSend } from 'react-icons/io5'
import { FaRobot, FaUser } from 'react-icons/fa'
import { GiMining } from 'react-icons/gi'

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0f0f1e;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 28px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 10;
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`

const BackButton = styled.button`
  padding: 10px 18px;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(139, 92, 246, 0.15);
    border-color: rgba(139, 92, 246, 0.3);
  }
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const LogoIcon = styled.div`
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
`

const LogoText = styled.h1`
  font-size: 1.3rem;
  color: #fff;
  font-weight: 600;
  margin: 0;
`

const StatusBadge = styled.span`
  padding: 6px 14px;
  background: ${props => props.$online ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 152, 0, 0.15)'};
  color: ${props => props.$online ? '#a78bfa' : '#ff9800'};
  border: 1px solid ${props => props.$online ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 152, 0, 0.3)'};
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
`

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`

const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  align-items: flex-start;
  gap: 10px;
`

const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
  background: ${props => props.$isUser 
    ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' 
    : 'linear-gradient(135deg, #3b82f6, #06b6d4)'};
  box-shadow: 0 4px 12px ${props => props.$isUser 
    ? 'rgba(139, 92, 246, 0.3)' 
    : 'rgba(59, 130, 246, 0.3)'};
`

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 14px 20px;
  border-radius: ${props => props.$isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px'};
  background: ${props => props.$isUser 
    ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' 
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.$isUser 
    ? 'transparent' 
    : 'rgba(255, 255, 255, 0.08)'};
  color: #fff;
  line-height: 1.6;
  box-shadow: 0 4px 12px ${props => props.$isUser 
    ? 'rgba(139, 92, 246, 0.2)' 
    : 'rgba(0, 0, 0, 0.1)'};
  backdrop-filter: blur(10px);

  p {
    margin: 0;
    white-space: pre-wrap;
  }
`

const MessageTime = styled.span`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 5px;
  display: block;
`

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const TypingDots = styled.div`
  display: flex;
  gap: 4px;
  padding: 12px 18px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 18px 18px 18px 4px;

  span {
    width: 8px;
    height: 8px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;

    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
`

const InputContainer = styled.div`
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const InputWrapper = styled.form`
  display: flex;
  gap: 12px;
  max-width: 900px;
  margin: 0 auto;
`

const TextInput = styled.input`
  flex: 1;
  padding: 16px 24px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  color: #fff;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    border-color: rgba(139, 92, 246, 0.5);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
  }
`

const SendButton = styled.button`
  padding: 16px 28px;
  font-size: 1rem;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(139, 92, 246, 0.5);
    background: linear-gradient(135deg, #9333ea, #2563eb);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.7);

  h2 {
    color: #fff;
    margin-bottom: 10px;
    font-size: 1.5rem;
  }

  p {
    margin-bottom: 20px;
    line-height: 1.6;
  }
`

const SuggestedQuestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
`

const SuggestedButton = styled.button`
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(139, 92, 246, 0.15);
    border-color: rgba(139, 92, 246, 0.3);
    transform: translateY(-2px);
  }
`

const ErrorMessage = styled.div`
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  color: #f44336;
  padding: 12px 18px;
  border-radius: 12px;
  margin: 10px 0;
  text-align: center;
`

const Search = () => {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const formatTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || loading) return

    const query = inputValue.trim()
    const userMessage = {
      id: Date.now(),
      text: query,
      isUser: true,
      time: formatTime()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)
    setError(null)

    try {
      const result = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query })
      })

      if (!result.ok) {
        const errorData = await result.json()
        throw new Error(errorData.error || 'Failed to get response')
      }

      const data = await result.json()
      
      const botMessage = {
        id: Date.now() + 1,
        text: data.answer || 'Sorry, I could not process your request.',
        isUser: false,
        time: formatTime()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      setError(`Failed to connect: ${err.message}`)
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestedQuestion = (question) => {
    setInputValue(question)
  }

  const suggestedQuestions = [
    "What are the duties of a manager?",
    "Safety regulations in coal mines",
    "Working hours in mines",
    "Emergency procedures"
  ]

  return (
    <ChatContainer>
      <Header>
        <HeaderLeft>
          <BackButton onClick={() => navigate('/')}>
            <IoArrowBack /> Home
          </BackButton>
          <Logo>
            <LogoIcon><GiMining /></LogoIcon>
            <LogoText>MineChatbot</LogoText>
          </Logo>
        </HeaderLeft>
        <StatusBadge $online={true}>● Online</StatusBadge>
      </Header>

      <MessagesContainer>
        {messages.length === 0 && (
          <WelcomeMessage>
            <h2>👋 Welcome to MineChatbot!</h2>
            <p>
              I'm your AI assistant for Coal Mines Regulations 2017 (CMR2017).<br />
              Ask me anything about safety, duties, procedures, and regulations.
            </p>
            <SuggestedQuestions>
              {suggestedQuestions.map((question, index) => (
                <SuggestedButton 
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </SuggestedButton>
              ))}
            </SuggestedQuestions>
          </WelcomeMessage>
        )}

        {messages.map(message => (
          <MessageWrapper key={message.id} $isUser={message.isUser}>
            {!message.isUser && <Avatar $isUser={false}><FaRobot /></Avatar>}
            <div>
              <MessageBubble $isUser={message.isUser}>
                <p>{message.text}</p>
              </MessageBubble>
              <MessageTime>{message.time}</MessageTime>
            </div>
            {message.isUser && <Avatar $isUser={true}><FaUser /></Avatar>}
          </MessageWrapper>
        ))}

        {loading && (
          <TypingIndicator>
            <Avatar $isUser={false}><FaRobot /></Avatar>
            <TypingDots>
              <span></span>
              <span></span>
              <span></span>
            </TypingDots>
          </TypingIndicator>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <InputWrapper onSubmit={handleSend}>
          <TextInput
            type="text"
            placeholder="Type your question here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
          />
          <SendButton type="submit" disabled={loading || !inputValue.trim()}>
            {loading ? 'Sending...' : <><IoSend /> Send</>}
          </SendButton>
        </InputWrapper>
      </InputContainer>
    </ChatContainer>
  )
}

export default Search;
