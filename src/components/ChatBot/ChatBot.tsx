import { useEffect } from 'react';

declare global {
  interface Window {
    Chatbot?: any;
  }
}

const ChatBot = () => {
  useEffect(() => {
    // Check if chatbot is already loaded
    if (window.Chatbot) {
      return;
    }

    // Create and append script tag
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
      import Chatbot from "https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js"
      Chatbot.init({
          chatflowid: "eed5e980-3cf6-42cf-b215-8d483f5b0c87",
          apiHost: "https://srv938896.hstgr.cloud",
      })
      window.Chatbot = Chatbot;
    `;
    
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default ChatBot;