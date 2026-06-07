import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X, AlertCircle } from 'lucide-react';

export default function AddFoodModal({ isOpen, onClose, mealType, selectedDate, onFoodAdded }) {
  const [mode, setMode] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [newFood, setNewFood] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetForm = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedFood(null);
    setMode('search');
    setError(null);
    setQuantity('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const getHeaders = () => ({
    "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
    "Content-Type": "application/json"
  });

  useEffect(() => {
    if (mode === 'search' && searchQuery.length > 2) {
      const delay = setTimeout(async () => {
        try {
          const res = await fetch(
            `http://127.0.0.1:8000/foods?query=${encodeURIComponent(searchQuery)}&limit=20`,
            { headers: getHeaders() }
          );

          if (res.ok) {
            const data = await res.json();
            setSearchResults(Array.isArray(data) ? data : (data.items || data.data || []));
          } else {
            console.error("Food search failed:", res.status, await res.text());
            setSearchResults([]);
          }
        } catch (err) {
          console.error("Search error:", err);
          setSearchResults([]);
        }
      }, 500);

      return () => clearTimeout(delay);
    }

    setSearchResults([]);
  }, [searchQuery, mode]);

  const handleSubmitEntry = async () => {
    if (!quantity || quantity <= 0) {
      setError("Please enter a valid quantity in grams.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/users/me/food-entries", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          food_id: selectedFood.id,
          meal_type: mealType,
          quantity_g: parseFloat(quantity),
          consumed_at: `${selectedDate}T12:00:00.000Z`
        })
      });
      if (res.ok) {
        onFoodAdded();
        handleClose();
      } else { setError("Failed to add food entry."); }
    } catch (err) { setError("Network error."); }
    finally { setLoading(false); }
  };

  const handleCreateFood = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/foods", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          name: newFood.name,
          calories_100g: parseFloat(newFood.calories),
          protein_100g: parseFloat(newFood.protein),
          carbs_100g: parseFloat(newFood.carbs),
          fat_100g: parseFloat(newFood.fat)
        })
      });
      if (res.ok) {
        const createdFood = await res.json();
        setSelectedFood(createdFood);
        setMode('search');
        setNewFood({ name: '', calories: '', protein: '', carbs: '', fat: '' });
      } else { setError("Failed to create food."); }
    } catch { setError("Network error."); }
    finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 w-screen h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative font-sans text-[#2b2b2b]"
      >
        <button onClick={handleClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer bg-gray-50 p-2 rounded-full">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold mb-6 capitalize">Add to {mealType}</h2>

        {error && (
          <div className="mb-4 text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4"/>{error}
          </div>
        )}

        {mode === 'search' ? (
          <div className="space-y-5">
            {!selectedFood ? (
              <>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search foods (e.g. Banana)..." 
                    value={searchQuery} 
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value.trim().length <= 2) setSearchResults([]);
                    }} 
                    className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm text-[#2b2b2b] outline-none focus:border-[#00a97f] focus:ring-1 focus:ring-[#00a97f] transition-all shadow-sm" 
                  />
                </div>
                
                <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {searchResults.map(food => (
                    <button key={food.id} onClick={() => setSelectedFood(food)} className="w-full text-left p-4 rounded-xl bg-white border border-gray-100 hover:border-[#00a97f] hover:shadow-sm transition-all cursor-pointer flex justify-between items-center group">
                      <span className="text-sm font-medium group-hover:text-[#00a97f] transition-colors">{food.name}</span>
                      <span className="text-gray-500 text-xs bg-gray-50 px-2 py-1 rounded-md">{food.calories_100g} kcal / 100g</span>
                    </button>
                  ))}
                  {searchQuery.length > 2 && searchResults.length === 0 && (
                    <div className="text-center py-6 text-gray-500 text-sm">No foods found.</div>
                  )}
                </div>

                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Can't find your food?</p>
                  <button onClick={() => setMode('create')} className="text-sm text-[#00a97f] font-semibold hover:text-[#008a68] transition-colors cursor-pointer">Create it manually</button>
                </div>
              </>
            ) : (
              <div className="space-y-5">
                <div className="p-5 bg-[#e6f7f2] rounded-2xl border border-[#b3e6d8] text-center">
                  <h3 className="text-[#00a97f] text-xl font-bold">{selectedFood.name}</h3>
                  <p className="text-[#008a68] text-sm mt-1">{selectedFood.calories_100g} kcal per 100g</p>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider ml-1">Quantity (grams)</label>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 150" autoFocus className="w-full mt-2 bg-white border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-[#00a97f] focus:ring-1 focus:ring-[#00a97f] text-center text-lg font-bold shadow-sm" />
                </div>

                <div className="flex gap-3 mt-8">
                  <button onClick={() => setSelectedFood(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer text-sm font-medium transition-colors">Back</button>
                  <button onClick={handleSubmitEntry} disabled={loading} className="flex-1 py-3 rounded-xl bg-[#00a97f] text-white font-bold hover:bg-[#008a68] cursor-pointer text-sm disabled:opacity-50 transition-colors shadow-sm">
                    {loading ? 'Adding...' : 'Add Food'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleCreateFood} className="space-y-4">
             <div>
              <label className="text-xs text-gray-500 font-medium">Food Name</label>
              <input type="text" required value={newFood.name} onChange={(e) => setNewFood({...newFood, name: e.target.value})} className="w-full mt-1 bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:border-[#00a97f] outline-none shadow-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 font-medium">Calories (/100g)</label>
                <input type="number" required value={newFood.calories} onChange={(e) => setNewFood({...newFood, calories: e.target.value})} className="w-full mt-1 bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:border-[#00a97f] outline-none shadow-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Protein (g)</label>
                <input type="number" step="0.1" required value={newFood.protein} onChange={(e) => setNewFood({...newFood, protein: e.target.value})} className="w-full mt-1 bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:border-[#00a97f] outline-none shadow-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Carbs (g)</label>
                <input type="number" step="0.1" required value={newFood.carbs} onChange={(e) => setNewFood({...newFood, carbs: e.target.value})} className="w-full mt-1 bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:border-[#00a97f] outline-none shadow-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Fat (g)</label>
                <input type="number" step="0.1" required value={newFood.fat} onChange={(e) => setNewFood({...newFood, fat: e.target.value})} className="w-full mt-1 bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:border-[#00a97f] outline-none shadow-sm" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setMode('search')} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer text-sm font-medium">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-[#00a97f] text-white font-bold hover:bg-[#008a68] cursor-pointer text-sm disabled:opacity-50 shadow-sm">
                {loading ? 'Creating...' : 'Create Food'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}