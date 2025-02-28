import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./App.css";

const App = () => {
  const [topic, setTopic] = useState("");
  const [essay, setEssay] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEssay = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/generate-essay",
        {
          topic,
        }
      );
      setEssay(response.data.essay);
    } catch (error) {
      console.error("Error fetching essay:", error);
      setEssay("Failed to generate essay. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="title"
      >
        UPSC AI Essay Generator 🚀
      </motion.h1>

      <motion.input
        type="text"
        placeholder="Enter a topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        whileFocus={{ scale: 1.1 }}
        className="input-field"
      />

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="generate-btn"
        onClick={fetchEssay}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Essay"}
      </motion.button>

      {essay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="essay-box"
        >
          <h2>Generated Essay:</h2>
          <p>{essay}</p>
        </motion.div>
      )}
    </div>
  );
};

export default App;
