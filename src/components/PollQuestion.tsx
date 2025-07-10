import React, { useState } from 'react';

interface PollQuestionProps {
  poll: {
    question: string;
    options: string[];
  };
  onAnswerSubmit: (optionIndex: number) => void;
  timeLeft: number;
}

const PollQuestion: React.FC<PollQuestionProps> = ({ poll, onAnswerSubmit, timeLeft }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedOption !== null) {
      onAnswerSubmit(selectedOption);
    }
  };

  return (
    <div>
      <div className="bg-gray-800 text-white p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold">{poll.question}</h3>
      </div>

      <div className="space-y-3 mb-6">
        {poll.options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
              selectedOption === index
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="poll-option"
              value={index}
              checked={selectedOption === index}
              onChange={() => setSelectedOption(index)}
              className="hidden"
            />
            <div className={`w-4 h-4 rounded-full border-2 ${
              selectedOption === index
                ? 'bg-purple-500 border-purple-500'
                : 'border-gray-300'
            }`}></div>
            <span className="text-gray-700">{option}</span>
          </label>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={selectedOption === null}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default PollQuestion;