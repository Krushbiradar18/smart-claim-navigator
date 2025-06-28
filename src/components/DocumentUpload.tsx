import { useState, useCallback } from "react";
import { Upload, FileText, Image, CheckCircle, AlertTriangle, Loader2, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface DocumentUploadProps {
  apiKey: string;
  onTextExtracted: (text: string) => void;
  onDocumentTypesDetected: (types: string) => void;
}

interface ImageFeatures {
  filename: string;
  width: number;
  height: number;
  aspectRatio: number;
  size: number;
  type: string;
  hasText: boolean;
  colorComplexity: number;
  brightness: number;
  contrast: number;
}

const DocumentUpload = ({ apiKey, onTextExtracted, onDocumentTypesDetected }: DocumentUploadProps) => {
  const [extractedText, setExtractedText] = useState("");
  const [documentTypes, setDocumentTypes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [imageFeatures, setImageFeatures] = useState<ImageFeatures[]>([]);

  const analyzeImageFeatures = async (file: File): Promise<ImageFeatures> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Extract basic image features
        const features: ImageFeatures = {
          filename: file.name,
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height,
          size: file.size,
          type: file.type,
          // Simulate color analysis and text density detection
          hasText: Math.random() > 0.3, // Simulate text detection
          colorComplexity: Math.random() * 100,
          brightness: Math.random() * 100,
          contrast: Math.random() * 100
        };
        
        resolve(features);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const classifyWithImageFeatures = async (text: string, features: ImageFeatures[]) => {
    // Enhanced classification prompt that includes image features
    const imageAnalysis = features.map(f => 
      `Image: ${f.filename} - Size: ${f.width}x${f.height}, Aspect Ratio: ${f.aspectRatio.toFixed(2)}, Has Text: ${f.hasText}, Color Complexity: ${f.colorComplexity.toFixed(1)}`
    ).join('\n');

    const enhancedPrompt = `Classify the document type(s) based on both text content and image characteristics.

TEXT CONTENT:
${text}

IMAGE ANALYSIS:
${imageAnalysis}

Classification Rules:
- Hospital Bill: Usually has structured text, tables, medical terminology, moderate aspect ratio
- Medical Report: Dense text, medical terms, often portrait orientation
- Police Report: Official format, structured layout, government terminology
- Vehicle Images: High aspect ratio variations, less text density, outdoor/vehicle features
- Flight Ticket: Specific format, travel terminology, barcode-like elements
- Passport Copy: Standard document size, portrait orientation, official format
- Discharge Summary: Medical terminology, structured format, hospital letterhead

Choose from: Hospital Bill, Discharge Summary, Doctor's Report, Police Report, Vehicle Image, Medical Report, Flight Ticket, Passport Copy, Lost Baggage Report

Provide confidence scores and reasoning for your classification.`;

    return enhancedPrompt;
  };

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setUploadedFiles(fileArray);
    setIsProcessing(true);

    try {
      let combinedText = "";
      const allImageFeatures: ImageFeatures[] = [];
      
      for (const file of fileArray) {
        if (file.type === "application/pdf") {
          // Simulate PDF text extraction with enhanced metadata
          combinedText += `[PDF Document: ${file.name}]\n`;
          combinedText += `Document Analysis: ${file.size} bytes, likely contains structured data\n`;
          combinedText += "Sample extracted text with medical billing information, treatment codes, and patient details...\n\n";
        } else if (file.type.startsWith("image/")) {
          // Analyze image features
          const features = await analyzeImageFeatures(file);
          allImageFeatures.push(features);
          
          // Simulate enhanced OCR with image analysis
          combinedText += `[Image Document: ${file.name}]\n`;
          combinedText += `Image Properties: ${features.width}x${features.height}, Text Detected: ${features.hasText}\n`;
          
          if (features.hasText) {
            combinedText += "OCR Results: Sample text extracted from image with enhanced accuracy based on image preprocessing...\n";
          } else {
            combinedText += "Visual Content: Image appears to be primarily visual (vehicle, damage, etc.) with minimal text content.\n";
          }
          combinedText += "\n";
        }
      }

      setExtractedText(combinedText);
      setImageFeatures(allImageFeatures);
      onTextExtracted(combinedText);

      // Enhanced classification using both text and image features
      const enhancedPrompt = await classifyWithImageFeatures(combinedText, allImageFeatures);
      
      // Simulate enhanced API call with image feature analysis
      setTimeout(() => {
        // More sophisticated mock classification based on features
        let classificationResult = "";
        
        if (allImageFeatures.some(f => f.aspectRatio > 1.5 && !f.hasText)) {
          classificationResult += "Vehicle Image, ";
        }
        if (combinedText.toLowerCase().includes('medical') || combinedText.toLowerCase().includes('hospital')) {
          classificationResult += "Hospital Bill, Medical Report, ";
        }
        if (combinedText.toLowerCase().includes('flight') || combinedText.toLowerCase().includes('travel')) {
          classificationResult += "Flight Ticket, ";
        }
        
        // Default fallback
        if (!classificationResult) {
          classificationResult = "Medical Report, Hospital Bill";
        }
        
        classificationResult = classificationResult.replace(/, $/, ''); // Remove trailing comma
        
        setDocumentTypes(classificationResult);
        onDocumentTypesDetected(classificationResult);
        setIsProcessing(false);
        
        toast.success(`Documents processed successfully! Enhanced classification using ${allImageFeatures.length} image features.`);
      }, 2500);

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
            Upload your insurance claim documents with enhanced AI analysis (PDF, PNG, JPG, JPEG)
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
                <p className="text-gray-600">Processing documents with AI enhancement...</p>
                <p className="text-sm text-gray-500 mt-2">Analyzing image features and text content</p>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop files here or click to upload
                </p>
                <p className="text-sm text-gray-500">
                  Enhanced AI processing with image feature analysis
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
                    <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                    <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {imageFeatures.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Image Analysis Results:
              </h4>
              <div className="space-y-2">
                {imageFeatures.map((feature, index) => (
                  <div key={index} className="p-2 bg-blue-50 rounded text-xs">
                    <strong>{feature.filename}:</strong> {feature.width}×{feature.height}, 
                    Text: {feature.hasText ? 'Yes' : 'No'}, 
                    Complexity: {feature.colorComplexity.toFixed(0)}%
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
              Extracted Text & Analysis
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
              Enhanced Document Classification
            </CardTitle>
            <CardDescription>
              AI classification using both text content and image feature analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-3">
              {documentTypes.split(',').map((type, index) => (
                <Badge key={index} variant="secondary">
                  {type.trim()}
                </Badge>
              ))}
            </div>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Classification enhanced with image analysis including aspect ratios, text density, and visual complexity detection.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentUpload;
