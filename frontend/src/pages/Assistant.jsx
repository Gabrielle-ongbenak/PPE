import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/Logo';
import { ArrowLeft, Send, Bot, Sparkles, Home, Search, MapPin, Phone, Calendar } from 'lucide-react';

const Assistant = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis l'Assistant Logitech. Comment puis-je vous aider à trouver votre logement idéal ?",
      sent: false,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isBot: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickActions = [
    { icon: Home, label: 'Trouver un studio', query: 'Je cherche un studio' },
    { icon: Search, label: 'Rechercher par ville', query: 'Je veux chercher par ville' },
    { icon: MapPin, label: 'Logements près de moi', query: 'Logements près de ma position' },
    { icon: Calendar, label: 'Visiter aujourd\'hui', query: 'Je veux visiter un logement' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: inputText,
        sent: true,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        isBot: false
      };
      setMessages([...messages, userMessage]);
      setInputText('');
      setIsTyping(true);

      // Simulate bot response
      setTimeout(() => {
        const botResponse = generateBotResponse(inputText);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: botResponse,
          sent: false,
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          isBot: true
        }]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const generateBotResponse = (userQuery) => {
    const query = userQuery.toLowerCase();
    
    if (query.includes('studio') || query.includes('appartement') || query.includes('villa')) {
      return "Je peux vous aider à trouver ce type de logement ! Voulez-vous filtrer par région, prix ou autres critères spécifiques ?";
    } else if (query.includes('prix') || query.includes('coût') || query.includes('budget')) {
      return "Nos logements vont de 45 000 XAF à 500 000 XAF par mois. Quelle est votre fourchette de prix ?";
    } else if (query.includes('ville') || query.includes('région')) {
      return "Nous avons des logements dans les 10 régions du Cameroun : Centre, Littoral, Ouest, Adamaoua, Extrême-Nord, Nord, Est, Sud, Nord-Ouest et Sud-Ouest. Quelle région vous intéresse ?";
    } else if (query.includes('visite') || query.includes('voir')) {
      return "Je peux organiser une visite pour vous. Veuillez d'abord sélectionner un logement qui vous intéresse, puis contactez directement le propriétaire.";
    } else if (query.includes('contact') || query.includes('téléphone')) {
      return "Vous pouvez contacter les propriétaires directement via la section Messages ou sur la page de détail du logement.";
    } else if (query.includes('bonjour') || query.includes('salut') || query.includes('hello')) {
      return "Bonjour ! Comment puis-je vous aider aujourd'hui dans votre recherche de logement ?";
    } else {
      return "Je comprends votre demande. Pour mieux vous aider, pourriez-vous me donner plus de détails sur ce que vous cherchez ? (type de logement, budget, région, etc.)";
    }
  };

  const handleQuickAction = (action) => {
    setInputText(action.query);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: theme.background,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: theme.surface,
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <button
          onClick={() => navigate('/home')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <ArrowLeft size={24} color={theme.text} />
        </button>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: theme.primary + '20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bot size={22} color={theme.primary} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: theme.text }}>
            Assistant Logitech
          </div>
          <div style={{ fontSize: '12px', color: '#16A34A' }}>
            En ligne
          </div>
        </div>
        <Sparkles size={20} color={theme.primary} />
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.sent ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                backgroundColor: message.isBot ? theme.surface : theme.primary,
                padding: message.isBot ? '16px 20px' : '12px 16px',
                borderRadius: message.isBot ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                border: message.isBot ? `1px solid ${theme.border}` : 'none',
                position: 'relative',
              }}
            >
              {message.isBot && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <Bot size={16} color={theme.primary} />
                  <span style={{ fontSize: '12px', fontWeight: '600', color: theme.primary }}>
                    Assistant Logitech
                  </span>
                </div>
              )}
              <div
                style={{
                  fontSize: '15px',
                  color: message.sent ? '#FFFFFF' : theme.text,
                  marginBottom: '4px',
                  lineHeight: '1.5',
                }}
              >
                {message.text}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: message.sent ? 'rgba(255, 255, 255, 0.8)' : theme.secondaryText,
                  textAlign: 'right',
                }}
              >
                {message.time}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div
              style={{
                backgroundColor: theme.surface,
                padding: '16px 20px',
                borderRadius: '18px 18px 18px 4px',
                border: `1px solid ${theme.border}`,
              }}
            >
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <Bot size={16} color={theme.primary} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: theme.primary, marginRight: '8px' }}>
                  Assistant Logitech
                </span>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: theme.secondaryText,
                      animation: `bounce 1.4s infinite ease-in-out`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
              <style>{`
                @keyframes bounce {
                  0%, 80%, 100% { transform: translateY(0); }
                  40% { transform: translateY(-6px); }
                }
              `}</style>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div
          style={{
            padding: '0 20px 16px',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              color: theme.secondaryText,
              marginBottom: '12px',
              fontWeight: '500',
            }}
          >
            Actions rapides
          </div>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              paddingBottom: '8px',
            }}
          >
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  style={{
                    backgroundColor: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '12px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.primary;
                    e.currentTarget.style.backgroundColor = theme.primary + '10';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.border;
                    e.currentTarget.style.backgroundColor = theme.surface;
                  }}
                >
                  <Icon size={16} color={theme.primary} />
                  <span style={{ fontSize: '13px', color: theme.text, fontWeight: '500' }}>
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: theme.surface,
          borderTop: `1px solid ${theme.border}`,
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Posez votre question..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          style={{
            flex: 1,
            padding: '14px 16px',
            fontSize: '15px',
            backgroundColor: theme.background,
            border: `1px solid ${theme.border}`,
            borderRadius: '24px',
            color: theme.text,
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = theme.primary;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = theme.border;
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim()}
          style={{
            backgroundColor: theme.primary,
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            cursor: inputText.trim() ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: inputText.trim() ? 1 : 0.5,
            transition: 'all 0.2s',
          }}
        >
          <Send size={20} color="#FFFFFF" />
        </button>
      </div>
    </div>
  );
};

export default Assistant;
