
import { useState, useEffect } from "react";
import { FileText, User, Calendar, MapPin, Phone, Mail, IndianRupee, Wand2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface ClaimFormProps {
  apiKey: string;
  extractedText: string;
  documentTypes: string;
  claimData: any;
  onClaimDataChange: (data: any) => void;
}

const ClaimForm = ({ apiKey, extractedText, documentTypes, claimData, onClaimDataChange }: ClaimFormProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState("");

  const requiredDocuments = {
    Health: ["Hospital Bill", "Discharge Summary", "Doctor's Report"],
    Accident: ["Police Report", "Vehicle Images", "Medical Report"],
    Travel: ["Flight Ticket", "Passport Copy", "Lost Baggage Report"]
  };

  const updateClaimData = (field: string, value: string) => {
    const newData = { ...claimData, [field]: value };
    onClaimDataChange(newData);
  };

  const checkDocumentRequirements = () => {
    if (!claimData.claim_type || !documentTypes) return null;
    
    const required = requiredDocuments[claimData.claim_type as keyof typeof requiredDocuments] || [];
    const provided = documentTypes.toLowerCase();
    const missing = required.filter(doc => !provided.includes(doc.toLowerCase()));
    
    return { required, missing };
  };

  const generateDescription = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI description generation
      const prompt = `Write a formal insurance claim letter using the following details:
      
Claim Type: ${claimData.claim_type}
Policy Number: ${claimData.policy_number}
Incident Date: ${claimData.incident_date}
Location: ${claimData.location}
Contact: ${claimData.contact_email}, ${claimData.contact_phone}
Address: ${claimData.address}
Estimated Amount: ₹${claimData.estimated_expenses}

The tone should be polite, formal, and easy to understand.`;

      // Simulate API delay
      setTimeout(() => {
        const mockDescription = `Dear Sir/Madam,

I am writing to formally submit a claim for my ${claimData.claim_type?.toLowerCase()} insurance policy (Policy Number: ${claimData.policy_number}).

On ${claimData.incident_date}, an incident occurred at ${claimData.location}. I am hereby requesting claim processing for the damages incurred.

The estimated claim amount is ₹${claimData.estimated_expenses}. I have attached all necessary documentation to support this claim.

Please contact me at ${claimData.contact_email} or ${claimData.contact_phone} for any additional information required.

Thank you for your prompt attention to this matter.

Sincerely,
[Your Name]
${claimData.address}`;

        setGeneratedDescription(mockDescription);
        updateClaimData('user_description', mockDescription);
        setIsGenerating(false);
        toast.success("Description generated successfully!");
      }, 2000);
      
    } catch (error) {
      console.error("Description generation failed:", error);
      toast.error("Failed to generate description. Please try again.");
      setIsGenerating(false);
    }
  };

  const docCheck = checkDocumentRequirements();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Claim Details
          </CardTitle>
          <CardDescription>
            Provide the basic information about your insurance claim
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="claim_type">Claim Type</Label>
              <Select 
                value={claimData.claim_type} 
                onValueChange={(value) => updateClaimData('claim_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select claim type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Accident">Accident</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="policy_number">Policy Number</Label>
              <Input
                id="policy_number"
                value={claimData.policy_number}
                onChange={(e) => updateClaimData('policy_number', e.target.value)}
                placeholder="Enter policy number"
              />
            </div>

            <div>
              <Label htmlFor="incident_date">Date of Incident</Label>
              <Input
                id="incident_date"
                type="date"
                value={claimData.incident_date}
                onChange={(e) => updateClaimData('incident_date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={claimData.location}
                onChange={(e) => updateClaimData('location', e.target.value)}
                placeholder="Where did the incident occur?"
              />
            </div>

            <div>
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={claimData.contact_email}
                onChange={(e) => updateClaimData('contact_email', e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <Label htmlFor="contact_phone">Phone Number</Label>
              <Input
                id="contact_phone"
                value={claimData.contact_phone}
                onChange={(e) => updateClaimData('contact_phone', e.target.value)}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div>
              <Label htmlFor="estimated_expenses">Estimated Claim Amount (₹)</Label>
              <Input
                id="estimated_expenses"
                type="number"
                value={claimData.estimated_expenses}
                onChange={(e) => updateClaimData('estimated_expenses', e.target.value)}
                placeholder="Enter amount in INR"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={claimData.address}
              onChange={(e) => updateClaimData('address', e.target.value)}
              placeholder="Your complete address"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {docCheck && (
        <Card>
          <CardHeader>
            <CardTitle>Document Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium">Required documents for {claimData.claim_type} claims:</p>
              <div className="flex flex-wrap gap-2">
                {docCheck.required.map((doc, index) => (
                  <Badge 
                    key={index} 
                    variant={docCheck.missing.includes(doc) ? "destructive" : "default"}
                  >
                    {doc}
                  </Badge>
                ))}
              </div>
              {docCheck.missing.length > 0 && (
                <Alert>
                  <AlertDescription>
                    Missing documents: {docCheck.missing.join(", ")}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Incident Description
          </CardTitle>
          <CardDescription>
            Describe what happened or let AI help you write a formal claim letter
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={generateDescription}
              disabled={isGenerating || !claimData.claim_type}
              className="flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              {isGenerating ? "Generating..." : "Generate Description"}
            </Button>
          </div>

          <Textarea
            value={claimData.user_description}
            onChange={(e) => updateClaimData('user_description', e.target.value)}
            placeholder="Describe the incident in detail..."
            rows={8}
            className="font-mono text-sm"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimForm;
