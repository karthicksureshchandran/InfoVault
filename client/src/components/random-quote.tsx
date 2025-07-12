import { useState, useEffect } from "react";
import { getRandomQuote } from "@/lib/quotes";

export default function RandomQuote() {
  const [quote, setQuote] = useState(getRandomQuote());

  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(getRandomQuote());
    }, 30000); // Change quote every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="gradient-bg rounded-lg p-4">
      <p className="text-sm text-slate-700 italic">"{quote.text}"</p>
      <p className="text-xs text-slate-500 mt-2">- {quote.author}</p>
    </div>
  );
}
