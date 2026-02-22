import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator} from "@aws-amplify/ui-react";
const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content"), isDone:false });
  }
    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li   key={todo.id}> 
            <input type="checkbox" 
              checked={todo.isDone} 
              disabled={todo.isDone} 
              onChange={() => toogleDone(todo.id)}
            />
            {todo.content}
            <button onClick={() => deleteTodo(todo.id)}>X</button> 
          </li>
        ))}
      </ul>

      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
