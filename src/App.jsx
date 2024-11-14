import { useState, useRef, useEffect } from "react";
import FilterButton from "./Components/FilterButton";
import Form from "./Components/Form";
import Todo from "./Components/Todo";
import { nanoid } from "nanoid";

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};
const FILTER_NAMES = Object.keys(FILTER_MAP);

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const containerStyle = {
  background: "radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(167,70,252,1) 100%)",
};

const wrapperStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.65)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  backdropFilter: "blur(4px)",
  webkitBackdropFilter: "blur(4px)",
  borderRadius: "10px",
  border: "1px solid rgba(255, 255, 255, 0.18)",
};

const App = ({ tasks: initialTasks }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("All");

  const toggleTaskCompleted = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const editTask = (id, newName) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, name: newName } : task
      )
    );
  };

  const addTask = (name) => {
    const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
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

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  const prevTaskLength = usePrevious(tasks.length);
  const listHeadingRef = useRef(null);

  useEffect(() => {
    if (tasks.length < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div
      className="w-full px-4 flex flex-col justify-around items-center h-screen"
      style={containerStyle}
    >
      <div
        className="container w-1/2 p-4 border-4 border-indigo-500"
        style={wrapperStyle}
      >
        <h1 className="text-3xl font-bold text-center text-white">
          Daily Task List
        </h1>
        <Form addTask={addTask} />
        <div className="flex justify-around">{filterList}</div>
        <h2
          className="text-center py-2 font-serif text-lg font-bold text-pink-600"
          id="list-heading"
          tabIndex="-1"
          ref={listHeadingRef}
        >
          {headingText}
        </h2>
        <ul role="list" className="todo-list" aria-labelledby="list-heading">
          {taskList}
        </ul>
      </div>
      <a href="https://www.neerajkumar.in/" className="text-white font-serif text-lg">
        Developed by Neeraj Kumar
      </a>
    </div>
  );
};

export default App;
