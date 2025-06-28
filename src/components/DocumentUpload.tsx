
import { useState, useCallback } from "react";
import { Upload, FileText, Image, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface DocumentUploadProps {
  apiKey: string;
  onTextExtracted: (text: string) => void;
  onDocumentTypesDetected: (types: string) => void;
}

const DocumentUpload = ({ apiKey, onTextExtracted, onDocumentTypesDetected }: DocumentUploadProps) => {
  const [extractedText, setExtractedText] = useState("");
  const [documentTypes, setDocumentTypes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setUploadedFiles(fileArray);
    setIsProcessing(true);

    try {
      let combinedText = "";
      
      for (const file of fileArray) {
        if (file.type === "application/pdf") {
          // Simulate PDF text extraction
          combinedText += `[PDF Content from ${file.name}]\nSample extracted text from PDF document...\n\n`;
        } else if (file.type.startsWith("image/")) {
          // Simulate OCR processing
          combinedText += `[OCR Content from ${file.name}]\nSample text extracted from image using OCR...\n\n`;
        }
      }

      setExtractedText(combinedText);
      onTextExtracted(combinedText);

      // Simulate document classification
      const classificationPrompt = `Classify the type(s) of this document content. Choose from: Hospital Bill, Discharge Summary, Doctor's Report, Police Report, Vehicle Image, Medical Report, Flight Ticket, Passport Copy, Lost Baggage Report.\n\nDocument Text:\n${combinedText}`;
      
      // Simulate API call
      setTimeout(() => {
        const mockTypes = "Hospital Bill, Medical Report";
        setDocumentTypes(mockTypes);
        onDocumentTypesDetected(mockTypes);
        setIsProcessing(false);
        toast.success("Documents processed successfully!");
      }, 2000);

    } catch (error) {
      console.error("Document processing failed:", error);
      toast.error("Failed to process documents. Please try again.");
      setIsProcessing(false);
    }
  }, [apiKey, onTextExtracted, onDocumentTypesDetected]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Claim Documents
          </CardTitle>
          <CardDescription>
            Upload your insurance claim documents (PDF, PNG, JPG, JPEG)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600">Processing documents...</p>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop files here or click to upload
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, PNG, JPG, JPEG files
                </p>
              </>
            )}
            
            <input
              id="fileInput"
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">Uploaded Files:</h4>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    {file.type === "application/pdf" ? (
                      <FileText className="w-4 h-4 text-red-500" />
                    ) : (
                      <Image className="w-4 h-4 text-blue-500" />
                    )}
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {extractedText && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Extracted Text
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={extractedText}
              readOnly
              className="min-h-[200px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      )}

      {documentTypes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Document Classification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {documentTypes.split(',').map((type, index) => (
                <Badge key={index} variant="secondary">
                  {type.trim()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentUpload;
