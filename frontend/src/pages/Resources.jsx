import React, { useState } from "react";

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedResource, setSelectedResource] = useState(null);

  const resources = [
    {
      id: 1,
      category: "stress",
      title: "Managing Exam Stress",
      description: "7 proven techniques to stay calm during exams",
      emoji: "📚",
      details: "1. Practice deep breathing exercises\n2. Break study sessions into 45-min chunks\n3. Exercise for 20 minutes daily\n4. Get 7-8 hours of sleep\n5. Talk to friends about your concerns\n6. Use time management tools\n7. Remember: exams don't define you"
    },
    {
      id: 2,
      category: "sleep",
      title: "Better Sleep Habits",
      description: "Create a bedtime routine for quality sleep",
      emoji: "😴",
      details: "• Keep a consistent sleep schedule (same time every day)\n• Avoid screens 1 hour before bed\n• Keep bedroom cool and dark\n• Avoid caffeine after 3 PM\n• Try relaxing music or white noise\n• Exercise during the day\n• Use your bed only for sleep"
    },
    {
      id: 3,
      category: "anxiety",
      title: "Anxiety Management",
      description: "Quick techniques to reduce anxiety attacks",
      emoji: "🧠",
      details: "Quick Techniques:\n• 5-4-3-2-1 Grounding: Notice 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste\n• Box Breathing: Breathe in for 4, hold 4, out for 4, hold 4\n• Progressive Muscle Relaxation: Tense and release each muscle group\n• Journaling: Write down your worries\n• Talk to someone you trust"
    },
    {
      id: 4,
      category: "mindfulness",
      title: "5-Minute Meditation",
      description: "Simple meditation for beginners",
      emoji: "🧘",
      details: "Beginner's Meditation:\n1. Sit in a comfortable position\n2. Close your eyes and breathe naturally\n3. Focus on your breath (in and out)\n4. When your mind wanders, gently return focus to breath\n5. Don't judge yourself\n6. Start with 5 minutes, gradually increase\n\nConsistency is key - meditate daily!"
    },
    {
      id: 5,
      category: "stress",
      title: "Time Management",
      description: "Balance studies, activities, and rest",
      emoji: "⏰",
      details: "Time Management Tips:\n• Use the Pomodoro Technique (25 min work + 5 min break)\n• Create a weekly schedule\n• Prioritize: Important & Urgent → Important & Not Urgent → Not Important\n• Learn to say 'no' to extra commitments\n• Block time for leisure and rest\n• Use apps like Todoist or Notion\n• Review and adjust weekly"
    },
    {
      id: 6,
      category: "mood",
      title: "Boost Your Mood",
      description: "Activities that improve mental health",
      emoji: "😊",
      details: "Mood-Boosting Activities:\n• Exercise for 30 minutes (releases endorphins)\n• Spend time with friends/family\n• Get sunlight exposure (10-20 minutes daily)\n• Listen to your favorite music\n• Practice gratitude (write 3 things daily)\n• Help others (volunteering)\n• Try new hobbies and activities\n• Eat nutritious foods\n• Limit social media scrolling"
    }
  ];

  const filtered = selectedCategory === "all" 
    ? resources 
    : resources.filter(r => r.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-teal-900 to-black p-6">
      <h1 className="text-4xl font-bold text-white mb-8">💡 Wellness Resources</h1>

      <div className="max-w-5xl mx-auto">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["all", "stress", "sleep", "anxiety", "mindfulness", "mood"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                selectedCategory === cat
                  ? "bg-teal-600 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filtered.map((resource) => (
            <div
              key={resource.id}
              className="bg-zinc-800 rounded-2xl p-6 text-white hover:bg-zinc-700 transition transform hover:scale-105 cursor-pointer"
            >
              <p className="text-5xl mb-4">{resource.emoji}</p>
              <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
              <p className="text-zinc-400 text-sm">{resource.description}</p>
              <button 
                onClick={() => setSelectedResource(resource)}
                className="mt-4 bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Learn More →
              </button>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="bg-zinc-800 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">💚 Daily Wellness Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-700 rounded-lg p-4">
              <p className="font-bold mb-2">🌅 Morning Routine</p>
              <p className="text-sm text-zinc-300">Start with 5 minutes of meditation or journaling</p>
            </div>
            <div className="bg-zinc-700 rounded-lg p-4">
              <p className="font-bold mb-2">🚶 Take Breaks</p>
              <p className="text-sm text-zinc-300">Every 45 minutes, take a 5-minute walk</p>
            </div>
            <div className="bg-zinc-700 rounded-lg p-4">
              <p className="font-bold mb-2">💧 Stay Hydrated</p>
              <p className="text-sm text-zinc-300">Drink 8 glasses of water daily</p>
            </div>
            <div className="bg-zinc-700 rounded-lg p-4">
              <p className="font-bold mb-2">🌙 Sleep Schedule</p>
              <p className="text-sm text-zinc-300">Go to bed at same time every day</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedResource && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedResource(null)}
        >
          <div 
            className="bg-zinc-800 rounded-2xl p-8 text-white max-w-2xl w-full max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <p className="text-5xl">{selectedResource.emoji}</p>
              <h2 className="text-3xl font-bold">{selectedResource.title}</h2>
            </div>
            <p className="text-zinc-400 mb-6">{selectedResource.description}</p>
            <div className="bg-zinc-700 rounded-lg p-4 mb-6 whitespace-pre-line text-sm leading-relaxed">
              {selectedResource.details}
            </div>
            <button
              onClick={() => setSelectedResource(null)}
              className="bg-teal-600 hover:bg-teal-700 px-6 py-2 rounded-lg font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
