import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Embedhtml from './Embedhtml';
import { FiSend, FiMic, FiMicOff, FiVolume2, FiUser, FiCpu } from 'react-icons/fi';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { ScrollPanel } from 'primereact/scrollpanel';

// Memoized Message Component to prevent unnecessary re-renders
const MessageComponent = React.memo(({ message, isDarkContrast, extractSourceNames, speakText }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
        marginBottom: '20px',
        alignItems: 'flex-end',
      }}
    >
      {/* AI Avatar */}
      {message.sender === 'bot' && (
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '12px',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
        }}>
          <FiCpu size={18} color="white" />
        </div>
      )}
      
      <div
        style={{
          maxWidth: message.sender === 'user' ? '75%' : '85%',
          padding: '16px 20px',
          background: message.sender === 'user' 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : isDarkContrast 
              ? 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: message.sender === 'user' 
            ? '20px 20px 8px 20px' 
            : '20px 20px 20px 8px',
          color: message.sender === 'user' ? '#ffffff' : isDarkContrast ? '#e2e8f0' : '#2d3748',
          boxShadow: message.sender === 'user'
            ? '0 8px 24px rgba(102, 126, 234, 0.4)'
            : '0 4px 20px rgba(0, 0, 0, 0.08)',
          fontSize: '15px',
          lineHeight: '1.5',
          textAlign: 'left',
          wordBreak: 'break-word',
          border: message.sender === 'user' ? 'none' : isDarkContrast ? '1px solid #4a5568' : '1px solid #e2e8f0',
          position: 'relative',
        }}
      >
        {/* Message tail */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          [message.sender === 'user' ? 'right' : 'left']: '-8px',
          width: '0',
          height: '0',
          borderStyle: 'solid',
          borderWidth: message.sender === 'user' ? '8px 0 0 8px' : '8px 8px 0 0',
          borderColor: message.sender === 'user' 
            ? 'transparent transparent transparent #667eea'
            : isDarkContrast
              ? 'transparent #4a5568 transparent transparent'
              : 'transparent #e2e8f0 transparent transparent',
        }} />

        <ReactMarkdown
          children={message.text}
          components={{
            p: ({ node, ...props }) => <p style={{ margin: '8px 0', lineHeight: '1.6' }} {...props} />,
            ul: ({ node, ...props }) => <ul style={{ margin: '12px 0', paddingLeft: '20px' }} {...props} />,
            ol: ({ node, ...props }) => <ol style={{ margin: '12px 0', paddingLeft: '20px' }} {...props} />,
            li: ({ node, ...props }) => <li style={{ margin: '6px 0', lineHeight: '1.6' }} {...props} />,
            h1: ({ node, ...props }) => <h1 style={{ margin: '16px 0 12px 0', fontSize: '20px', fontWeight: '700', color: isDarkContrast ? '#f1f5f9' : '#1a202c' }} {...props} />,
            h2: ({ node, ...props }) => <h2 style={{ margin: '14px 0 10px 0', fontSize: '18px', fontWeight: '600', color: isDarkContrast ? '#f1f5f9' : '#2d3748' }} {...props} />,
            h3: ({ node, ...props }) => <h3 style={{ margin: '12px 0 8px 0', fontSize: '16px', fontWeight: '600', color: isDarkContrast ? '#f1f5f9' : '#2d3748' }} {...props} />,
            strong: ({ node, ...props }) => <strong style={{ fontWeight: '700', color: isDarkContrast ? '#ffffff' : '#1a202c' }} {...props} />,
            code: ({ node, ...props }) => <code style={{ 
              backgroundColor: isDarkContrast ? '#4a5568' : '#edf2f7',
              color: isDarkContrast ? '#e2e8f0' : '#2d3748',
              padding: '3px 6px',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
            }} {...props} />,
          }}
        />

        {/* Visualization embed */}
        {message.sender === 'bot' && message.embedHtml && (
          <div key={`embed-${message.id}`} style={{ marginTop: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              fontWeight: '600',
              fontSize: '14px',
              color: isDarkContrast ? '#a0aec0' : '#4a5568'
            }}>
              📊 <span>Interactive Visualization</span>
            </div>
            <div style={{
              borderRadius: '8px',
              overflow: 'hidden',
              border: isDarkContrast ? '1px solid #4a5568' : '1px solid #e2e8f0'
            }}>
              <Embedhtml html={message.embedHtml} />
            </div>
          </div>
        )}

        {/* Sources section */}
        {message.sender === 'bot' &&
          message.source &&
          (() => {
            const sources = extractSourceNames(message.source);
            return (
              sources.length > 0 && (
                <div
                  style={{
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: isDarkContrast ? '1px solid #4a5568' : '1px solid #e2e8f0',
                    fontSize: '13px',
                    color: isDarkContrast ? '#a0aec0' : '#718096',
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '6px', color: isDarkContrast ? '#cbd5e0' : '#4a5568' }}>
                    📚 Sources:
                  </div>
                  <div style={{ fontStyle: 'italic', lineHeight: '1.4' }}>
                    {sources.join(' • ')}
                  </div>
                </div>
              )
            );
          })()}

        {/* Audio button for bot messages */}
        {message.sender === 'bot' && (
          <button
            onClick={() => speakText(message.text.replace(/<[^>]*>/g, ''))}
            style={{
              marginTop: '12px',
              fontSize: '13px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '20px',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
            }}
          >
            <FiVolume2 size={14} />
            Listen
          </button>
        )}
      </div>

      {/* User Avatar */}
      {message.sender === 'user' && (
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: '12px',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
        }}>
          <FiUser size={18} color="white" />
        </div>
      )}
    </div>
  );
});

