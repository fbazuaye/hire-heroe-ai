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
          chatflowid: "81474cb0-b321-4dfe-abd3-0487f4de430b",
          apiHost: "https://ulqnimmhknylzhbxvibw.supabase.co/functions/v1/flowise-proxy",
          chatflowConfig: {
              /* Chatflow Config */
          },
          observersConfig: {
              /* Observers Config */
          },
        theme: {
            button: {
                backgroundColor: '#3B81F6',
                right: 20,
                bottom: 20,
                size: 48,
                dragAndDrop: true,
                iconColor: 'white',
                customIconSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
                autoWindowOpen: {
                    autoOpen: false,
                    openDelay: 2,
                    autoOpenOnMobile: false
                }
            },
            tooltip: {
                showTooltip: true,
                tooltipMessage: 'CareerAi Chatagent',
                tooltipBackgroundColor: 'black',
                tooltipTextColor: 'white',
                tooltipFontSize: 16
            },
            disclaimer: {
                title: 'Disclaimer',
                message: "By using this chatbot, you agree to the <a target=\\"_blank\\" href=\\"CareerAi\\">Terms & Condition</a>",
                textColor: 'black',
                buttonColor: '#3b82f6',
                buttonText: 'Start Chatting',
                buttonTextColor: 'white',
                blurredBackgroundColor: 'rgba(0, 0, 0, 0.4)',
                backgroundColor: 'white'
            },
            customCSS: \`\`,
            chatWindow: {
                showTitle: true,
                showAgentMessages: true,
                title: 'CareerAi',
                titleAvatarSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
                welcomeMessage: 'Hi there! I\\'m CareerAI, your personal job search assistant.\\nI\\'m here to make your career journey smoother \\nJust ask me anything about your job search, and I\\'ll give you tailored guidance, tools, and resources to boost your chances of success. \\n',
                errorMessage: 'This is a custom error message',
                backgroundColor: '#ffffff',
                backgroundImage: 'enter image path or link',
                height: 490,
                width: 400,
                fontSize: 16,
                starterPrompts: [
                    "How can I improve my LinkedIn profile?",
                    "What certifications can boost my employability"
                ],
                starterPromptFontSize: 15,
                clearChatOnReload: false,
                sourceDocsTitle: 'Sources:',
                renderHTML: true,
                botMessage: {
                    backgroundColor: '#f7f8ff',
                    textColor: '#303235',
                    showAvatar: true,
                    avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/parroticon.png'
                },
                userMessage: {
                    backgroundColor: '#3B81F6',
                    textColor: '#ffffff',
                    showAvatar: true,
                    avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png'
                },
                textInput: {
                    placeholder: 'Type your question',
                    backgroundColor: '#ffffff',
                    textColor: '#303235',
                    sendButtonColor: '#3B81F6',
                    maxChars: 300,
                    maxCharsWarningMessage: 'You exceeded the characters limit. Please input less than 300 characters.',
                    autoFocus: true,
                    sendMessageSound: true,
                    sendSoundLocation: 'send_message.mp3',
                    receiveMessageSound: true,
                    receiveSoundLocation: 'receive_message.mp3'
                },
                feedback: {
                    color: '#303235'
                },
                dateTimeToggle: {
                    date: true,
                    time: true
                },
                footer: {
                    textColor: '#303235',
                    text: 'Powered by',
                    company: 'LiveGig Ltd',
                    companyLink: 'https://hireheroe.netlify.app/'
                }
            }
        }
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