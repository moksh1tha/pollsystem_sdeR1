import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface PollCreatorProps {
  onCreatePoll: (pollData: any) => void;
  onCancel: () => void;
}

const PollCreator: React.FC<PollCreatorProps> = ({ onCreatePoll, onCancel }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timeLimit, setTimeLimit] = useState(60);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && options.every(opt => opt.trim())) {
      onCreatePoll({
        id: Date.now(),
        question: question.trim(),
        options: options.map(opt => opt.trim()),
        timeLimit
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter your question
        </label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Rahul Bajaj"
          required
        />
        <div className="text-right text-sm text-gray-500 mt-1">
          0/100
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Poll Options
        </label>
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex-1 flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full flex-shrink-0"></div>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={`Option ${index + 1}`}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Is it Correct?</span>
                <div className="flex space-x-2">
                  <label className="flex items-center">
                    <input type="radio" name={`correct-${index}`} className="text-purple-500" />
                    <span className="ml-1 text-sm">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name={`correct-${index}`} className="text-purple-500" defaultChecked />
                    <span className="ml-1 text-sm">No</span>
                  </label>
                </div>
              </div>
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        
        <button
          type="button"
          onClick={handleAddOption}
          className="mt-2 flex items-center space-x-2 text-purple-500 hover:text-purple-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add More options</span>
        </button>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-shadow"
        >
          Ask Question
        </button>
      </div>
    </form>
  );
};

export default PollCreator;