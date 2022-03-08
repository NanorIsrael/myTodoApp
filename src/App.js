import {
    useQuery,
    gql,
    useMutation
} from "@apollo/client";
import {useState} from "react";

const GET_TODOS = gql`
query getTodos {
  todos {
    id
    text
    done
  }
}
`;

const ADD_TODOS = gql`
mutation addToDo($text: String!) {
  insert_todos(objects: {text: $text}) {
    returning {
      done
      id
      text
    }
  }
}
`;

const TOGGLE_TODOS = gql`
mutation toggleTodo($id: uuid!, $done: Boolean!) {
  update_todos(where: {id: {_eq: $id}}, _set: {done: $done}) {
    returning {
      done
      id
      text
    }
  }
}
`;
const DELETE_TODOS = gql`
mutation deleteTodos($id: uuid!) {
  delete_todos(where: {id: {_eq: $id}}) {
    returning {
      done
      id
      text
    }
  }
}

`;

function App() {
    const [todo, setTodo] = useState('');
    const {data, loading, error} = useQuery(GET_TODOS);
    const [addToDo] = useMutation(ADD_TODOS);
    const [toggleTodo] = useMutation(TOGGLE_TODOS);
    const [deleteTodo] = useMutation(DELETE_TODOS);

 const addTodo = async (e) => {
     e.preventDefault();
     if(!todo.trim()) return;
     await addToDo({variables: {text: todo}, refetchQueries: [{
         query: GET_TODOS}]
     });
     setTodo("");
 }
 const toggleToDo = async (todo) => {
     await toggleTodo({variables: { id: todo.id, done: !todo.done}});
 }
 const deleteToDo = async ({id}) => {
       await deleteTodo({variables: { id: id}, update: cache => {
           const prevData = cache.readQuery({query: GET_TODOS});
           const currentData = prevData.todos.filter(todo =>  todo.id !== id);
           cache.writeQuery({query: GET_TODOS, data: {todos: currentData}})
           }
       });
 }

 if (loading) return <div>Loading...</div>
 if (error) return <div>Error fetching todos</div>
  return (
    <div className="font-body pt-10 text-white bg-primary body pl-16 pr-6">
        <div  className=" justify-center text-center">
            <h1 className={'text-header1 font-bold border-b-2 border-white'} >My check list</h1>
            <form className={'p-4'}>
                <input type={"text"} placeholder={"add todo to list..."} value={todo} className={'rounded-full p-2 w-80 font-bold text-primary'} onChange={(e) => setTodo(e.target.value)}/>
                <button type={"submit"} className={'ml-2 border-2 border-gray-600 p-2 bg-white text-primary px-4 shadow rounded'} onClick={addTodo}>create</button>
            </form>
            <div className={'mb-6'}>
                {data.todos.map(todo => (
                    <p key={todo.id} className={'px-3 mt-2 items-start justify-start'}>
                        <span className={`mr-2 inline-block p-4 text-2xl ${todo.done && 'line-through'}`} onDoubleClick={() => toggleToDo(todo)}>{todo.text}</span>
                        <button type={'submit'} className={'mr-2 inline-block px-4 border-2 border-white rounded text-red '} onClick={() => deleteToDo(todo)}>&times;</button>
                    </p>
                ))
                }
            </div>
        </div>
    </div>
  );
}

export default App;
