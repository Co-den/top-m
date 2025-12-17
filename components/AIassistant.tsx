// src/components/AIassistant.tsx
import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface Plan {
  _id?: string;
  id?: string;
  name: string;
  price?: number;
  description?: string;
  cycleDays?: string | number;
  dailyReturn?: string | number;
  totalReturn?: string | number;
  [key: string]: any;
}

interface HistoryItem {
  q: string;
  a: string;
  timestamp: number;
}

interface AIAssistantProps {
  plan: Plan | Plan[] | Record<string, any>;
  initialQuestion?: string;
  onClose?: () => void;
}

const AIAssistant = ({
  plan,
  initialQuestion = "",
  onClose,
}: AIAssistantProps) => {
  const [question, setQuestion] = useState<string>(initialQuestion);
  const [loading, setLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const askAI = async (q: string) => {
    if (!q.trim()) return;

    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const res = await axios.post(
        "https://top-mart-api.onrender.com/api/ai/ask",
        {
          question: q,
          planData: plan,
        }
      );
      const text = res.data.answer || "No answer.";
      setAnswer(text);
      setHistory((h) => [{ q, a: text, timestamp: Date.now() }, ...h]);
    } catch (err: any) {
      console.error(err);
      setError("Sorry — something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim()) return;
    askAI(question);
  };

  const quickAsk = (q: string) => {
    setQuestion(q);
    askAI(q);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-2xl p-4 sm:p-6 bg-white rounded-lg shadow-xl text-black"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-green-700">
            Ask AI about this product
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Get instant answers to your questions
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close AI assistant"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="relative">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Is this suitable for broilers?"
            aria-label="Ask a question"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500"
          />

          {question && (
            <button
              type="button"
              onClick={() => setQuestion("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear input"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <button
            type="submit"
            disabled={loading || !question.trim()}
            aria-busy={loading}
            className="w-full sm:w-auto bg-green-600 text-white px-6 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 active:scale-95 transition-all duration-200 font-medium text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Thinking...
              </span>
            ) : (
              "Ask AI"
            )}
          </button>
          <button
            type="button"
            className={`
    w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg
    hover:bg-gray-50 active:scale-95 transition-all duration-200
    font-medium text-sm
  `}
            onClick={() => {
              setQuestion("");
              setAnswer("");
              setError("");
            }}
          >
            Reset
          </button>
        </div>
      </form>

      {/* Quick Questions */}
      <div className="mb-4">
        <p className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">
          Quick questions:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "Is this product in stock?",
            "What's the delivery time?",
            "Is there a discount on bulk orders?",
          ].map((q) => (
            <button
              key={q}
              onClick={() => quickAsk(q)}
              disabled={loading}
              className="text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Results Area */}
      <div className="border-t pt-4 min-h-[100px]">
        <AnimatePresence mode="wait">
          {/* Loading State */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm text-gray-500"
            >
              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              AI is typing…
            </motion.div>
          )}

          {/* Error State */}
          {!loading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm"
            >
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          {/* Answer */}
          {!loading && answer && !error && (
            <motion.div
              key="answer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200"
            >
              <div className="flex items-start gap-2 mb-2">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                </div>
                <strong className="text-sm font-semibold text-green-700">
                  AI Assistant
                </strong>
              </div>
              <p className="text-sm leading-relaxed text-gray-800 ml-8">
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <h4 className="text-sm font-semibold mb-2 text-gray-700">
              Recent Questions
            </h4>
            <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {history.map((h, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="text-xs text-gray-500 font-medium mb-1">
                    Q: {h.q}
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    A: {h.a}
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </motion.div>
  );
};

export default AIAssistant;
