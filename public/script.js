const generateBtn = document.getElementById("generateBtn");
const promptInput = document.getElementById("prompt");
const output = document.getElementById("output");
const recentList = document.getElementById("recent");
const storyTypeSelect = document.getElementById("storyType");


let sessionDreams = [];

// Words to detect story length
const lengthWords = {
  short: 100,
  medium: 300,
  long: 600,
  little: 100,
  big: 600,
};

// Fetch shared dreams and combine with session dreams
async function fetchSharedDreams() {
  try {
    const res = await fetch("/api/stories");
    const dreams = await res.json();

    if (!Array.isArray(dreams)) return;

    const allDreams = [...sessionDreams, ...dreams];

    recentList.innerHTML = allDreams
      .map(d => `<li><strong>${d.prompt}:</strong> ${d.story}</li>`)
      .join("");
  } catch (err) {
    console.error(err);
    recentList.innerHTML = "<li>Failed to load dreams.</li>";
  }
}

// Generate story
generateBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();

  const selectedType = storyTypeSelect.value;

  if (!prompt) return alert("Please enter a prompt!");

  let finalPrompt = prompt;
  if (selectedType) {
    const typeText = selectedType.charAt(0).toUpperCase() + selectedType.slice(1);
    finalPrompt = `${typeText} story: ${prompt}`;
  }

  // Detect story length
  const lowerPrompt = prompt.toLowerCase();
  let maxWords = 300; // default medium
  for (const word in lengthWords) {
    if (lowerPrompt.includes(word)) {
      maxWords = lengthWords[word];
      break;
    }
  }

  output.classList.remove("hidden");
  output.textContent = "Generating dream... 🧠";


  try {
    const res = await fetch("/api/story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: finalPrompt, maxWords }),
    });

    const data = await res.json();
    if (data.error) {
      output.textContent = "Error: " + data.error;
    } else {
      // ✅ Show generated story in output
      output.classList.remove("hidden");
      output.textContent = data.story;

      // Save to session only
      sessionDreams.unshift({ prompt: finalPrompt, story: data.story });

      fetchSharedDreams();
      promptInput.value = "";
      storyTypeSelect.value = "";
    }
  } catch (err) {
    console.error(err);
    output.textContent = "Error generating story.";
  }
});

// Load dreams on page load
fetchSharedDreams();
