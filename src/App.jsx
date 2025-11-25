import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import "./index.css";
import { encode, decode } from "@toon-format/toon";

// Token counter (simple approximation)
class TokenCounter {
  static count(text) {
    // Rough approximation: ~4 characters per token
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

function App() {
  const [inputMode, setInputMode] = useState("json"); // 'json' or 'toon'
  const [inputValue, setInputValue] = useState(
    '{\n  "name": "John",\n  "age": 30\n}'
  );
  const [outputValue, setOutputValue] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);

  const handleConvert = () => {
    setError("");
    try {
      if (inputMode === "json") {
        // JSON to TOON
        const jsonObj = JSON.parse(inputValue);
        const toonOutput = encode(jsonObj);
        setOutputValue(toonOutput);
        const savings = TokenCounter.calculateSavings(inputValue, toonOutput);
        setStats(savings);
      } else {
        // TOON to JSON
        const jsonObj = decode(inputValue);
        const jsonOutput = JSON.stringify(jsonObj, null, 2);
        setOutputValue(jsonOutput);
        const savings = TokenCounter.calculateSavings(jsonOutput, inputValue);
        setStats(savings);
      }
    } catch (err) {
      setError(err.message || "Conversion failed");
      setOutputValue("");
      setStats(null);
    }
  };

  const handleSwap = () => {
    setInputMode(inputMode === "json" ? "toon" : "json");
    setInputValue(outputValue || inputValue);
    setOutputValue("");
    setStats(null);
    setError("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputValue);
  };

  const handleDownload = () => {
    const blob = new Blob([outputValue], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = inputMode === "json" ? "output.toon" : "output.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          JSON ⇄ TOON Converter
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Input ({inputMode.toUpperCase()})
              </h2>
              <button
                onClick={handleSwap}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
              >
                Swap ⇄
              </button>
            </div>
            <Editor
              height="400px"
              language={inputMode}
              theme="vs-dark"
              value={inputValue}
              onChange={(value) => setInputValue(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
              }}
            />
          </div>

          {/* Output Panel */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Output ({inputMode === "json" ? "TOON" : "JSON"})
              </h2>
              <div className="space-x-2">
                <button
                  onClick={handleCopy}
                  disabled={!outputValue}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
                >
                  Copy
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!outputValue}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50"
                >
                  Download
                </button>
              </div>
            </div>
            <Editor
              height="400px"
              language={inputMode === "json" ? "plaintext" : "json"}
              theme="vs-dark"
              value={outputValue}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
              }}
            />
          </div>
        </div>

        {/* Convert Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleConvert}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-lg font-semibold"
          >
            Convert {inputMode.toUpperCase()} →{" "}
            {inputMode === "json" ? "TOON" : "JSON"}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-900 border border-red-700 rounded-lg">
            <p className="text-red-200">❌ {error}</p>
          </div>
        )}

        {/* Stats Display */}
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
      </div>
    </div>
  );
}

export default App;
