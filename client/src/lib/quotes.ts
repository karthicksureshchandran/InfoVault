export const inspirationalQuotes = [
  {
    text: "Knowledge is power, but organization is the key to unlocking it.",
    author: "InfoVault"
  },
  {
    text: "The best time to organize your information was 20 years ago. The second best time is now.",
    author: "InfoVault"
  },
  {
    text: "A place for everything, and everything in its place.",
    author: "Benjamin Franklin"
  },
  {
    text: "Organization isn't about perfection; it's about efficiency.",
    author: "InfoVault"
  },
  {
    text: "The power of organization is the foundation of all success.",
    author: "InfoVault"
  },
  {
    text: "Clutter is nothing more than postponed decisions.",
    author: "Barbara Hemphill"
  },
  {
    text: "Being organized is a skill that can be developed.",
    author: "InfoVault"
  },
  {
    text: "Order is the foundation of all things.",
    author: "Edmund Burke"
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "Productivity is never an accident. It is always the result of planning and organization.",
    author: "InfoVault"
  }
];

export function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
  return inspirationalQuotes[randomIndex];
}
