
import React from 'react';
import { ContentType, JTubeInput } from '../types';

interface InputSectionProps {
  onGenerate: (data: JTubeInput) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isLoading }) => {
  const [formData, setFormData] = React.useState<JTubeInput>({
    gameTitle: '',
    contentType: ContentType.Gameplay,
    gameGenre: '',
    gameLink: '',
    donationLink: '',
    language: 'English',
    targetRegion: 'Global',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <i className="fas fa-gamepad text-red-500"></i> Game Metadata
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Required */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">Game Title *</label>
          <input
            required
            type="text"
            name="gameTitle"
            value={formData.gameTitle}
            onChange={handleChange}
            placeholder="e.g. Elden Ring, Valorant"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">Content Type *</label>
          <select
            name="contentType"
            value={formData.contentType}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all appearance-none"
          >
            {Object.values(ContentType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Optional */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">Game Genre (Optional)</label>
          <input
            type="text"
            name="gameGenre"
            value={formData.gameGenre}
            onChange={handleChange}
            placeholder="e.g. RPG, FPS"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">Language (Optional)</label>
          <input
            type="text"
            name="language"
            value={formData.language}
            onChange={handleChange}
            placeholder="e.g. English, Indonesian"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-400">Game Store Link (Optional)</label>
          <input
            type="url"
            name="gameLink"
            value={formData.gameLink}
            onChange={handleChange}
            placeholder="https://store.steampowered.com/..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-400">Donation Link / Saweria (Optional)</label>
          <input
            type="url"
            name="donationLink"
            value={formData.donationLink}
            onChange={handleChange}
            placeholder="https://saweria.co/..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all"
          />
        </div>
      </div>

      <button
        disabled={isLoading || !formData.gameTitle}
        className="w-full mt-8 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg shadow-lg transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <i className="fas fa-spinner fa-spin"></i> Analyzing Trends...
          </>
        ) : (
          <>
            <i className="fas fa-bolt"></i> Generate SEO Content
          </>
        )}
      </button>
    </form>
  );
};

export default InputSection;
