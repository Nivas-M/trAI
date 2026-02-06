"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState([]);

  const onSubmit = async () => {
    const res = await fetch("/api/plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    }); //sent data called input

    const data = await res.json(); //receiving the response from the backend and parsing it as JSON
    console.log(data.reasoning);
    setResult(data.results);
  };

  return (
    <div>
      <input
        type="text"
        className="bg-amber-200 w-full mt-10"
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe your journey..."
      ></input>

      <button className="bg-amber-400 w-full mt-5" onClick={onSubmit}>
        Submit
      </button>

      <div className="bg-amber-300 w-full mt-5">
        {result.map((item, index) => (
          <div key={index} className="p-2 border-b">
            <p>Train: {item.train}</p>
            <p>Time: {item.time}</p>
            <p>Status: {item.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
