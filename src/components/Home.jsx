import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { GiMining } from 'react-icons/gi'
import { IoArrowForward } from 'react-icons/io5'
import { FaBook, FaBolt, FaShieldAlt } from 'react-icons/fa'

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 20px;
  text-align: center;
  background: #f5f7fa;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.08) 0%, transparent 50%);
    pointer-events: none;
  }
`

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  width: 100%;
  padding: 0 10px;

  @media (max-width: 768px) {
    padding: 0 5px;
  }
`

const IconWrapper = styled.div`
  font-size: 4rem;
  margin-bottom: 30px;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 24px;
  color: #7c3aed;
  animation: ${float} 3s ease-in-out infinite;
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.15);
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
    font-size: 3rem;
    margin-bottom: 20px;
  }
`

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 20px;
  color: #1a202c;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;

  span {
    background: linear-gradient(135deg, #7c3aed, #2563eb);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`

const Subtitle = styled.h2`
  font-size: 1.4rem;
  color: #4a5568;
  margin-bottom: 40px;
  font-weight: 400;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 20px;
  }
`

const Description = styled.p`
  font-size: 1.1rem;
  margin-bottom: 15px;
  color: #4a5568;
  max-width: 600px;
  line-height: 1.7;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 12px;
    line-height: 1.6;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 40px 0;
  width: 100%;
  max-width: 700px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
    margin: 30px 0;
    max-width: 400px;
  }
`

const FeatureCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 30px 24px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    background: #f8f9fc;
    transform: translateY(-5px);
    border-color: rgba(139, 92, 246, 0.3);
    box-shadow: 0 12px 40px rgba(139, 92, 246, 0.15);
  }

  @media (max-width: 768px) {
    padding: 24px 20px;
    
    &:hover {
      transform: translateY(-3px);
    }
  }

  .icon {
    font-size: 2.5rem;
    margin-bottom: 16px;
    color: #7c3aed;

    @media (max-width: 768px) {
      font-size: 2rem;
      margin-bottom: 12px;
    }
  }

  h3 {
    color: #1a202c;
    font-size: 1.15rem;
    margin-bottom: 10px;
    font-weight: 600;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }

  p {
    color: #4a5568;
    font-size: 0.9rem;
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: 0.85rem;
    }
  }
`

const StartButton = styled.button`
  padding: 18px 48px;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  color: white;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  margin-top: 40px;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.4);
  display: inline-flex;
  align-items: center;
  gap: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 48px rgba(139, 92, 246, 0.5);
    background: linear-gradient(135deg, #9333ea, #2563eb);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 15px 36px;
    font-size: 1rem;
    margin-top: 30px;
  }

  @media (max-width: 480px) {
    padding: 14px 30px;
    font-size: 0.95rem;
    width: 100%;
    max-width: 280px;
  }
`

const Footer = styled.footer`
  position: absolute;
  bottom: 20px;
  color: #718096;
  font-size: 0.85rem;
  padding: 0 15px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
    bottom: 10px;
    position: relative;
    margin-top: 30px;
  }
`

function Home() {
  const navigate = useNavigate()

  const handleStartChatting = () => {
    navigate('/search')
  }

  const features = [
    {
      icon: <FaBook />,
      title: 'CMR 2017 Expert',
      description: 'Comprehensive knowledge of Coal Mines Regulations 2017'
    },
    {
      icon: <FaBolt />,
      title: 'Instant Answers',
      description: 'Get quick responses to your regulatory queries'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Safety First',
      description: 'Learn about safety protocols and procedures'
    }
  ]

  return (
    <HomeContainer>
      <ContentWrapper>
        <IconWrapper>
          <GiMining />
        </IconWrapper>
        <Title>
          <span>MineChatbot</span>
        </Title>
        <Subtitle>AI-Powered Coal Mines Regulation Assistant</Subtitle>
        <Description>
          Your intelligent companion for understanding Coal Mines Regulations 2017 (CMR2017). 
          Ask questions about safety, duties, procedures, and compliance requirements.
        </Description>

        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <div className="icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </FeatureCard>
          ))}
        </FeaturesGrid>

        <StartButton onClick={handleStartChatting}>
          Start Chatting <IoArrowForward />
        </StartButton>
      </ContentWrapper>

      <Footer>
        © 2024 MineChatbot | Built with ❤️ for Coal Mine Safety
      </Footer>
    </HomeContainer>
  );
}

export default Home;