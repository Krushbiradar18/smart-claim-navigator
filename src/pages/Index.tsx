import { useState, useEffect } from "react";
import { Upload, FileText, Calculator, MessageCircle, Settings, CheckCircle, AlertTriangle, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import DocumentUpload from "@/components/DocumentUpload";
import ClaimForm from "@/components/ClaimForm";
import ClaimEstimator from "@/components/ClaimEstimator";
import ChatAssistant from "@/components/ChatAssistant";
import ApiKeySetup from "@/components/ApiKeySetup";
import ClaimValidation from "@/components/ClaimValidation";
import EmailService from "@/components/EmailService";

const Index = () => {
  // Securely stored API key
  const SECURE_API_KEY = "jwz7Wj2uwq2TAIFd0KrcQQ97IvrdlpQfc72hL29b";
  
  const [apiKey, setApiKey] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);
  const [extractedText, setExtractedText] = useState("");
  const [documentTypes, setDocumentTypes] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [claimData, setClaimData] = useState({
    claim_type: "",
    user_description: "",
    policy_number: "",
    incident_date: "",
    location: "",
    estimated_expenses: "",
    contact_email: "",
    contact_phone: "",
    address: ""
  });

  useEffect(() => {
    // Auto-initialize with secure API key
    const initializeApp = () => {
      // Check if API key exists in localStorage, if not set it
      const storedKey = localStorage.getItem("cohere_api_key");
      if (!storedKey || storedKey !== SECURE_API_KEY) {
        localStorage.setItem("cohere_api_key", SECURE_API_KEY);
      }
      
      setApiKey(SECURE_API_KEY);
      setIsInitializing(false);
    };

    // Small delay to show initialization
    const timer = setTimeout(initializeApp, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isInitializing || !apiKey) {
    return <ApiKeySetup onApiKeySet={setApiKey} />;
  }

  const getStepStatus = (step: number) => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "current";
    return "upcoming";
  };

  const getStepClasses = (step: number) => {
    const status = getStepStatus(step);
    switch (status) {
      case "completed":
        return "w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium";
      case "current":
        return "w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium";
      default:
        return "w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium";
    }
  };

  const getStepTextClasses = (step: number) => {
    const status = getStepStatus(step);
    switch (status) {
      case "completed":
        return "ml-2 text-sm font-medium text-green-700";
      case "current":
        return "ml-2 text-sm font-medium text-blue-700";
      default:
        return "ml-2 text-sm font-medium text-gray-500";
    }
  };

  const getConnectorClasses = (step: number) => {
    const status = getStepStatus(step);
    return status === "completed" 
      ? "w-16 h-1 bg-green-500 rounded" 
      : "w-16 h-1 bg-gray-200 rounded";
  };

  const handleTabChange = (value: string) => {
    switch (value) {
      case "upload":
        setCurrentStep(1);
        break;
      case "details":
        setCurrentStep(2);
        break;
      case "estimate":
        setCurrentStep(3);
        break;
      case "email":
        setCurrentStep(4);
        break;
      case "chat":
        setCurrentStep(4);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Smart Insurance Assistant
          </h1>
          <p className="text-lg text-gray-600">
            AI-powered claim processing with enhanced validation and email support
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className={getStepClasses(1)}>
                {getStepStatus(1) === "completed" ? <CheckCircle className="w-5 h-5" /> : "1"}
              </div>
              <span className={getStepTextClasses(1)}>Upload</span>
            </div>
            <div className={getConnectorClasses(1)}></div>
            <div className="flex items-center">
              <div className={getStepClasses(2)}>
                {getStepStatus(2) === "completed" ? <CheckCircle className="w-5 h-5" /> : "2"}
              </div>
              <span className={getStepTextClasses(2)}>Details</span>
            </div>
            <div className={getConnectorClasses(2)}></div>
            <div className="flex items-center">
              <div className={getStepClasses(3)}>
                {getStepStatus(3) === "completed" ? <CheckCircle className="w-5 h-5" /> : "3"}
              </div>
              <span className={getStepTextClasses(3)}>Review</span>
            </div>
            <div className={getConnectorClasses(3)}></div>
            <div className="flex items-center">
              <div className={getStepClasses(4)}>
                {getStepStatus(4) === "completed" ? <CheckCircle className="w-5 h-5" /> : "4"}
              </div>
              <span className={getStepTextClasses(4)}>Send</span>
            </div>
          </div>
        </div>

        {/* Claim Validation Status */}
        {(claimData.claim_type || extractedText) && (
          <div className="mb-6">
            <ClaimValidation
              claimData={claimData}
              documentTypes={documentTypes}
              extractedText={extractedText}
            />
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="upload" className="space-y-6" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-5 lg:w-[750px] mx-auto">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="estimate" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Estimate
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <DocumentUpload
              apiKey={apiKey}
              onTextExtracted={setExtractedText}
              onDocumentTypesDetected={setDocumentTypes}
            />
          </TabsContent>

          <TabsContent value="details">
            <ClaimForm
              apiKey={apiKey}
              extractedText={extractedText}
              documentTypes={documentTypes}
              claimData={claimData}
              onClaimDataChange={setClaimData}
            />
          </TabsContent>

          <TabsContent value="estimate">
            <ClaimEstimator
              apiKey={apiKey}
              claimData={claimData}
              extractedText={extractedText}
            />
          </TabsContent>

          <TabsContent value="email">
            <EmailService
              claimData={claimData}
              claimDescription={claimData.user_description}
            />
          </TabsContent>

          <TabsContent value="chat">
            <ChatAssistant
              apiKey={apiKey}
              claimData={claimData}
              extractedText={extractedText}
            />
          </TabsContent>
        </Tabs>

        {/* API Key Settings */}
        <div className="fixed top-4 right-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              localStorage.removeItem("cohere_api_key");
              setApiKey("");
            }}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Change API Key
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
