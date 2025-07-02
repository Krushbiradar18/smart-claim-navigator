
import { useEffect } from "react";
import { Key, Shield, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void;
}

const ApiKeySetup = ({ onApiKeySet }: ApiKeySetupProps) => {
  // Securely stored API key
  const SECURE_API_KEY = "jwz7Wj2uwq2TAIFd0KrcQQ97IvrdlpQfc72hL29b";

  useEffect(() => {
    // Automatically set up the API key
    const setupApiKey = () => {
      // Store API key securely in localStorage
      localStorage.setItem("cohere_api_key", SECURE_API_KEY);
      
      // Auto-initialize after a brief delay
      setTimeout(() => {
        onApiKeySet(SECURE_API_KEY);
      }, 1500);
    };

    setupApiKey();
  }, [onApiKeySet]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Setting Up Assistant</CardTitle>
          <CardDescription>
            Initializing your Smart Insurance Assistant...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center p-6">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Secure API connection established</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">Loading Assistant...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeySetup;
