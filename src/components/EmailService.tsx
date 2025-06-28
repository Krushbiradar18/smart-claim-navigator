
import { useState } from "react";
import { Mail, Send, CheckCircle, FileText, Download, ExternalLink } from "lucide-react";
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

  const updateEmailForm = (field: string, value: string) => {
    setEmailForm(prev => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const sendEmailViaMailto = () => {
    if (!validateEmail(emailForm.to)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!emailForm.message.trim()) {
      toast.error("Please provide a claim description");
      return;
    }

    const mailtoLink = `mailto:${emailForm.to}?subject=${encodeURIComponent(emailForm.subject)}&body=${encodeURIComponent(emailForm.message)}`;
    
    try {
      window.open(mailtoLink);
      toast.success("Email client opened! Please send the email from your email application.");
    } catch (error) {
      console.error("Failed to open email client:", error);
      toast.error("Failed to open email client. Please copy the content manually.");
    }
  };

  const copyToClipboard = async () => {
    const emailContent = `To: ${emailForm.to}\nSubject: ${emailForm.subject}\n\n${emailForm.message}`;
    
    try {
      await navigator.clipboard.writeText(emailContent);
      toast.success("Email content copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  const downloadAsText = () => {
    const emailContent = `To: ${emailForm.to}\nSubject: ${emailForm.subject}\n\n${emailForm.message}`;
    const blob = new Blob([emailContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claim-letter-${claimData.policy_number || 'draft'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Claim letter downloaded!");
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Send Claim Letter via Email
        </CardTitle>
        <CardDescription>
          Create and send your completed claim letter using your email client
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            This will open your default email client with a pre-filled message, or you can copy/download the content to send manually.
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

          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={generateEmailTemplate}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Generate Template
            </Button>
            
            <Button 
              onClick={sendEmailViaMailto}
              disabled={!emailForm.to || !emailForm.message}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open Email Client
            </Button>

            <Button 
              onClick={copyToClipboard}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Copy Content
            </Button>

            <Button 
              onClick={downloadAsText}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailService;
