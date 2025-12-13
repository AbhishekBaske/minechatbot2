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
  background: #f5f7fa;
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
      radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 28px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid #e2e8f0;
  z-index: 10;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 768px) {
    padding: 12px 15px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
  }
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 10px;
  }
`

const BackButton = styled.button`
  padding: 10px 18px;
  font-size: 0.9rem;
  background: #ffffff;
  color: #1a202c;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);

  &:hover {
    background: #f8f9fc;
    border-color: rgba(124, 58, 237, 0.3);
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.85rem;
    gap: 5px;
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

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
  }
`

const LogoText = styled.h1`
  font-size: 1.3rem;
  color: #1a202c;
  font-weight: 600;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    display: none;
  }
`

const StatusBadge = styled.span`
  padding: 6px 14px;
  background: ${props => props.$online ? 'rgba(124, 58, 237, 0.1)' : 'rgba(255, 152, 0, 0.1)'};
  color: ${props => props.$online ? '#7c3aed' : '#ff9800'};
  border: 1px solid ${props => props.$online ? 'rgba(124, 58, 237, 0.3)' : 'rgba(255, 152, 0, 0.3)'};
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  backdrop-filter: blur(10px);

  @media (max-width: 480px) {
    padding: 4px 10px;
    font-size: 0.7rem;
  }
`

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 768px) {
    padding: 15px 12px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    padding: 12px 8px;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
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

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 0.85rem;
  }
`

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 14px 20px;
  border-radius: ${props => props.$isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px'};
  background: ${props => props.$isUser 
    ? 'linear-gradient(135deg, #7c3aed, #2563eb)' 
    : '#ffffff'};
  border: 1px solid ${props => props.$isUser 
    ? 'transparent' 
    : '#e2e8f0'};
  color: ${props => props.$isUser ? '#fff' : '#1a202c'};
  line-height: 1.6;
  box-shadow: 0 4px 12px ${props => props.$isUser 
    ? 'rgba(124, 58, 237, 0.2)' 
    : 'rgba(0, 0, 0, 0.06)'};

  @media (max-width: 768px) {
    max-width: 80%;
    padding: 12px 16px;
  }

  @media (max-width: 480px) {
    max-width: 85%;
    padding: 10px 14px;
    font-size: 0.9rem;
  }

  p {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }
`

const MessageTime = styled.span`
  font-size: 0.7rem;
  color: #718096;
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
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px 18px 18px 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);

  span {
    width: 8px;
    height: 8px;
    background: #7c3aed;
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
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    padding: 15px 12px;
  }

  @media (max-width: 480px) {
    padding: 12px 10px;
  }
`

const InputWrapper = styled.form`
  display: flex;
  gap: 12px;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 768px) {
    gap: 10px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`

const TextInput = styled.input`
  flex: 1;
  padding: 16px 24px;
  font-size: 1rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  color: #1a202c;
  outline: none;
  transition: all 0.3s ease;

  &::placeholder {
    color: #a0aec0;
  }

  &:focus {
    border-color: rgba(124, 58, 237, 0.5);
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
  }

  @media (max-width: 768px) {
    padding: 14px 18px;
    font-size: 0.95rem;
    border-radius: 14px;
  }

  @media (max-width: 480px) {
    padding: 12px 14px;
    font-size: 0.9rem;
    border-radius: 12px;
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
  white-space: nowrap;

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

  @media (max-width: 768px) {
    padding: 14px 20px;
    font-size: 0.95rem;
    border-radius: 14px;
    gap: 6px;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 0.9rem;
    border-radius: 12px;
    
    span {
      display: none;
    }
  }
`

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #4a5568;

  @media (max-width: 768px) {
    padding: 30px 15px;
  }

  @media (max-width: 480px) {
    padding: 20px 10px;
  }

  h2 {
    color: #1a202c;
    margin-bottom: 10px;
    font-size: 1.5rem;

    @media (max-width: 768px) {
      font-size: 1.3rem;
    }

    @media (max-width: 480px) {
      font-size: 1.1rem;
    }
  }

  p {
    margin-bottom: 20px;
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: 0.95rem;
      margin-bottom: 15px;
    }

    @media (max-width: 480px) {
      font-size: 0.85rem;
    }
  }
`

const SuggestedQuestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;

  @media (max-width: 768px) {
    gap: 8px;
    margin-top: 15px;
  }
`

const SuggestedButton = styled.button`
  padding: 12px 20px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  color: #1a202c;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    background: #f8f9fc;
    border-color: rgba(124, 58, 237, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.8rem;
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
      const apiUrl = import.meta.env.DEV 
        ? 'http://localhost:3001/api/chat'
        : '/api/chat'
      
      const result = await fetch(apiUrl, {
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
            {loading ? <span>Sending...</span> : <><IoSend /> <span>Send</span></>}
          </SendButton>
        </InputWrapper>
      </InputContainer>
    </ChatContainer>
  )
}

export default Search;
