import React, { useState, lazy, Suspense } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./index.css";
import { encode, decode } from "@toon-format/toon";

const Editor = lazy(() => import("@monaco-editor/react"));

class TokenCounter {
  static count(text) {
    return Math.ceil(text.length / 4);
  }

  static calculateSavings(jsonText, toonText) {
    const jsonTokens = this.count(jsonText);
    const toonTokens = this.count(toonText);
    const saved = jsonTokens - toonTokens;
    const percentage = ((saved / jsonTokens) * 100).toFixed(1);
    return { jsonTokens, toonTokens, saved, percentage };
  }
}

const EditorSkeleton = () => (
  <div className="h-[400px] bg-gray-700 rounded animate-pulse flex items-center justify-center">
    <p className="text-gray-400">Loading editor...</p>
  </div>
);

function App() {
  const [inputMode, setInputMode] = useState("json");
  const [inputValue, setInputValue] = useState(
    '{\n  "name": "John",\n  "age": 30\n}'
  );
  const [outputValue, setOutputValue] = useState("");
  const [stats, setStats] = useState(null);

  const handleConvert = () => {
    try {
      if (inputMode === "json") {
        const jsonObj = JSON.parse(inputValue);
        const toonOutput = encode(jsonObj);
        setOutputValue(toonOutput);
        const savings = TokenCounter.calculateSavings(inputValue, toonOutput);
        setStats(savings);
        toast.success("Converted to TOON format!");
      } else {
        const jsonObj = decode(inputValue);
        const jsonOutput = JSON.stringify(jsonObj, null, 2);
        setOutputValue(jsonOutput);
        const savings = TokenCounter.calculateSavings(jsonOutput, inputValue);
        setStats(savings);
        toast.success("Converted to JSON format!");
      }
    } catch (err) {
      toast.error(err.message || "Conversion failed");
      setOutputValue("");
      setStats(null);
    }
  };

  const handleSwap = () => {
    setInputMode(inputMode === "json" ? "toon" : "json");
    setInputValue(outputValue || inputValue);
    setOutputValue("");
    setStats(null);
    toast.success("Input and output swapped!");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputValue);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([outputValue], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = inputMode === "json" ? "output.toon" : "output.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-center flex-1">
            JSON ⇄ TOON Converter
          </h1>
          <a
            href="https://github.com/devcom33/json-toon-converter"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            <span>GitHub</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Input ({inputMode.toUpperCase()})
              </h2>
              <button
                onClick={handleSwap}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                Swap ⇄
              </button>
            </div>
            <Suspense fallback={<EditorSkeleton />}>
              <Editor
                height="400px"
                language={inputMode}
                theme="vs-dark"
                value={inputValue}
                onChange={(value) => setInputValue(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                }}
              />
            </Suspense>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Output ({inputMode === "json" ? "TOON" : "JSON"})
              </h2>
              <div className="space-x-2">
                <button
                  onClick={handleCopy}
                  disabled={!outputValue}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50 transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!outputValue}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded disabled:opacity-50 transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
            <Suspense fallback={<EditorSkeleton />}>
              <Editor
                height="400px"
                language={inputMode === "json" ? "plaintext" : "json"}
                theme="vs-dark"
                value={outputValue}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                }}
              />
            </Suspense>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleConvert}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-lg font-semibold transition-colors"
          >
            Convert {inputMode.toUpperCase()} →{" "}
            {inputMode === "json" ? "TOON" : "JSON"}
          </button>
        </div>

        {stats && (
          <div className="mt-6 p-6 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Token Analysis</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400">JSON Tokens</p>
                <p className="text-2xl font-bold">{stats.jsonTokens}</p>
              </div>
              <div>
                <p className="text-gray-400">TOON Tokens</p>
                <p className="text-2xl font-bold">{stats.toonTokens}</p>
              </div>
              <div>
                <p className="text-gray-400">Saved</p>
                <p className="text-2xl font-bold text-green-400">
                  {stats.saved}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Reduction</p>
                <p className="text-2xl font-bold text-green-400">
                  {stats.percentage}%
                </p>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-gray-400">
          <p>
            Made by •{" "}
            <a
              href="https://github.com/devcom33/json-toon-converter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Devcom33
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
