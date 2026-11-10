import Currency from './components/Currency';
import TaskBoard from './components/TaskBoard';

function App() {
   return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Currency amount={100} currency="USD" >
        <p>This is a simple currency display component.</p>
      </Currency>
      <TaskBoard isLoading={false}/>
    </div>
  );
}

export default App
