
import { useState } from "react";
import { Key, Shield, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void;
}

const ApiKeySetup = ({ onApiKeySet }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsLoading(true);
    
    // Store API key in localStorage
    localStorage.setItem("cohere_api_key", apiKey.trim());
    
    // Simulate validation delay
    setTimeout(() => {
      setIsLoading(false);
      onApiKeySet(apiKey.trim());
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Setup Required</CardTitle>
          <CardDescription>
            Enter your Cohere API key to get started with AI-powered claim assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Your API key is stored locally in your browser for security. It won't be sent to any external servers except Cohere's API.
            </AlertDescription>
          </Alert>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="apiKey">Cohere API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your Cohere API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!apiKey.trim() || isLoading}
            >
              <Shield className="w-4 h-4 mr-2" />
              {isLoading ? "Verifying..." : "Setup Assistant"}
            </Button>
          </form>
          
          <div className="text-sm text-gray-500 space-y-2">
            <p>Don't have an API key?</p>
            <a 
              href="https://cohere.ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Get your free Cohere API key →
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeySetup;
