import { useState } from "react";
import { API_KEY, OPENROUTER_API_URL, DEFAULT_MODEL } from "./consts";

function Home() {
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    company: "",
    interests: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generatePrompt = () => {
    return `
You are an expert AI Travel Planner.

Create a professional and realistic travel plan.

Traveler Information:
Destination: ${formData.destination}
Number of Days: ${formData.days}
Traveling With: ${formData.company}
Interests: ${formData.interests}

Requirements:

1. Brief introduction about the destination.
2. Expected weather conditions.
3. Best transportation options.
4. Estimated daily budget.
5. Best hotels or accommodation suggestions.
6. Famous foods to try.
7. Safety tips.
8. Day-by-day itinerary.

For each day include:

Morning:
Afternoon:
Evening:
Night:

Also include:
- Hidden gems
- Local travel tips
- Budget saving recommendations

Format the response professionally using headings and bullet points.
`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setResult("");

    if (!API_KEY) {
      setResult("API key not configured. Please set VITE_OPENROUTER_API_KEY in .env file.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "Smart Visiting System",
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are a world-class travel planner who creates detailed travel itineraries.",
            },
            {
              role: "user",
              content: generatePrompt(),
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        setResult(content);
      } else {
        throw new Error("No response content received");
      }
    } catch (error) {
      console.error(error);
      setResult(`❌ Failed to generate travel plan: ${error.message}`);
    }

    setLoading(false);
  };

return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
           Smart Visiting System
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-4"
        >
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={formData.destination}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600"
          />

          <input
            type="number"
            name="days"
            placeholder="Number of Days"
            value={formData.days}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600"
          />

          <select
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600"
          >
            <option value="">Select Company</option>
            <option value="Solo">Solo</option>
            <option value="Friends">Friends</option>
            <option value="Family">Family</option>
            <option value="Couple">Couple</option>
          </select>

          <input
            type="text"
            name="interests"
            placeholder="Food, Adventure, History..."
            value={formData.interests}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold"
          >
            {loading
              ? "Generating Smart Trip..."
              : "Generate Smart Trip"}
          </button>
        </form>

        {result && (
          <div className="mt-8 bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">
              📍 Your Smart Travel Plan
            </h2>

            <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;