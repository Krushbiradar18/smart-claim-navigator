
import { useState } from "react";
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
  const [apiKey, setApiKey] = useState(localStorage.getItem("cohere_api_key") || "");
  const [extractedText, setExtractedText] = useState("");
  const [documentTypes, setDocumentTypes] = useState("");
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

  if (!apiKey) {
    return <ApiKeySetup onApiKeySet={setApiKey} />;
  }

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
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">Upload</span>
            </div>
            <div className="w-16 h-1 bg-gray-200 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Details</span>
            </div>
            <div className="w-16 h-1 bg-gray-200 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Review</span>
            </div>
            <div className="w-16 h-1 bg-gray-200 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                4
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Send</span>
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
        <Tabs defaultValue="upload" className="space-y-6">
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
