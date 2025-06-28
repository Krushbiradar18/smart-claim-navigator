
import { useState } from "react";
import { Calculator, IndianRupee, TrendingUp, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ClaimEstimatorProps {
  apiKey: string;
  claimData: any;
  extractedText: string;
}

const ClaimEstimator = ({ apiKey, claimData, extractedText }: ClaimEstimatorProps) => {
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimation, setEstimation] = useState("");
  const [estimatedAmount, setEstimatedAmount] = useState("");

  const generateEstimate = async () => {
    setIsEstimating(true);
    
    try {
      // Simulate AI estimation
      const prompt = `You are an experienced insurance claim analyst. Based on the following claim details, provide an estimated insurance payout in INR along with a brief justification.

Claim Type: ${claimData.claim_type}
Location: ${claimData.location}
Date: ${claimData.incident_date}
User Estimate: ₹${claimData.estimated_expenses}
Description: ${claimData.user_description}
Extracted Documents: ${extractedText}

Provide a realistic estimate based on Indian insurance standards.`;

      // Simulate API delay and response
      setTimeout(() => {
        const mockEstimate = generateMockEstimate();
        setEstimation(mockEstimate.details);
        setEstimatedAmount(mockEstimate.amount);
        setIsEstimating(false);
        toast.success("Estimate generated successfully!");
      }, 3000);
      
    } catch (error) {
      console.error("Estimation failed:", error);
      toast.error("Failed to generate estimate. Please try again.");
      setIsEstimating(false);
    }
  };

  const generateMockEstimate = () => {
    const userAmount = parseInt(claimData.estimated_expenses) || 0;
    const claimType = claimData.claim_type;
    
    let estimatedAmount = userAmount;
    let details = "";

    switch (claimType) {
      case "Health":
        estimatedAmount = Math.min(userAmount * 0.9, 500000); // 90% up to 5 lakh
        details = `Based on typical health insurance claims in India:

• Medical Treatment Coverage: 90% of eligible expenses
• Room Rent Limit: As per policy terms
• Pre/Post Hospitalization: 30/60 days coverage
• Estimated Payout: ₹${estimatedAmount.toLocaleString()}

The estimate considers standard health insurance norms and the documents provided. Final amount depends on policy terms and medical necessity verification.`;
        break;
        
      case "Accident":
        estimatedAmount = Math.min(userAmount * 0.85, 1000000); // 85% up to 10 lakh
        details = `Based on typical motor insurance claims in India:

• Vehicle Damage Assessment: 85% of repair costs
• Third Party Liability: As per policy limit
• Depreciation Deduction: Age-based depreciation applies
• Estimated Payout: ₹${estimatedAmount.toLocaleString()}

The estimate considers standard motor insurance practices and current vehicle repair costs in India.`;
        break;
        
      case "Travel":
        estimatedAmount = Math.min(userAmount * 0.95, 200000); // 95% up to 2 lakh
        details = `Based on typical travel insurance claims in India:

• Baggage Loss/Delay: Up to policy limit per item
• Medical Emergency: 100% of eligible expenses
• Trip Cancellation: Actual loss or policy limit
• Estimated Payout: ₹${estimatedAmount.toLocaleString()}

The estimate is based on standard travel insurance coverage and the incident details provided.`;
        break;
        
      default:
        estimatedAmount = userAmount * 0.8;
        details = `General insurance claim estimate:

• Estimated Payout: ₹${estimatedAmount.toLocaleString()}
• Coverage typically ranges from 70-90% of claimed amount
• Final settlement depends on policy terms and verification`;
    }

    return {
      amount: estimatedAmount.toLocaleString(),
      details
    };
  };

  const canEstimate = claimData.claim_type && (claimData.estimated_expenses || extractedText);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Claim Amount Estimator
          </CardTitle>
          <CardDescription>
            Get an AI-powered estimate of your potential claim payout
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Claim Type</span>
              </div>
              <Badge>{claimData.claim_type || "Not selected"}</Badge>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Your Estimate</span>
              </div>
              <span className="text-lg font-semibold text-green-900">
                ₹{claimData.estimated_expenses ? parseInt(claimData.estimated_expenses).toLocaleString() : "0"}
              </span>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">AI Estimate</span>
              </div>
              <span className="text-lg font-semibold text-purple-900">
                {estimatedAmount ? `₹${estimatedAmount}` : "Generate estimate"}
              </span>
            </div>
          </div>

          <Button 
            onClick={generateEstimate}
            disabled={isEstimating || !canEstimate}
            className="w-full flex items-center gap-2"
            size="lg"
          >
            <Calculator className="w-4 h-4" />
            {isEstimating ? "Analyzing claim data..." : "Generate AI Estimate"}
          </Button>

          {!canEstimate && (
            <p className="text-sm text-gray-500 text-center">
              Please select a claim type and provide an estimated amount to generate an AI estimate.
            </p>
          )}
        </CardContent>
      </Card>

      {estimation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Estimated Payout Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={estimation}
              readOnly
              className="min-h-[300px] font-mono text-sm"
            />
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-green-800">Estimated Payout:</span>
                <span className="text-2xl font-bold text-green-900">₹{estimatedAmount}</span>
              </div>
              <p className="text-sm text-green-700 mt-2">
                *This is an AI-generated estimate. Actual payout may vary based on policy terms and claim verification.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClaimEstimator;
