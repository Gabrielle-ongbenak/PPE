import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/Logo';
import BottomNavigation from '../components/BottomNavigation';
import { Search, MoreVertical, Send, ArrowLeft } from 'lucide-react';

const Messages = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Jean Dupont',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      lastMessage: 'Bonjour, le logement est toujours disponible ?',
      time: '14:30',
      unread: 2,
      online: true,
      messages: [
        { id: 1, text: 'Bonjour, je suis intéressé par votre studio', sent: false, time: '14:25' },
        { id: 2, text: 'Oui, il est toujours disponible', sent: true, time: '14:27' },
        { id: 3, text: 'Le logement est toujours disponible ?', sent: false, time: '14:30' },
      ]
    },
    {
      id: 2,
      name: 'Marie Kouame',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      lastMessage: 'Merci pour votre réponse !',
      time: '12:15',
      unread: 0,
      online: false,
      messages: [
        { id: 1, text: 'Bonjour, pouvez-vous me donner plus de détails ?', sent: false, time: '12:00' },
        { id: 2, text: 'Bien sûr, l\'appartement a 3 chambres et 2 salles de bain', sent: true, time: '12:10' },
        { id: 3, text: 'Merci pour votre réponse !', sent: false, time: '12:15' },
      ]
    },
    {
      id: 3,
      name: 'Paul Nkodo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      lastMessage: 'Je peux visiter demain ?',
      time: 'Hier',
      unread: 1,
      online: true,
      messages: [
        { id: 1, text: 'La villa me plaît beaucoup', sent: false, time: 'Hier 18:00' },
        { id: 2, text: 'Je peux visiter demain ?', sent: false, time: 'Hier 18:05' },
      ]
    },
    {
      id: 4,
      name: 'Aminatou Ahmadou',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      lastMessage: 'C\'est noté, merci',
      time: 'Hier',
      unread: 0,
      online: false,
      messages: [
        { id: 1, text: 'Le prix est-il négociable ?', sent: false, time: 'Hier 10:00' },
        { id: 2, text: 'Oui, nous pouvons discuter', sent: true, time: 'Hier 10:15' },
        { id: 3, text: 'C\'est noté, merci', sent: false, time: 'Hier 10:20' },
      ]
    },
  ];

  const handleSendMessage = () => {
    if (messageText.trim() && selectedChat) {
      const newMessage = {
        id: selectedChat.messages.length + 1,
        text: messageText,
        sent: true,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setSelectedChat({
        ...selectedChat,
        messages: [...selectedChat.messages, newMessage],
        lastMessage: messageText,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      });
      setMessageText('');
    }
  };

  if (selectedChat) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: theme.background,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Chat Header */}
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
            onClick={() => setSelectedChat(null)}
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
              position: 'relative',
            }}
          >
            <img
              src={selectedChat.avatar}
              alt={selectedChat.name}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            {selectedChat.online && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#16A34A',
                  borderRadius: '50%',
                  border: `2px solid ${theme.surface}`,
                }}
              />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: theme.text }}>
              {selectedChat.name}
            </div>
            <div style={{ fontSize: '12px', color: selectedChat.online ? '#16A34A' : theme.secondaryText }}>
              {selectedChat.online ? 'En ligne' : 'Hors ligne'}
            </div>
          </div>
          <button
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            <MoreVertical size={20} color={theme.secondaryText} />
          </button>
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
          {selectedChat.messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.sent ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  backgroundColor: message.sent ? theme.primary : theme.surface,
                  padding: '12px 16px',
                  borderRadius: message.sent ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  border: message.sent ? 'none' : `1px solid ${theme.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: '15px',
                    color: message.sent ? '#FFFFFF' : theme.text,
                    marginBottom: '4px',
                    lineHeight: '1.4',
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
        </div>

        {/* Message Input */}
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
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Écrivez votre message..."
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
            disabled={!messageText.trim()}
            style={{
              backgroundColor: theme.primary,
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              cursor: messageText.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: messageText.trim() ? 1 : 0.5,
            }}
          >
            <Send size={20} color="#FFFFFF" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: theme.background,
        paddingBottom: '80px',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: theme.surface,
          borderBottom: `1px solid ${theme.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <Logo size={32} />
        </div>

        {/* Search Bar */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Search
            size={18}
            color={theme.secondaryText}
            style={{
              position: 'absolute',
              left: '14px',
            }}
          />
          <input
            type="text"
            placeholder="Rechercher une conversation..."
            style={{
              width: '100%',
              padding: '14px 14px 14px 44px',
              fontSize: '15px',
              backgroundColor: theme.background,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
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
        </div>
      </div>

      {/* Conversations List */}
      <div>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => setSelectedChat(conversation)}
            style={{
              padding: '16px 20px',
              backgroundColor: theme.surface,
              borderBottom: `1px solid ${theme.border}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.background;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.surface;
            }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={conversation.avatar}
                alt={conversation.name}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              {conversation.online && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '14px',
                    height: '14px',
                    backgroundColor: '#16A34A',
                    borderRadius: '50%',
                    border: `2px solid ${theme.surface}`,
                  }}
                />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px',
                }}
              >
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: theme.text,
                  }}
                >
                  {conversation.name}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: theme.secondaryText,
                  }}
                >
                  {conversation.time}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    color: conversation.unread > 0 ? theme.text : theme.secondaryText,
                    fontWeight: conversation.unread > 0 ? '500' : '400',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                  }}
                >
                  {conversation.lastMessage}
                </div>
                {conversation.unread > 0 && (
                  <div
                    style={{
                      marginLeft: '8px',
                      backgroundColor: theme.primary,
                      color: '#FFFFFF',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '600',
                    }}
                  >
                    {conversation.unread}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Messages;
