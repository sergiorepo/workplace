// Standard ES6 import pointing to the child component file
import PokerCard from './PokerCard';

export default function PokerTable() {
  return (
    <div className="bg-green-800 p-12 rounded-full border-8 border-amber-900 shadow-2xl flex gap-4 justify-center items-center h-96 w-full max-w-3xl">
      {/* Composing the UI by rendering the child component multiple times */}
      <PokerCard rank="A" suit="Spades" />
      <PokerCard rank="K" suit="Hearts" />
    </div>
  );
}