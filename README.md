# AI Cohort Examiner & Steer Challenge Simulator

An interactive, AI-powered technical evaluation engine and interview simulator built for assessing candidates across a **31-Day Advanced GenAI & AI Engineering Cohort Curriculum**. Powered by **Gemini 3.6 Flash**, this application conducts multi-turn technical interviews, dynamically adapts to judge steer prompts in real time, and generates deep visual evaluation reports.

---

## 🌟 Key Features

### 1. Steer Challenge Tester (Judges Special)
* **Live Unseen Prompt Ingestion:** Ingests live, unseen requirements from judges (e.g., *"Inject strict latency constraint (<200ms TTFT)"*, *"Require PEP-8 code style"*, *"Enforce FastMCP authorization tokens"*).
* **Real-time Agent Adaptation:** In-flight system prompt alignment and behavior modification without restarting the session.
* **Live Steer Adaptation Feed:** Terminal log displaying how Gemini 3.6 Flash adjusts scoring criteria and question branching in real time.

### 2. Multi-Turn Adaptive AI Technical Interviewer
* **31-Day Curriculum Mapping:** Tailored technical evaluation spanning 31 core topics including RAG, Vector Indexing (HNSW/IVF), FastMCP, Fine-Tuning (LoRA/QLoRA), Agentic Loops, and Guardrails.
* **Adaptive Follow-ups:** Automatically triggers targeted follow-up questions when candidate answers lack depth or mathematical precision.
* **Dual Voice & Text Input:** Real-time speech recognition and text response modes.

### 3. Comprehensive Visual Evaluation Reports
* **7-Topic Cohort Proficiency Spider Chart:** Interactive Recharts Radar visualization comparing candidate mastery across key GenAI disciplines.
* **31-Day Curriculum Knowledge Gap Heatmap:** Grid displaying verified cohort missions, passed competencies, and remaining knowledge gaps across all 31 days.
* **Score Breakdown & Grade Badging:** Detailed technical knowledge, problem-solving, and system design competency metrics.

### 4. Interactive Q&A Deep-Dive Modal
* **Clickable Row Drill-down:** Click any row in the Question Performance Breakdown table to launch an interactive inspection modal.
* **Exact Turn Inspection:** View the exact question asked by the AI agent, the candidate's raw response, Gemini's turn-by-turn feedback, covered vs. missed key points, and suggested benchmark answers.

### 5. Developer Control Panel & Presets
* **1-Click Candidate Presets:** Pre-configured candidate profiles (*High Performer*, *Needs Remediation*, *Edge Case*).
* **10-Second Fast-Forward:** Instant completion option skipping turn-by-turn prompts to test full report generation.
* **Clean State Reset:** Quick button to clear local session memory and restart cleanly.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, TypeScript, Vite
* **Styling:** Tailwind CSS, Lucide Icons
* **Data Visualization:** Recharts (Radar / Spider Charts)
* **AI Engine:** Google Gemini 3.6 Flash API
* **Effects:** Canvas Confetti

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx                 # Top navigation with Steer Panel trigger & theme toggle
│   ├── Dashboard.tsx              # Main candidate selection & cohort overview
│   ├── DeveloperControlPanel.tsx  # Steer Challenge simulator & preset control panel
│   ├── InterviewSessionView.tsx   # Live multi-turn evaluation interface
│   ├── InterviewReportView.tsx    # Visual analytics, Radar chart, Heatmap & Q&A Modal
│   ├── TechSpecModal.tsx          # Technical specifications & architecture details
│   └── AuthModal.tsx              # Candidate & recruiter sign-in modal
├── data/
│   └── candidateProfiles.ts       # Cohort candidate mock profiles
├── types.ts                       # Shared TypeScript definitions
└── App.tsx                        # Root router & application state manager
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18 or higher
* npm / yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate into project directory
cd ai-cohort-examiner

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 📝 License
Distributed under the MIT License.
