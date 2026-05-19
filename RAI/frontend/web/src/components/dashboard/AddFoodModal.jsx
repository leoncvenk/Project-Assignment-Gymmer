import { useState, useEffect } from 'react';
import { motion} from 'framer-motion';
import { Search, X, AlertCircle } from 'lucide-react';

export default function AddFoodModal({ isOpen, onClose, mealType, onFoodAdded }) {
  const [mode, setMode] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState('');
  
  const [newFood, setNewFood] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ZAKLEP DRSENJA OZADJA
  const resetForm = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedFood(null);
    setMode('search');
    setError(null);
    setQuantity('');
  };

  // V useEffect za zaklep drsenja:
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      resetForm(); // Tukaj pokličeš reset
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const getHeaders = () => ({
    "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
    "Content-Type": "application/json"
  });

  // POPRAVLJENO ISKANJE
  useEffect(() => {
    if (mode === 'search' && searchQuery.length > 2) {
      const delay = setTimeout(async () => {
        try {
          const res = await fetch(`http://127.0.0.1:8000/foods?name=${searchQuery}`, { headers: getHeaders() });
          if (res.ok) {
            const data = await res.json();
            // Varnostno preverjanje: če API vrne { items: [...] } ali naravnost [...]
            const results = Array.isArray(data) ? data : (data.items || data.data || []);
            setSearchResults(results);
          }
        } catch (err) { 
          console.error("Search error:", err); 
        }
      }, 500);
      return () => clearTimeout(delay);
    } else {
      setSearchResults([]);
    }
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
        body: JSON.stringify({ food_id: selectedFood.id, meal_type: mealType, quantity_g: parseFloat(quantity) })
      });
      if (res.ok) {
        onFoodAdded();
        onClose();
      } else {
        setError("Failed to add food entry.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error."); }
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
      } else {
        setError("Failed to create food.");
      }
    } catch (err) { setError("Network error."); }
    finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    // Fiksna pozicija čez cel zaslon z visokim z-indexom
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 w-screen h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-[var(--muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer bg-[var(--surface-dark)] p-2 rounded-full">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl text-[var(--text-primary)] font-bold mb-6 capitalize">Add to {mealType}</h2>

        {error && <div className="mb-4 text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4"/>{error}</div>}

        {mode === 'search' ? (
          <div className="space-y-5">
            {!selectedFood ? (
              <>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                  <input type="text" placeholder="Search foods (e.g. Banana)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[var(--surface-dark)] border border-[var(--border)] rounded-xl py-3 pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors" />
                </div>
                
                <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {searchResults.map(food => (
                    <button key={food.id} onClick={() => setSelectedFood(food)} className="w-full text-left p-4 rounded-xl bg-[var(--surface-dark)] border border-[var(--border)] hover:border-[var(--accent)] transition-all cursor-pointer flex justify-between items-center group">
                      <span className="text-[var(--text-primary)] text-sm font-medium group-hover:text-[var(--accent)] transition-colors">{food.name}</span>
                      <span className="text-[var(--muted)] text-xs bg-[var(--surface)] px-2 py-1 rounded-md">{food.calories_100g} kcal / 100g</span>
                    </button>
                  ))}
                  {searchQuery.length > 2 && searchResults.length === 0 && (
                    <div className="text-center py-6 text-[var(--muted)] text-sm">No foods found.</div>
                  )}
                </div>

                <div className="text-center pt-4 border-t border-[var(--border)]">
                  <p className="text-xs text-[var(--muted)] mb-2">Can't find your food?</p>
                  <button onClick={() => setMode('create')} className="text-sm text-[var(--text-primary)] font-medium hover:text-[var(--accent)] transition-colors cursor-pointer">Create it manually</button>
                </div>
              </>
            ) : (
              <div className="space-y-5">
                <div className="p-5 bg-[var(--accent)]/10 rounded-2xl border border-[var(--accent)]/30 text-center">
                  <h3 className="text-[var(--accent)] text-xl font-bold">{selectedFood.name}</h3>
                  <p className="text-[var(--muted)] text-sm mt-1">{selectedFood.calories_100g} kcal per 100g</p>
                </div>
                
                <div>
                  <label className="text-xs text-[var(--muted)] font-medium uppercase tracking-wider ml-1">Quantity (grams)</label>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 150" autoFocus className="w-full mt-2 bg-[var(--surface-dark)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] text-center text-lg font-bold" />
                </div>

                <div className="flex gap-3 mt-8">
                  <button onClick={() => setSelectedFood(null)} className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-dark)] cursor-pointer text-sm font-medium transition-colors">Back</button>
                  <button onClick={handleSubmitEntry} disabled={loading} className="flex-1 py-3 rounded-xl bg-[var(--accent)] text-[var(--text-inverse)] font-bold hover:bg-[var(--accent-hover)] cursor-pointer text-sm disabled:opacity-50 transition-colors shadow-lg shadow-[var(--accent)]/20">
                    {loading ? 'Adding...' : 'Add Food'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleCreateFood} className="space-y-4">
            {/* ... Forma za kreiranje hrane ostane enaka ... */}
             <div>
              <label className="text-xs text-[var(--muted)]">Food Name</label>
              <input type="text" required value={newFood.name} onChange={(e) => setNewFood({...newFood, name: e.target.value})} className="w-full mt-1 bg-[var(--surface-dark)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[var(--muted)]">Calories (per 100g)</label>
                <input type="number" required value={newFood.calories} onChange={(e) => setNewFood({...newFood, calories: e.target.value})} className="w-full mt-1 bg-[var(--surface-dark)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Protein (g)</label>
                <input type="number" step="0.1" required value={newFood.protein} onChange={(e) => setNewFood({...newFood, protein: e.target.value})} className="w-full mt-1 bg-[var(--surface-dark)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Carbs (g)</label>
                <input type="number" step="0.1" required value={newFood.carbs} onChange={(e) => setNewFood({...newFood, carbs: e.target.value})} className="w-full mt-1 bg-[var(--surface-dark)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Fat (g)</label>
                <input type="number" step="0.1" required value={newFood.fat} onChange={(e) => setNewFood({...newFood, fat: e.target.value})} className="w-full mt-1 bg-[var(--surface-dark)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setMode('search')} className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-dark)] cursor-pointer text-sm font-medium">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-[var(--accent)] text-[var(--text-inverse)] font-bold hover:bg-[var(--accent-hover)] cursor-pointer text-sm disabled:opacity-50">
                {loading ? 'Creating...' : 'Create Food'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}