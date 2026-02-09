export default function ResultCard({ journey, reason}) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold">{journey.train}</h3>

      <div className="text-sm text-gray-600 mt-1 flex gap-3">
        <span>{journey.durationHours} hrs</span>
        <span>₹{journey.price}</span>
        <span>{journey.comfort}</span>
      </div>

      <div className="mt-3 bg-gray-100 p-2 rounded text-sm">
        <strong>Why this option?</strong>
        <p>{reason}</p>
      </div>
    </div>
  );
}
