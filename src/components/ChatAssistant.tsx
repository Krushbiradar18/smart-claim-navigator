
import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, User, Bot } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatAssistantProps {
  apiKey: string;
  claimData: any;
  extractedText: string;
}
const getCohereReply = async (message: string, apiKey: string) => {
  const response = await fetch("https://api.cohere.ai/v1/chat", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  message: `You are a helpful assistant specializing in insurance claims and BFSI (Banking, Financial Services, and Insurance). Only answer questions within these domains. If asked something outside this scope, respond with: "I'm designed to assist only with insurance and BFSI-related queries." Now answer: ${message}`,
  chat_history: [],
  model: "command-r-plus",
  temperature: 0.5
})
  });

  const data = await response.json();
  return data.text;
};

const ChatAssistant = ({ apiKey, claimData, extractedText }: ChatAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your insurance claim assistant. I can help you with questions about your claim, explain insurance terms, or provide guidance on the claim process. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

const sendMessage = async () => {
  if (!inputMessage.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    role: "user",
    content: inputMessage,
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMessage]);
  setInputMessage("");
  setIsTyping(true);

  try {
    const aiReply = await getCohereReply(inputMessage, apiKey); // ⬅️ Real API call

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiReply,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
  } catch (error) {
    setMessages(prev => [
      ...prev,
      {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "Sorry, something went wrong while getting a response.",
        timestamp: new Date()
      }
    ]);
    console.error("Cohere API error:", error);
  } finally {
    setIsTyping(false);
  }
};

  const generateMockResponse = (question: string, claimData: any) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes("status") || lowerQuestion.includes("track")) {
      return "Based on your submitted documents and claim details, your claim is currently in the initial review stage. Typically, claims are processed within 7-15 business days. You'll receive updates via email and SMS.";
    }
    
    if (lowerQuestion.includes("document") || lowerQuestion.includes("paper")) {
      return `For ${claimData.claim_type || "your"} claims, you typically need: hospital bills, discharge summary, ID proof, and policy documents. I can see you've uploaded some documents already. Make sure all documents are clear and legible.`;
    }
    
    if (lowerQuestion.includes("amount") || lowerQuestion.includes("money") || lowerQuestion.includes("payout")) {
      return "Claim amounts depend on your policy coverage, deductibles, and the specific incident. Based on your estimated amount, I'd recommend getting a detailed estimate using our AI estimator tool. The final amount will be determined after claim verification.";
    }
    
    if (lowerQuestion.includes("time") || lowerQuestion.includes("how long")) {
      return "Insurance claim processing typically takes 7-21 business days, depending on the complexity and completeness of documentation. Simple claims with complete documentation are processed faster.";
    }
    
    if (lowerQuestion.includes("reject") || lowerQuestion.includes("denied")) {
      return "Claims can be rejected for various reasons: incomplete documentation, policy exclusions, late reporting, or pre-existing conditions. If rejected, you can appeal with additional documentation or clarification.";
    }
    
    if (lowerQuestion.includes("hello") || lowerQuestion.includes("hi")) {
      return "Hello! I'm here to help with your insurance claim. Feel free to ask me about claim status, required documents, processing times, or any other insurance-related questions.";
    }
    
    return "Thank you for your question. Based on your claim details, I recommend ensuring all required documents are submitted and following up with your insurance provider if needed. Is there anything specific about your claim process you'd like me to explain?";
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
      <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Insurance Assistant Chat
        </CardTitle>
        <CardDescription>
          Ask questions about your claim, insurance processes, or get guidance
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
                <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a question about your claim..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={isTyping}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!inputMessage.trim() || isTyping}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatAssistant;
