import React, { useState } from "react";

function App() {
  const [topic, setTopic] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [refinedPrompt, setRefinedPrompt] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [approvedPrompt, setApprovedPrompt] = useState("");
  const [generatedEssay, setGeneratedEssay] = useState("");
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [loadingEssay, setLoadingEssay] = useState(false);

  // Function to fetch the refined prompt
  const fetchPrompt = async () => {
    setLoadingPrompt(true);
    setGeneratedEssay(""); // Clear previous essay
    try {
      const response = await fetch("http://localhost:2302/generate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic,
          keyPoints: keyPoints,
        }),
      });

      const data = await response.json();
      setRefinedPrompt(data.refinedPrompt);
    } catch (error) {
      console.error("Error fetching prompt:", error);
    }
    setLoadingPrompt(false);
  };

  // Function to fetch the essay after prompt approval
  const fetchEssay = async () => {
    if (!refinedPrompt) {
      alert("Please generate a prompt first!");
      return;
    }

    setLoadingEssay(true);
    setGeneratedEssay(""); // Clear previous essay output

    try {
      const response = await fetch("http://localhost:2302/generate-essay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: refinedPrompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedEssay(data.essay);
      } else {
        console.error("Error generating essay:", data.message);
        alert("Failed to generate essay. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error! Make sure the backend is running.");
    }

    setLoadingEssay(false);
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        color: "#fff",
        backgroundColor: "#111",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "orange" }}>UPSC AI Essay Generator 🚀</h1>

      {/* Topic Input */}
      <input
        type="text"
        placeholder="Enter Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{
          width: "300px",
          padding: "10px",
          margin: "10px",
          fontSize: "16px",
        }}
      />

      {/* Key Points Input */}
      <textarea
        placeholder="Enter key points (one per line)"
        value={keyPoints}
        onChange={(e) => setKeyPoints(e.target.value)}
        style={{
          width: "300px",
          height: "100px",
          padding: "10px",
          fontSize: "16px",
        }}
      />

      {/* Generate Prompt Button */}
      <br />
      <button
        onClick={fetchPrompt}
        style={{
          padding: "10px 20px",
          backgroundColor: "orange",
          fontSize: "16px",
        }}
      >
        {loadingPrompt ? "Generating Prompt..." : "Generate Prompt"}
      </button>

      {/* Display the Refined Prompt */}
      {refinedPrompt && (
        <div
          style={{
            marginTop: "20px",
            textAlign: "left",
            backgroundColor: "#222",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <h3>Refined Prompt:</h3>
          <p>{refinedPrompt}</p>

          {/* Approve and Generate Essay Button */}
          <button
            onClick={fetchEssay}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "orange",
              fontSize: "16px",
            }}
          >
            {loadingEssay ? "Generating Essay..." : "Generate Essay"}
          </button>
        </div>
      )}

      {/* Display the Generated Essay */}
      {generatedEssay && (
        <div
          style={{
            marginTop: "20px",
            textAlign: "left",
            backgroundColor: "#222",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <h3>Generated Essay:</h3>
          <p>{generatedEssay}</p>
        </div>
      )}
    </div>
  );
}

export default App;
