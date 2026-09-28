import React, { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/entries";

const DEFAULT_MOODS = [
  { label: "Serene", emoji: "🌿", bg: "#e2ece9", text: "#2c5d52", border: "#a3c4bc" },
  { label: "Reflective", emoji: "☕", bg: "#f3ebe2", text: "#6b4f3b", border: "#d0b8ac" },
  { label: "Joyful", emoji: "✨", bg: "#fef3d6", text: "#8c6d1f", border: "#e8cf8c" },
  { label: "Focus", emoji: "🎯", bg: "#e0e7df", text: "#39513d", border: "#a1bca3" },
  { label: "Frustrated", emoji: "😤", bg: "#f9e4dd", text: "#8c3b2b", border: "#e0a396" },
  { label: "Stressed", emoji: "🤯", bg: "#f4e3eb", text: "#7a3e5c", border: "#cfa6bc" },
];

function App() {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");
  const [selectedMood, setSelectedMood] = useState(DEFAULT_MOODS[0].label);
  const [customMood, setCustomMood] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [tags, setTags] = useState("");
  const [activeTab, setActiveTab] = useState("editor");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (Array.isArray(data)) setEntries(data);
    } catch (error) {
      console.error("Error loading entries:", error);
    }
  };

  const handleMoodSelect = (label) => {
    if (label === "Other") {
      setIsOtherSelected(true);
      setSelectedMood(customMood || "Custom");
    } else {
      setIsOtherSelected(false);
      setSelectedMood(label);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const finalMood = isOtherSelected ? (customMood.trim() || "Custom") : selectedMood;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mood: finalMood, tags }),
      });

      if (response.ok) {
        const savedEntry = await response.json();
        setEntries([savedEntry, ...entries]);
        setText("");
        setTags("");
        setCustomMood("");
        setIsOtherSelected(false);
        setSelectedMood(DEFAULT_MOODS[0].label);
        setActiveTab("logs");
      }
    } catch (error) {
      console.error("Error saving entry:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEntries(entries.filter((entry) => entry._id !== id));
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const filteredEntries = entries.filter(
    (e) =>
      e.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.tags?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.mood?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="earthy-app-shell">
      <div className="serene-card">
        {/* Header */}
        <header className="serene-header">
          <div className="brand-group">
            <span className="diary-logo-icon">📔</span>
            <div>
              <h1 className="brand-title">Mindscape</h1>
              <p className="brand-subtitle">PERSONAL MOOD JOURNAL</p>
            </div>
          </div>

          <nav className="serene-nav-tabs">
            <button
              className={`nav-btn ${activeTab === "editor" ? "active" : ""}`}
              onClick={() => setActiveTab("editor")}
            >
              ✍️ Write
            </button>
            <button
              className={`nav-btn ${activeTab === "logs" ? "active" : ""}`}
              onClick={() => setActiveTab("logs")}
            >
              📖 Entries
              {entries.length > 0 && (
                <span className="serene-badge">{entries.length}</span>
              )}
            </button>
          </nav>
        </header>

        {/* Tab 1: Editor View */}
        {activeTab === "editor" && (
          <form className="editor-container" onSubmit={handleSave}>
            <div className="form-section">
              <label className="form-label">How are you feeling?</label>
              <div className="mood-chips-grid">
                {DEFAULT_MOODS.map((m) => {
                  const isSelected = !isOtherSelected && selectedMood === m.label;
                  return (
                    <button
                      key={m.label}
                      type="button"
                      className={`mood-card-btn ${isSelected ? "selected" : ""}`}
                      style={{
                        backgroundColor: m.bg,
                        color: m.text,
                        borderColor: isSelected ? m.text : m.border,
                      }}
                      onClick={() => handleMoodSelect(m.label)}
                    >
                      <span className="mood-emoji">{m.emoji}</span>
                      <span className="mood-name">{m.label}</span>
                    </button>
                  );
                })}

                {/* Custom 'Other' Option */}
                <button
                  type="button"
                  className={`mood-card-btn ${isOtherSelected ? "selected" : ""}`}
                  style={{
                    backgroundColor: "#f5f2eb",
                    color: "#5c5549",
                    borderColor: isOtherSelected ? "#8c7a6b" : "#d8d0c5",
                  }}
                  onClick={() => handleMoodSelect("Other")}
                >
                  <span className="mood-emoji">✏️</span>
                  <span className="mood-name">Other</span>
                </button>
              </div>

              {/* Custom Mood Text Field */}
              {isOtherSelected && (
                <div className="custom-mood-input-wrapper">
                  <input
                    type="text"
                    className="serene-input custom-mood-input"
                    placeholder="Type your current vibe (e.g. Overwhelmed, Peaceful, Nostalgic)..."
                    value={customMood}
                    onChange={(e) => {
                      setCustomMood(e.target.value);
                      setSelectedMood(e.target.value || "Custom");
                    }}
                    autoFocus
                  />
                </div>
              )}
            </div>

            <div className="form-section">
              <label className="form-label">Dear Diary...</label>
              <textarea
                className="serene-textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write your thoughts..."
                rows="6"
              />
            </div>

            <div className="form-section">
              <label className="form-label">Tags (Optional)</label>
              <input
                type="text"
                className="serene-input"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. #thoughts, #work, #meditation"
              />
            </div>

            <button type="submit" className="serene-submit-btn">
              Save Entry
            </button>
          </form>
        )}

        {/* Tab 2: Journal Entries */}
        {activeTab === "logs" && (
          <div className="logs-container">
            <div className="search-wrapper">
              <input
                type="text"
                className="serene-input search-input"
                placeholder="🔍 Search entries, moods, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="serene-stream">
              {filteredEntries.length === 0 ? (
                <div className="empty-state-card">
                  <span style={{ fontSize: "2.2rem" }}>🍂</span>
                  <p>No journal entries found.</p>
                </div>
              ) : (
                filteredEntries.map((entry) => {
                  const matchedMood = DEFAULT_MOODS.find((m) => m.label === entry.mood);
                  const badgeBg = matchedMood ? matchedMood.bg : "#f5f2eb";
                  const badgeText = matchedMood ? matchedMood.text : "#5c5549";
                  const badgeEmoji = matchedMood ? matchedMood.emoji : "✍️";

                  return (
                    <div key={entry._id} className="serene-entry-card">
                      <div className="entry-header">
                        <div
                          className="entry-mood-badge"
                          style={{ backgroundColor: badgeBg, color: badgeText }}
                        >
                          {badgeEmoji} {entry.mood}
                        </div>
                        <span className="entry-timestamp">
                          {new Date(entry.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <button
                          className="trash-btn"
                          onClick={() => handleDelete(entry._id)}
                          title="Delete entry"
                        >
                          🗑️
                        </button>
                      </div>

                      <p className="entry-body-text">{entry.text}</p>

                      {entry.tags && (
                        <div className="entry-tags-flex">
                          {entry.tags.split(" ").map((tag, idx) => (
                            <span key={idx} className="serene-tag">
                              {tag.startsWith("#") ? tag : `#${tag}`}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;