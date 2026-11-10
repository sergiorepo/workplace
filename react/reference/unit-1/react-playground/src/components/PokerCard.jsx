// We export the function directly as we define it
export default function PokerCard({ suit, rank }) {
  const isRed = suit === 'Hearts' || suit === 'Diamonds';
  const user = { name: 'Serge', role: 'Developer' };

  return (
    <div className={`w-24 h-36 border-2 border-gray-300 rounded-lg bg-white p-2 flex flex-col 
    justify-between shadow-md ${isRed ? 'text-red-600' : 'text-gray-900'}`}>

      {/* Logical evaluation directly inside markup */}
      {user.role === 'Developer' && <p className="text-green-400">Environment Ready</p>}
      
      <span className="text-lg font-bold">{rank}</span>
      {/* A simplified placeholder for your custom sprite graphics */}
      <div className="w-full h-full bg-gray-100 mt-1 mb-1 rounded" />
      <span className="text-lg font-bold rotate-180">{rank}</span>
    </div>
  );
}