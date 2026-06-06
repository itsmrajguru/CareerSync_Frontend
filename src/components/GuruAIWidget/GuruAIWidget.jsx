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
              <div style={styles.avatar}>ॐ</div>
              <span style={{ fontWeight: 600 }}>GuruAI</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              style={styles.closeButton}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          
          <div style={styles.messagesContainer}>
            {history.map((msg, index) => (
              <div 
                key={index} 
                style={
                  msg.role === 'user' 
                    ? { ...styles.messageWrapper, justifyContent: 'flex-end' } 
                    : { ...styles.messageWrapper, justifyContent: 'flex-start' }
                }
              >
                {msg.role === 'model' && (
                  <div style={styles.messageAvatar}>G</div>
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
              <div style={{ ...styles.messageWrapper, justifyContent: 'flex-start' }}>
                <div style={styles.messageAvatar}>G</div>
                <div style={styles.modelBubble}>
                  <div style={styles.typingIndicator}>
                    <span>.</span><span>.</span><span>.</span>
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

      <button 
        style={isOpen ? { ...styles.floatingButton, opacity: 0, pointerEvents: 'none' } : styles.floatingButton} 
        onClick={() => setIsOpen(true)}
        aria-label="Open GuruAI Career Assistant"
      >
        ॐ

        
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(245, 158, 11, 0); }
          100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
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
    bottom: '16px',
    right: '16px',
    zIndex: 9999,
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  floatingButton: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#1E1B4B',
    color: '#F59E0B',
    border: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    transition: 'all 0.3s ease',
    animation: 'pulse 2s infinite',
  },
  chatPanel: {
    width: '360px',
    height: '520px',
    maxHeight: 'calc(100vh - 100px)',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'fixed',
    bottom: '40px',
    right: '87px',
  },
  header: {
    backgroundColor: '#1E1B4B',
    color: '#FFFFFF',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#F59E0B',
    color: '#1E1B4B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#FFFFFF',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0 4px',
  },
  messagesContainer: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    backgroundColor: '#F9FAFB',
  },
  messageWrapper: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
    width: '100%',
  },
  messageAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#1E1B4B',
    color: '#F59E0B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  userBubble: {
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    padding: '10px 14px',
    borderRadius: '16px 16px 4px 16px',
    maxWidth: '80%',
    fontSize: '14px',
    lineHeight: '1.4',
    wordWrap: 'break-word',
  },
  modelBubble: {
    backgroundColor: '#F3F4F6',
    color: '#111827',
    padding: '10px 14px',
    borderRadius: '16px 16px 16px 4px',
    maxWidth: '80%',
    fontSize: '14px',
    lineHeight: '1.4',
    wordWrap: 'break-word',
  },
  suggestionsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '16px',
  },
  suggestionChip: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '16px',
    padding: '6px 12px',
    fontSize: '12px',
    color: '#4B5563',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  inputArea: {
    padding: '12px 16px',
    borderTop: '1px solid #E5E7EB',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  },
  textarea: {
    flex: 1,
    border: '1px solid #E5E7EB',
    borderRadius: '20px',
    padding: '10px 16px',
    fontSize: '14px',
    resize: 'none',
    maxHeight: '100px',
    outline: 'none',
    fontFamily: 'inherit',
  },
  sendButton: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    fontSize: '16px',
  },
  typingIndicator: {
    display: 'flex',
    gap: '2px',
  }
};

export default GuruAIWidget;
