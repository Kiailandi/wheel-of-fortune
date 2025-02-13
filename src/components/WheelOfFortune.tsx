import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Wheel } from 'react-custom-roulette';
import confetti from 'canvas-confetti';

export default function WheelOfFortune() {
  const [options, setOptions] = useState<string[]>(() => {
    const saved = localStorage.getItem('wheelOptions');
    return saved ? JSON.parse(saved) : ['Option 1', 'Option 2', 'Option 3'];
  });
  const [newOption, setNewOption] = useState('');
  const [winner, setWinner] = useState<string | null>(null);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  useEffect(() => {
    localStorage.setItem('wheelOptions', JSON.stringify(options));
  }, [options]);

  const handleAddOption = () => {
    const trimmedOption = newOption.trim();
    if (trimmedOption && !options.includes(trimmedOption)) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    } else if (options.includes(trimmedOption)) {
      alert('This option already exists!');
    }
  };

  const getColor = (index: number) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
      '#D4A5A5', '#9B59B6', '#3498DB', '#1ABC9C', '#F1C40F',
      '#E74C3C', '#2ECC71', '#E67E22', '#9B4F96', '#F39C12',
      '#8E44AD', '#16A085', '#D35400', '#C0392B', '#27AE60',
      '#7F8C8D', '#2C3E50', '#E84393', '#6C5CE7', '#00B894'
    ];
    return colors[index % colors.length];
  };

  const handleSpinClick = () => {
    if (!mustSpin && options.length > 0) {
      const newPrizeNumber = Math.floor(Math.random() * options.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
      setWinner(null);
    }
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    setWinner(options[prizeNumber]);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const data = options.map(option => ({ option }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-12">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Wheel of Fortune
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            {/* Color Legend */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Options</h2>
              {options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded"
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getColor(index) }}
                  />
                  <span className="flex-1">{option}</span>
                  <button
                    onClick={() => setOptions(options.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700"
                    disabled={mustSpin}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Input Section */}
            <div className="flex gap-3 mb-8">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                placeholder="Add new option"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={mustSpin}
              />
              <button
                onClick={handleAddOption}
                className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:bg-gray-300"
                disabled={mustSpin}
              >
                <Plus size={24} />
              </button>
            </div>

            {/* Spin Button */}
            <button
              onClick={handleSpinClick}
              disabled={mustSpin || options.length === 0}
              className={`w-full py-3 rounded-lg text-white text-lg font-semibold transition-colors ${mustSpin || options.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
              {mustSpin ? 'Spinning...' : 'Spin the Wheel!'}
            </button>

            {/* Winner Display */}
            {winner && !mustSpin && (
              <div className="mt-8 p-6 bg-green-50 rounded-lg text-center">
                <h2 className="text-xl font-semibold mb-2">🎉 Winner! 🎉</h2>
                <p className="text-2xl text-green-600 font-bold">{winner}</p>
              </div>
            )}
          </div>

          {/* Wheel Section */}
          <div className="relative aspect-square flex items-center justify-center p-4">
            <div className="w-full">
              {options.length > 0 ? (
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeNumber}
                  data={data}
                  backgroundColors={options.map((_, i) => getColor(i))}
                  textColors={['white']}
                  outerBorderColor="#1a1a1a"
                  outerBorderWidth={3}
                  innerRadius={0}
                  radiusLineColor="#1a1a1a"
                  radiusLineWidth={1}
                  fontSize={16}
                  onStopSpinning={handleStopSpinning}
                />
              ) : (
                <div className="w-full h-full rounded-full border-4 border-gray-300 flex items-center justify-center bg-gray-50">
                  <p className="text-xl text-gray-500 font-medium text-center px-8">
                    Add some options to start spinning!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}