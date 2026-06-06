import React, { useState, useEffect, useRef } from 'react';

const GURU_API_URL = import.meta.env.VITE_GURU_API_URL || 'http://localhost:2501';

// The main function that displays the GuruAI floating widget
/* I have added some inline styles and media queries
 to make the widget look good on mobile phones as well */
const GuruAIWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [history, setHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  /* This useEffect hook will check the user type
  directly from localStorage, if user has a valid
  student role, which ultimately means that the widget should show*/
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.role === 'student') {
          setIsStudent(true);
          // Set initial greeting
          const userName = user.name || user.username || '';
          const greeting = userName 
            ? `Namaste, ${userName}! 🙏 I'm GuruAI, your career guide. How can I help you today?` 
            : `Namaste! 🙏 I'm GuruAI, your career guide. How can I help you today?`;
            
          setHistory([{ role: 'model', content: greeting }]);
        }
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }, []);

  /* this functionality is used to make changes in the chat
  panel when the user will send a message or type
  ex...Auto-scroll to bottom of messages */
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isTyping]);

  /* Start a fresh conversation and clear history */
  const handleNewChat = () => {
    const userStr = localStorage.getItem('user');
    let greeting = "Namaste! 🙏 I'm GuruAI, your career guide. How can I help you today?";
    try {
      if (userStr) {
        const user = JSON.parse(userStr);
        const userName = user.name || user.username || '';
        if (userName) greeting = `Namaste, ${userName}! 🙏 I'm GuruAI, your career guide. How can I help you today?`;
      }
    } catch (e) {}
    setHistory([{ role: 'model', content: greeting }]);
    setInputValue('');
  };

  if (!isStudent) return null;

  const suggestions = [
    "📄 Review my resume tips",
    "🎯 How to ace interviews",
    "💼 Negotiate my salary",
    "🚀 Plan my career path"
  ];

  const handleSend = async (messageText) => {
    if (!messageText.trim()) return;

    const newMessage = { role: 'user', content: messageText.trim() };
    const currentHistory = [...history];
    
    // Add user message to UI
    setHistory([...currentHistory, newMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch(`${GURU_API_URL}/widget/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: newMessage.content, 
          history: currentHistory
            .filter((msg, idx) => !(idx === 0 && msg.role === 'model'))
            .map(msg => ({ role: msg.role, content: msg.content })) 
        })
      });

      const data = await res.json();
      
      if (!res.ok || !data.success) {
        if (res.status === 429 || data.message?.includes('busy')) {
          setHistory(prev => [...prev, { role: 'model', content: "GuruAI is a bit busy right now 🙏 Please wait a moment and try again." }]);
        } else {
          throw new Error(data.message || 'GuruAI error');
        }
      } else {
        setHistory(prev => [...prev, { role: 'model', content: data.reply }]);
      }
    } catch (error) {
      console.error('GuruAI fetch error:', error);
      setHistory(prev => [...prev, { role: 'model', content: "Unable to reach GuruAI. Please check your connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  return (
    <div style={styles.container}>
      {isOpen && (
        <div style={styles.chatPanel} role="dialog" aria-label="GuruAI Career Assistant">
          <div style={styles.header}>
            <div style={styles.headerTitle}>
              <div style={styles.avatar}>
                <img src="/GuruAI_Logo.svg" alt="GuruAI Logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'contain' }} />
              </div>
              <span style={{ fontWeight: 600, letterSpacing: '-0.3px', fontSize: '15px' }}>GuruAI</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <button 
                onClick={handleNewChat} 
                style={styles.newChatBtn}
                aria-label="New Chat"
                title="Start a new chat"
                onMouseEnter={(e) => { e.currentTarget.style.color = '#f59e0b'; e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#88889a'; e.currentTarget.style.background = 'transparent'; }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                style={styles.closeButton}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>
          
          <div style={styles.messagesContainer}>
            {history.map((msg, index) => (
              <div 
                key={index} 
                style={
                  msg.role === 'user' 
                    ? { ...styles.messageWrapper, justifyContent: 'flex-end', alignItems: 'flex-start' } 
                    : { ...styles.messageWrapper, justifyContent: 'flex-start', alignItems: 'flex-start', gap: '12px' }
                }
              >
                {msg.role === 'model' && (
                  <div style={styles.messageAvatar}>
                    <img src="/GuruAI_Logo.svg" alt="GuruAI Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                )}
                <div 
                  style={
                    msg.role === 'user' 
                      ? styles.userBubble 
                      : styles.modelBubble
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{ ...styles.messageWrapper, justifyContent: 'flex-start', alignItems: 'flex-start', gap: '12px' }}>
                <div style={styles.messageAvatar}>
                  <img src="/GuruAI_Logo.svg" alt="GuruAI Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={styles.modelBubble}>
                  <div style={styles.typingIndicator}>
                    <span style={styles.dot}></span>
                    <span style={{...styles.dot, animationDelay: '0.2s'}}></span>
                    <span style={{...styles.dot, animationDelay: '0.4s'}}></span>
                  </div>
                </div>
              </div>
            )}
            
            {history.length <= 1 && !isTyping && (
              <div style={styles.suggestionsContainer}>
                {suggestions.map((sug, i) => (
                  <button 
                    key={i} 
                    style={styles.suggestionChip}
                    onClick={() => handleSend(sug)}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.inputArea}>
            <textarea
              style={styles.textarea}
              placeholder="Ask GuruAI anything about your career..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button 
              style={styles.sendButton} 
              onClick={() => handleSend(inputValue)}
              disabled={!inputValue.trim() || isTyping}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* The floating button and tooltip wrapper */}
      <div style={styles.floatingWrapper}>
        {!isOpen && (
          <div 
            style={styles.tooltipPulse}
            onClick={() => setIsOpen(true)}
          >
            Ask GuruAI ✦
          </div>
        )}
        <button 
          style={isOpen ? { ...styles.floatingButton, transform: 'scale(0.5)', opacity: 0, pointerEvents: 'none' } : styles.floatingButton} 
          onClick={() => setIsOpen(true)}
          aria-label="Open GuruAI Career Assistant"
        >
          <img src="/GuruAI_Logo.svg" alt="GuruAI Logo" style={{ width: '75%', height: '75%', objectFit: 'contain' }} />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulseAlert {
          0% { box-shadow: 0 0 0 0 rgba(240, 125, 7, 0.5); }
          70% { box-shadow: 0 0 0 20px rgba(240, 125, 7, 0); }
          100% { box-shadow: 0 0 0 0 rgba(240, 125, 7, 0); }
        }
        @keyframes tooltipBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes blink {
          0% { opacity: .2; }
          20% { opacity: 1; }
          100% { opacity: .2; }
        }
      `}} />
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  floatingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '10px',
  },
  tooltipPulse: {
    backgroundColor: '#ffffff',
    color: '#c45e02',
    padding: '8px 14px',
    borderRadius: '16px 16px 4px 16px',
    fontSize: '13px',
    fontWeight: '700',
    border: '2px solid #f07d07',
    boxShadow: '0 8px 24px rgba(240, 125, 7, 0.25)',
    animation: 'tooltipBounce 2.5s infinite ease-in-out',
    cursor: 'pointer',
    letterSpacing: '-0.2px',
    whiteSpace: 'nowrap',
    marginRight: '4px',
  },
  floatingButton: {
    width: '68px',
    height: '68px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    border: '2px solid #f07d07',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    animation: 'pulseAlert 2s infinite',
  },
  chatPanel: {
    width: '360px',
    height: '520px',
    maxHeight: 'calc(100vh - 100px)',
    backgroundColor: '#0f0f10',
    borderRadius: '16px',
    border: '1px solid #222225',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.03)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'fixed',
    bottom: '40px',
    right: '87px',
  },
  header: {
    backgroundColor: '#0f0f10',
    color: '#e8e8e8',
    padding: '14px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #222225',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '26px',
    height: '26px',
    borderRadius: '6px',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#88889a',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0 4px',
    lineHeight: '1',
    transition: 'color 0.2s',
  },
  newChatBtn: {
    background: 'none',
    border: 'none',
    color: '#88889a',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s, background 0.2s',
  },
  messagesContainer: {
    flex: 1,
    padding: '20px 16px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: '#0f0f10',
  },
  messageWrapper: {
    display: 'flex',
    gap: '8px',
    width: '100%',
  },
  messageAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '5px',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
    overflow: 'hidden',
  },
  userBubble: {
    backgroundColor: '#1e1e24',
    color: '#c8c8d8',
    padding: '10px 14px',
    borderRadius: '16px 16px 4px 16px',
    border: '1px solid #2c2c34',
    maxWidth: '85%',
    fontSize: '14.5px',
    lineHeight: '1.6',
    wordWrap: 'break-word',
  },
  modelBubble: {
    backgroundColor: 'transparent',
    color: '#d8d8e0',
    padding: '3px 0 0 0',
    maxWidth: '85%',
    fontSize: '14.5px',
    lineHeight: '1.6',
    wordWrap: 'break-word',
  },
  suggestionsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '16px',
  },
  suggestionChip: {
    backgroundColor: '#191919',
    border: '1px solid #272729',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '12.5px',
    color: '#a8a8b4',
    cursor: 'pointer',
  },
  inputArea: {
    padding: '14px 16px',
    borderTop: '1px solid #222225',
    backgroundColor: '#0f0f10',
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-end',
  },
  textarea: {
    flex: 1,
    border: '1px solid #2a2a2e',
    backgroundColor: '#1a1a1d',
    color: '#d8d8e0',
    borderRadius: '14px',
    padding: '12px 14px',
    fontSize: '14px',
    resize: 'none',
    maxHeight: '100px',
    outline: 'none',
    fontFamily: 'inherit',
    boxShadow: '0 0 0 1px rgba(255,255,255,0.025)'
  },
  sendButton: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: '#f59e0b',
    color: '#fff',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    fontSize: '16px',
    transition: 'opacity 0.2s',
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    height: '20px',
    paddingLeft: '2px',
  },
  dot: {
    width: '5px',
    height: '5px',
    backgroundColor: '#666',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'blink 1.2s infinite ease-in-out',
  }
};

export default GuruAIWidget;
