import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Flame, Image as ImageIcon, Share2, X } from 'lucide-react';

const feelings = [
  { id: 'bad', emoji: '😫', label: 'Bad' },
  { id: 'ok', emoji: '😐', label: 'Okay' },
  { id: 'good', emoji: '🙂', label: 'Good' },
  { id: 'fantastic', emoji: '🤩', label: 'Fantastic' }
];

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ActivityForm({ onClose, onSave }) {
  const fileInputRef = useRef(null);
  
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('Strength');
  const [formDay, setFormDay] = useState('Wed');
  const [formDuration, setFormDuration] = useState('');
  const [formCalories, setFormCalories] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState(null);
  const [selectedFeeling, setSelectedFeeling] = useState('good');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFormImage(URL.createObjectURL(file));
  };

  const handleSaveActivity = () => {
    if (!formTitle.trim()) return;

    const feelingObj = feelings.find(f => f.id === selectedFeeling);
    const durationNum = parseInt(formDuration) || 0;
    
    const newActivity = {
      id: Date.now(),
      title: formTitle,
      type: formType,
      duration: durationNum > 0 ? `${durationNum} min` : '0 min',
      calories: parseInt(formCalories) || 0,
      feeling: feelingObj ? feelingObj.emoji : '🙂',
      image: formImage,
      description: formDescription,
      date: `${formDay}, Just now`,
      shared: false
    };

    onSave(newActivity, durationNum, formDay);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, y: -20 }}
      animate={{ opacity: 1, height: 'auto', y: 0 }}
      exit={{ opacity: 0, height: 0, y: -20, margin: 0 }}
      className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden flex-shrink-0"
    >
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00a97f]" />
          Log New Activity
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <label className="block text-[10px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Workout Title</label>
            <input 
              type="text" 
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Morning Run..." 
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#00a97f] focus:ring-1 focus:ring-[#00a97f] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Day</label>
            <select 
              value={formDay}
              onChange={(e) => setFormDay(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#00a97f] outline-none bg-white cursor-pointer"
            >
              {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Type</label>
            <select 
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#00a97f] outline-none bg-white cursor-pointer"
            >
              <option value="Strength">Strength</option>
              <option value="Cardio">Cardio</option>
              <option value="Flexibility">Flexibility</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Duration (min)</label>
            <div className="relative">
              <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="number" 
                value={formDuration}
                onChange={(e) => setFormDuration(e.target.value)}
                placeholder="45" 
                className="w-full border border-gray-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:border-[#00a97f] outline-none" 
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Calories Burned</label>
            <div className="relative">
              <Flame className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="number" 
                value={formCalories}
                onChange={(e) => setFormCalories(e.target.value)}
                placeholder="320" 
                className="w-full border border-gray-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:border-[#00a97f] outline-none" 
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-gray-500 mb-2 uppercase tracking-wider">How did it feel?</label>
          <div className="flex gap-3">
            {feelings.map(f => (
              <button 
                key={f.id}
                onClick={() => setSelectedFeeling(f.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedFeeling === f.id 
                    ? 'border-[#00a97f] bg-[#e6f7f2] shadow-sm' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl mb-1">{f.emoji}</span>
                <span className={`text-[10px] font-medium ${selectedFeeling === f.id ? 'text-[#00a97f]' : 'text-gray-500'}`}>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Description</label>
          <textarea 
            rows="3" 
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="How did your workout go? Any new PRs?" 
            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-[#00a97f] focus:ring-1 focus:ring-[#00a97f] outline-none transition-all resize-none"
          ></textarea>
        </div>

        {formImage && (
          <div className="relative w-32 h-32 rounded-lg border border-gray-200 overflow-hidden">
            <img src={formImage} alt="Preview" className="w-full h-full object-cover" />
            <button 
              onClick={() => setFormImage(null)}
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-gray-400" />
              Add Photo
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
              <Share2 className="w-4 h-4 text-gray-400" />
              Share
            </button>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer">Cancel</button>
            <button 
              onClick={handleSaveActivity}
              disabled={!formTitle.trim()}
              className={`px-5 py-2 text-sm font-semibold rounded-lg shadow-sm transition-colors ${
                formTitle.trim() ? 'bg-[#2b2b2b] hover:bg-black text-white cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Save Activity
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}