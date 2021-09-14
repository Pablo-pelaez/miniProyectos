import FilterButton from "./components/FilterButton";
import Form from "./components/Forms";
// import editTask from "./components/editTask";
import Todo from './components/Todo'
import React, { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed 
}

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {

  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState('All');

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);
  //-------------------------------------------------------------------------------
  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);
  
    const addTask = (name) => {
    const newTask = { id: 'todo' + nanoid(), name: name, completed: false }
    setTasks([...tasks, newTask])
  };

  
  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map(
      task => {
        // If this task has the same ID as the edited task
        if(id === task.id){
          // Use object spreadto make a new object
          //whose 'completed' prop has been inverted
          return {...task, completed: !task.completed}
        }
        return task
      });
      setTasks(updatedTasks);
    }
    
    const deleteTask = (id) => {
      const remainingTasks = tasks.filter(task  => id !== task.id);
      setTasks(remainingTasks);
    }

    const editTask = (id, newName) => {
      const editedTasks = tasks.map(task => {
        if(id === task.id){
          return {...task, name: newName}
        }
        return task
      });
      setTasks(editedTasks);  
    }
    
    const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map(task => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));
    

    const filterList = FILTER_NAMES.map(name => (
      <FilterButton key={name} 
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
      />
    ));

    const tasksNonun = taskList.length ==! 1 ? 'tasks': 'task';
    const headingText = `${taskList.length} ${tasksNonun} remaining`;
    
    
    return (
      <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading">{headingText}</h2>
      <ul
        role="list"
        className="editTask-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;