// Add display name for ESLint
MessageComponent.displayName = 'MessageComponent';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "🎓 Hello there! I'm your **AI Instructor**, ready to guide you through your learning journey! Whether you need help with complex concepts, data analysis, problem-solving, or want to explore new topics, I'm here to provide personalized instruction and support.",
      sender: 'bot',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const API_BASE_URL = 'http://115.124.125.179:8096';

  useEffect(() => {
    if (recognition) return;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => setIsListening(false);
      recognitionInstance.onend = () => setIsListening(false);

      setRecognition(recognitionInstance);
    }
  }, [recognition]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Helper function to extract unique doc_names from reference data
  const extractSourceNames = useCallback((referenceHtml) => {
    if (!referenceHtml) return [];

    try {
      // If referenceHtml is already parsed JSON array
      if (Array.isArray(referenceHtml)) {
        const uniqueDocNames = [...new Set(referenceHtml.map((item) => item.doc_name))];
        return uniqueDocNames.filter((name) => name && name.trim() !== '');
      }

      // If referenceHtml is a JSON string
      if (typeof referenceHtml === 'string') {
        const parsedData = JSON.parse(referenceHtml);
        if (Array.isArray(parsedData)) {
          const uniqueDocNames = [...new Set(parsedData.map((item) => item.doc_name))];
          return uniqueDocNames.filter((name) => name && name.trim() !== '');
        }
      }
    } catch (error) {
      console.error('Error parsing reference data:', error);
    }

    return [];
  }, []);

  const callChatAPI = useCallback(
    async (message) => {
      try {
        const response = await fetch(`${API_BASE_URL}/evaluate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            spoken_text: message,
          }),
        });

        const rawText = await response.text();
        let parsedResponse;

        try {
          // Try to parse as JSON first
          parsedResponse = JSON.parse(rawText);
        } catch (jsonError) {
          // If not JSON, treat as plain text
          parsedResponse = { summary: rawText };
        }

        // Extract summary from JSON response or use the whole text
        const summaryText = parsedResponse.summary || parsedResponse.text || rawText;

        // Extract iframe embed for visualization from summary
        const embedMatch = summaryText.match(/<iframe[\s\S]*?<\/iframe>/i);
        const embedHtml = embedMatch ? embedMatch[0].trim() : '';

        // Clean the summary text
        const cleanText = summaryText
          .replace(/<iframe[\s\S]*?<\/iframe>/i, '')       // remove iframe
          .replace(/📊/g, '')                             // remove chart icon
          .replace(/\*\*visualizations:\*\*/i, '')        // remove markdown bold label
          .replace(/visualizations:/i, '')                // remove plain text label
          .replace(/^\{"checklist":/i, '')                // remove JSON opening
          .replace(/\}$/i, '')                            // remove JSON closing
          .replace(/^"summary":\s*"/i, '')                // remove summary field opening
          .replace(/"$/i, '')                             // remove closing quote
          .replace(/\\n/g, '\n')                          // convert \\n to actual newlines
          .replace(/\\"/g, '"')                           // convert escaped quotes
          .trim();

        // Extract additional sources from the response
        const sourceMatches = summaryText.match(/- (.+?\.(?:json|pdf))/gi) || [];

        return {
          text: cleanText || "I apologize, but I couldn't process your request properly. Could you please try rephrasing your question?",
          embedHtml,
          source: sourceMatches.map(src => src.replace(/^- /, '').trim()),
          referenceHtml: '',
        };
      } catch (error) {
        console.error('API call failed:', error);
        return {
          text: 'I encountered an issue while processing your request. Please try again, and if the problem persists, check your connection.',
          embedHtml: '',
          source: [],
          referenceHtml: '',
        };
      }
    },
    [API_BASE_URL],
  );

  const sendMessage = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInputText = inputText;
    setInputText('');
    setIsLoading(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    try {
      const botResponse = await callChatAPI(currentInputText);

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse.text,
        sender: 'bot',
        source: botResponse.source,
        embedHtml: botResponse.embedHtml,
        referenceHtml: botResponse.referenceHtml,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "I'm sorry, something unexpected happened. Let me try to help you again - please resend your message.",
          sender: 'bot',
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [inputText, isLoading, callChatAPI]);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  const speakText = useCallback((text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage],
  );

  const isDarkContrast = document.body.classList.contains('darkContrast');

  // Memoize the messages to prevent unnecessary re-renders
  const memoizedMessages = useMemo(() => {
    return messages.map((message) => (
      <MessageComponent
        key={message.id}
        message={message}
        isDarkContrast={isDarkContrast}
        extractSourceNames={extractSourceNames}
        speakText={speakText}
      />
    ));
  }, [messages, isDarkContrast, extractSourceNames, speakText]);

  return (
    <div style={{ 
    
      width: "900px",   // ⬅ wider
    maxWidth: "100%", 
      height: '500px', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: '16px',
      overflow: 'hidden',
      background: isDarkContrast 
        ? 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)'
        : 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
      border: isDarkContrast ? '1px solid #4a5568' : '1px solid #e2e8f0',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <FiCpu size={20} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>AI Instructor</h3>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>Your Personal Learning Assistant</p>
        </div>
      </div>

      <ScrollPanel
        style={{

          width: '100%',
          flex: 1,
          overflowX: 'hidden',
          padding: '24px',
          background: 'transparent',
        }}
        className="custombar2 chatbot-scrollpanel"
      >
        {memoizedMessages}

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px', alignItems: 'flex-end' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            }}>
              <FiCpu size={18} color="white" />
            </div>
            <div style={{ 
              background: isDarkContrast 
                ? 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              padding: '16px 20px', 
              borderRadius: '20px 20px 20px 8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: isDarkContrast ? '1px solid #4a5568' : '1px solid #e2e8f0',
            }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ 
                  color: isDarkContrast ? '#a0aec0' : '#718096',
                  fontSize: '14px',
                  marginRight: '8px'
                }}>
                  Thinking...
                </span>
                {[0, 0.2, 0.4].map((delay, index) => (
                  <div
                    key={index}
                    style={{
                      width: '8px',
                      height: '8px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite ease-in-out',
                      animationDelay: `${delay}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollPanel>

      {/* Input Area */}
      <div
        style={{
          padding: '20px 24px',
          background: isDarkContrast ? 'rgba(45, 55, 72, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderTop: isDarkContrast ? '1px solid #4a5568' : '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything... I'm here to help you learn! 🎓"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: isDarkContrast ? '2px solid #4a5568' : '2px solid #e2e8f0',
                borderRadius: '16px',
                resize: 'none',
                outline: 'none',
                fontSize: '15px',
                fontFamily: 'inherit',
                background: isDarkContrast ? '#2d3748' : '#ffffff',
                color: isDarkContrast ? '#e2e8f0' : '#2d3748',
                transition: 'all 0.2s ease',
                minHeight: '52px',
                maxHeight: '120px',
              }}
              rows="1"
              disabled={isLoading}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDarkContrast ? '#4a5568' : '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            onClick={isListening ? stopListening : startListening}
            style={{
              padding: '14px',
              borderRadius: '50%',
              border: 'none',
              background: isListening 
                ? 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)'
                : 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)',
              color: 'white',
              cursor: 'pointer',
              width: '52px',
              height: '52px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
            disabled={isLoading}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
          >
            {isListening ? <FiMicOff size={20} /> : <FiMic size={20} />}
          </button>

          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
            style={{
              padding: '14px',
              borderRadius: '50%',
              border: 'none',
              background: !inputText.trim() || isLoading 
                ? 'linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              cursor: !inputText.trim() || isLoading ? 'not-allowed' : 'pointer',
              width: '52px',
              height: '52px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            }}
            onMouseEnter={(e) => {
              if (!(!inputText.trim() || isLoading)) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }}
          >
            <FiSend size={20} />
          </button>
        </div>

        {isListening && (
          <p style={{ 
            fontSize: '13px', 
            color: '#f56565', 
            marginTop: '12px', 
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#f56565',
              borderRadius: '50%',
              animation: 'pulse 1s infinite',
            }} />
            🎤 I'm listening... speak your question now!
          </p>
        )}

        {!recognition && (
          <p style={{ 
            fontSize: '12px', 
            color: isDarkContrast ? '#a0aec0' : '#718096', 
            marginTop: '8px', 
            marginBottom: '0', 
            textAlign: 'center' 
          }}>
            Voice input not supported in this browser
          </p>
        )}
      </div>

      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

// PropTypes for MessageComponent
MessageComponent.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    sender: PropTypes.string.isRequired,
    embedHtml: PropTypes.string,
    source: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(
        PropTypes.shape({
          doc_name: PropTypes.string,
        }),
      ),
    ]),
  }).isRequired,
  isDarkContrast: PropTypes.bool.isRequired,
  extractSourceNames: PropTypes.func.isRequired,
  speakText: PropTypes.func.isRequired,
};

export default Chatbot;