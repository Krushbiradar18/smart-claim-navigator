
import { useState } from "react";
import { CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ClaimValidationProps {
  claimData: any;
  documentTypes: string;
  extractedText: string;
}

const ClaimValidation = ({ claimData, documentTypes, extractedText }: ClaimValidationProps) => {
  const requiredFields = {
    basic: [
      { key: 'claim_type', label: 'Claim Type', required: true },
      { key: 'policy_number', label: 'Policy Number', required: true },
      { key: 'incident_date', label: 'Incident Date', required: true },
      { key: 'contact_email', label: 'Email', required: true },
      { key: 'user_description', label: 'Description', required: true }
    ],
    optional: [
      { key: 'location', label: 'Location', required: false },
      { key: 'contact_phone', label: 'Phone', required: false },
      { key: 'estimated_expenses', label: 'Estimated Amount', required: false },
      { key: 'address', label: 'Address', required: false }
    ]
  };

  const requiredDocuments = {
    Health: ["Hospital Bill", "Discharge Summary", "Medical Report"],
    Accident: ["Police Report", "Vehicle Images", "Medical Report"],
    Travel: ["Flight Ticket", "Passport Copy", "Lost Baggage Report"]
  };

  const validateFields = () => {
    const missing = requiredFields.basic.filter(field => 
      !claimData[field.key] || claimData[field.key].toString().trim() === ''
    );
    
    const completed = requiredFields.basic.filter(field => 
      claimData[field.key] && claimData[field.key].toString().trim() !== ''
    );

    return { missing, completed };
  };

  const validateDocuments = () => {
    if (!claimData.claim_type || !documentTypes) return { missing: [], provided: [] };
    
    const required = requiredDocuments[claimData.claim_type as keyof typeof requiredDocuments] || [];
    const providedLower = documentTypes.toLowerCase();
    
    console.log("Debug - Document validation:");
    console.log("Required documents:", required);
    console.log("Provided document types:", documentTypes);
    console.log("Provided (lowercase):", providedLower);
    
    // More flexible matching - check for partial matches and common variations
    const isDocumentProvided = (requiredDoc: string) => {
      const docLower = requiredDoc.toLowerCase();
      
      // Direct match
      if (providedLower.includes(docLower)) return true;
      
      // Handle common variations
      const variations: { [key: string]: string[] } = {
        "police report": ["police", "report", "fir", "accident report"],
        "vehicle images": ["vehicle", "image", "car", "damage", "photo"],
        "medical report": ["medical", "doctor", "health", "treatment"],
        "hospital bill": ["hospital", "bill", "invoice", "receipt"],
        "discharge summary": ["discharge", "summary", "hospital"],
        "flight ticket": ["flight", "ticket", "boarding", "travel"],
        "passport copy": ["passport", "id", "identity"],
        "lost baggage report": ["baggage", "luggage", "lost", "report"]
      };
      
      const docVariations = variations[docLower] || [];
      return docVariations.some(variation => providedLower.includes(variation));
    };
    
    const missing = required.filter(doc => !isDocumentProvided(doc));
    const provided = required.filter(doc => isDocumentProvided(doc));
    
    console.log("Missing documents:", missing);
    console.log("Provided documents:", provided);
    
    return { missing, provided };
  };

  const getClaimCompleteness = () => {
    const fieldValidation = validateFields();
    const docValidation = validateDocuments();
    
    const totalRequired = requiredFields.basic.length + (requiredDocuments[claimData.claim_type as keyof typeof requiredDocuments]?.length || 0);
    const completed = fieldValidation.completed.length + docValidation.provided.length;
    
    return Math.round((completed / totalRequired) * 100);
  };

  const fieldValidation = validateFields();
  const docValidation = validateDocuments();
  const completeness = getClaimCompleteness();

  const getStatusColor = () => {
    if (completeness >= 80) return "text-green-600";
    if (completeness >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = () => {
    if (completeness >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (completeness >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Claim Completion Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className={`text-sm font-bold ${getStatusColor()}`}>{completeness}%</span>
        </div>
        <Progress value={completeness} className="w-full" />

        {fieldValidation.missing.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Missing Required Information:</strong>
              <div className="mt-2 flex flex-wrap gap-1">
                {fieldValidation.missing.map((field, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {field.label}
                  </Badge>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {docValidation.missing.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Missing Required Documents:</strong>
              <div className="mt-2 flex flex-wrap gap-1">
                {docValidation.missing.map((doc, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {doc}
                  </Badge>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {completeness >= 80 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-700">
              <strong>Great!</strong> Your claim is ready for submission. All required information and documents are provided.
            </AlertDescription>
          </Alert>
        )}

        {docValidation.provided.length > 0 && (
          <div>
            <p className="text-sm font-medium text-green-700 mb-2">✅ Documents Provided:</p>
            <div className="flex flex-wrap gap-1">
              {docValidation.provided.map((doc, index) => (
                <Badge key={index} variant="default" className="text-xs">
                  {doc}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClaimValidation;
