
import React from 'react';
import { Star, ShoppingBag, Gift, Sparkles } from 'lucide-react';

interface StoreProps {
  coins: number;
  onPurchase: (id: number, name: string, price: number) => void;
}

const Store: React.FC<StoreProps> = ({ coins, onPurchase }) => {
  const rewards = [
    { id: 1, name: 'Doctor Connect', provider: 'Health Plus', price: 500, category: 'Service', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Vitamin C Pack', provider: 'PharmEasy', price: 1200, category: 'Health', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'AI Health Lab', provider: 'Arogya AI', price: 300, category: 'Digital', image: 'https://images.unsplash.com/photo-1532187875605-2fe3587b1508?auto=format&fit=crop&q=80&w=400' },
    { id: 4, name: 'Glucose Kit', provider: 'Apollo', price: 800, category: 'Medical', image: 'https://images.unsplash.com/photo-1610214434255-c15c276329c2?auto=format&fit=crop&q=80&w=400' }
  ];

  return (
    <div className="space-y-6 pt-2 pb-10">
      <div className="bg-gradient-to-br from-[#1E293B] to-blue-900/40 border border-blue-500/20 p-6 rounded-[32px] flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Available Coins</p>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-black text-white">{coins.toLocaleString()}</span>
            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center animate-pulse">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
        </div>
        <Sparkles className="w-10 h-10 text-blue-500/20" />
      </div>

      <div className="flex items-center gap-2 px-1">
        <ShoppingBag className="w-4 h-4 text-blue-500" />
        <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Active Rewards</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {rewards.map(reward => (
          <div key={reward.id} className="bg-gray-900/60 border border-gray-800 rounded-[28px] overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="h-32 relative overflow-hidden">
              <img src={reward.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={reward.name} />
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-md text-[8px] font-black text-white uppercase tracking-tighter">{reward.category}</div>
            </div>
            <div className="p-4">
              <h4 className="text-[11px] font-black text-white mb-0.5 line-clamp-1 uppercase">{reward.name}</h4>
              <p className="text-[9px] text-gray-500 font-bold mb-3">{reward.provider}</p>
              <button 
                onClick={() => onPurchase(reward.id, reward.name, reward.price)}
                disabled={coins < reward.price}
                className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${
                  coins >= reward.price 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-gray-800 text-gray-600 grayscale cursor-not-allowed'
                }`}
              >
                {reward.price} <Star className="w-2.5 h-2.5 fill-current" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 bg-yellow-600/5 border border-yellow-500/10 rounded-3xl flex items-center gap-4">
        <Gift className="w-8 h-8 text-yellow-500 opacity-30" />
        <p className="text-[10px] text-gray-400 font-medium leading-relaxed uppercase">
          Take all your medications to earn <span className="text-yellow-500">10 daily coins</span>. Consistent adherence builds streaks for extra bonuses.
        </p>
      </div>
    </div>
  );
};

export default Store;
