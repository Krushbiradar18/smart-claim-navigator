
# Insurance Claim Assistant

## 📁 Project Info

This is a GenAI-powered Insurance Claim Assistant that helps users:

- Upload and process insurance-related documents (PDFs, images)
- Automatically extract and classify documents
- Generate formal insurance claim letters
- Estimate claim amounts
- Interact with a claim-related chatbot

🔗 **Live App**: [https://insurance-claim-assistance-2695tjctqvcmnej4dnt5hi.streamlit.app/](https://insurance-claim-assistance-2695tjctqvcmnej4dnt5hi.streamlit.app/)

---

## 💻 Tech Stack

| Technology     | Purpose |
|----------------|---------|
| **Streamlit**  | UI, frontend, and deployment |
| **Python**     | Backend logic |
| **Cohere API** | GenAI for document classification, claim letter writing, estimation, and chatbot |
| **PyPDF2**     | PDF reading and text extraction |
| **pytesseract**| OCR for image-based documents |
| **Pillow (PIL)** | Image processing |
| **fpdf**       | Generate downloadable claim letters as PDF |
| **dotenv**     | Secure handling of API keys via `.env` |

---

## 🚀 Running Locally

### Prerequisites

- Python 3.10+
- `pip`
- `.env` file with your Cohere API key

```env
COHERE_API_KEY=your_actual_key_here

Steps

# 1. Clone the repository
git clone <your-repo-url>
cd insurance-claim-assistant

# 2. (Optional) Create and activate virtual environment
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate

# 3. Install required packages
pip install -r requirements.txt

# 4. Run the Streamlit app
streamlit run insurance_claim_assistant.py


⸻

🛠️ Features (Built)
	•	Document uploader (PDF and image)
	•	OCR + PDF text extraction
	•	Smart document type classification using GenAI
	•	Guided form to auto-generate a formal claim letter
	•	Insurance chatbot trained with context
	•	Claim amount estimator with GenAI
	•	PDF download of the claim letter

⸻

🚧 Remaining Work / Future Enhancements
	•	Auto-fill claim application forms
	•	Add email sending functionality for claim letters
	•	UI/UX improvements and responsive design
	•	Enhance document type classification using Vision Models
	•	Add agent-to-agent workflows (approval bot, fraud-check agent)

⸻

