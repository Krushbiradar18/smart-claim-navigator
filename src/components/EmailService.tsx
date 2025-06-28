
import { useState } from "react";
import { Mail, Send, Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface EmailServiceProps {
  claimData: any;
  claimDescription: string;
}

const EmailService = ({ claimData, claimDescription }: EmailServiceProps) => {
  const [emailForm, setEmailForm] = useState({
    to: "",
    subject: `Insurance Claim - Policy #${claimData.policy_number || 'N/A'}`,
    message: claimDescription
  });
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const updateEmailForm = (field: string, value: string) => {
    setEmailForm(prev => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const sendEmail = async () => {
    if (!validateEmail(emailForm.to)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!emailForm.message.trim()) {
      toast.error("Please provide a claim description");
      return;
    }

    setIsSending(true);
    
    try {
      // Simulate email sending - In a real app, this would connect to an email service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would integrate with an actual email service like:
      // - EmailJS for client-side email sending
      // - A backend API that handles email sending
      // - Supabase Edge Functions for server-side email processing
      
      console.log("Email would be sent with:", {
        to: emailForm.to,
        subject: emailForm.subject,
        body: emailForm.message,
        attachments: "Claim documents and extracted text"
      });

      setEmailSent(true);
      toast.success("Claim letter sent successfully!");
      
    } catch (error) {
      console.error("Email sending failed:", error);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const generateEmailTemplate = () => {
    const template = `Dear Insurance Team,

I am submitting a formal claim for my ${claimData.claim_type?.toLowerCase()} insurance policy.

Policy Details:
- Policy Number: ${claimData.policy_number || 'N/A'}
- Claim Type: ${claimData.claim_type || 'N/A'}
- Incident Date: ${claimData.incident_date || 'N/A'}
- Location: ${claimData.location || 'N/A'}

${claimDescription}

Contact Information:
- Email: ${claimData.contact_email || 'N/A'}
- Phone: ${claimData.contact_phone || 'N/A'}
- Address: ${claimData.address || 'N/A'}

I have attached all necessary documentation to support this claim. Please contact me if you need any additional information.

Thank you for your prompt attention to this matter.

Best regards,
[Your Name]`;

    updateEmailForm('message', template);
    toast.success("Email template generated!");
  };

  if (emailSent) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold text-green-700">Email Sent Successfully!</h3>
            <p className="text-gray-600">Your claim letter has been sent to {emailForm.to}</p>
            <Button onClick={() => setEmailSent(false)} variant="outline">
              Send Another Email
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Send Claim Letter via Email
        </CardTitle>
        <CardDescription>
          Send your completed claim letter directly to your insurance company
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            This feature sends your claim letter directly via email. Make sure all information is correct before sending.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="email_to">Send To (Insurance Company Email)</Label>
            <Input
              id="email_to"
              type="email"
              value={emailForm.to}
              onChange={(e) => updateEmailForm('to', e.target.value)}
              placeholder="claims@insurancecompany.com"
            />
          </div>

          <div>
            <Label htmlFor="email_subject">Subject</Label>
            <Input
              id="email_subject"
              value={emailForm.subject}
              onChange={(e) => updateEmailForm('subject', e.target.value)}
              placeholder="Insurance Claim Submission"
            />
          </div>

          <div>
            <Label htmlFor="email_message">Claim Letter</Label>
            <Textarea
              id="email_message"
              value={emailForm.message}
              onChange={(e) => updateEmailForm('message', e.target.value)}
              placeholder="Your claim letter content..."
              rows={12}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={generateEmailTemplate}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Generate Template
            </Button>
            
            <Button 
              onClick={sendEmail}
              disabled={isSending || !emailForm.to || !emailForm.message}
              className="flex items-center gap-2 flex-1"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isSending ? "Sending..." : "Send Email"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailService;
