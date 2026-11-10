// A standard POJO array for demonstration
const mockTasks = [
  { id: 't1', title: 'Setup Vite', completed: true },
  { id: 't2', title: 'Learn JSX', completed: true },
  { id: 't3', title: 'Master State', completed: false }
];

export default function TaskBoard({ tasks = mockTasks, isLoading = false }) {

  function displayAlert(){
    alert('Hello from React!');
  }

  // 1. Early Return: Blocks the main render if loading
  if (isLoading) {
    return <div className="text-gray-400">Loading tasks...</div>;
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg max-w-md">
      <h2 className="text-2xl text-white font-bold mb-4">Task Board</h2>
      <button onClick={displayAlert} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Alert</button> 
      {/* 2. Logical AND: Only renders if the array is empty */}
      {tasks.length === 3 && (
        <p className="text-yellow-500">You have 3 tasks left!</p>
      )}

      <ul className="space-y-3">
        {/* 3. Mapping the array to generate a list */}
        {tasks.map(task => (
          // 4. The unique 'key' prop is required here
          <li 
            key={task.id} 
            className="flex justify-between p-3 bg-gray-800 rounded border border-gray-700"
          >
            <span className="text-white">{task.title}</span>
            
            {/* 5. Ternary operator for conditional styling and text */}
            <span className={task.completed ? 'text-green-400' : 'text-gray-400'}>
              {task.completed ? 'Done' : 'Pending'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}