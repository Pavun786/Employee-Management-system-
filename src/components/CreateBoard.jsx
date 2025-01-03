// import { useState, useEffect } from "react";
// import "../App.css";

// function CreateBoard() {
//   const [showPopup, setShowPopup] = useState(false);
//   const [inputValue, setInputValue] = useState("");
//   const [board, setBoard] = useState(() => {
//     const storedBoards = localStorage.getItem("boards");
//     return storedBoards ? JSON.parse(storedBoards) : [];
//   });
//   const [selectedBoard, setSelectedBoard] = useState(null);

//   const handleButtonClick = () => {
//     setShowPopup(true);
//   };

//   const handleClosePopup = () => {
//     setShowPopup(false);
//   };

//   const handleInputChange = (e) => {
//     setInputValue(e.target.value);
//   };

//   const boardCreationFunction = () => {
//     if (inputValue.trim()) {
//       setBoard([...board, inputValue]);
//       setInputValue("");
//       setShowPopup(false);
//     }
//   };

//   useEffect(() => {
//     localStorage.setItem("boards", JSON.stringify(board));
//   }, [board]);

//   const openBoard = (boardName) => {
//     setSelectedBoard(boardName);
//   };

//   return (
//     <div className="container">
//       <div className="left-section">
//         <button onClick={handleButtonClick}>CreateBoard +</button>

//         {showPopup && (
//           <div className="popup-overlay">
//             <div className="popup">
//               <h2>Enter Board Name</h2>
//               <input
//                 type="text"
//                 value={inputValue}
//                 onChange={handleInputChange}
//                 placeholder="Type name"
//               />
//               <div className="popup-buttons">
//                 <button onClick={handleClosePopup}>Close</button>
//                 <button onClick={boardCreationFunction}>Submit</button>
//               </div>
//             </div>
//           </div>
//         )}

//         <div>
//           <h3>Boards:</h3>
//           <div>
//             {board.map((b, index) => (
//               <div
//                 key={index}
//                 onClick={() => openBoard(b)}
//                 className="board-item"
//               >
//                 {b}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="right-section">
//         {selectedBoard ? (
//           <div>
//             <h2>{selectedBoard}</h2>
//             <div className="columns">
//               <div className="column">
//                 <h3>To-Do</h3>
//                 <ul>
//                   {/* Add your To-Do items here */}
//                 </ul>
//               </div>
//               <div className="column">
//                 <h3>In Progress</h3>
//                 <ul>
//                   {/* Add your In Progress items here */}
//                 </ul>
//               </div>
//               <div className="column">
//                 <h3>Done</h3>
//                 <ul>
//                   {/* Add your Done items here */}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <h3>Select a board to view its details</h3>
//         )}
//       </div>
//     </div>
//   );
// }

// export default CreateBoard;


import { useState, useEffect } from "react";
import "../App.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function CreateBoard() {
  const [showPopup, setShowPopup] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    taskName: "",
    description: "",
    assignee: "",
    priority: "",
    dueDate: "",
    column: "toDo", // Default column is "To-Do"
    id: null,
  });
  const [board, setBoard] = useState(() => {
    const storedBoards = localStorage.getItem("boards");
    return storedBoards ? JSON.parse(storedBoards) : [];
  });
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [tasks, setTasks] = useState({}); // Store tasks for each board

  const handleButtonClick = () => {
    setShowPopup(true);
    setTaskDetails({ taskName: "", description: "", assignee: "", priority: "", dueDate: "", column: "toDo", id: null });
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const boardCreationFunction = (inputValue) => {
    if (inputValue.trim()) {
      setBoard([...board, inputValue]);
      setShowPopup(false);
    }
  };

  const openBoard = (boardName) => {
    setSelectedBoard(boardName);
  };

  const addOrUpdateTask = () => {
    const { taskName, description, assignee, priority, dueDate, column, id } = taskDetails;

    if (taskName.trim()) {
      const updatedTasks = { ...tasks };

      // Make sure the selected board has all columns defined
      if (!updatedTasks[selectedBoard]) {
        updatedTasks[selectedBoard] = { toDo: [], inProgress: [], done: [] };
      }

      const newTask = {
        taskName,
        description,
        assignee,
        priority,
        dueDate,
        id: id || Date.now(), // Generate a new ID if not updating an existing task
      };

      // If task ID exists, it's an edit; otherwise, it's a new task
      if (id) {
        // Find the column where the task should be updated
        const taskColumn = updatedTasks[selectedBoard][column];
        const taskIndex = taskColumn.findIndex((task) => task.id === id);
        taskColumn[taskIndex] = newTask; // Update the task in the right column
      } else {
        // Add new task to the selected column
        updatedTasks[selectedBoard][column].push(newTask);
      }

      setTasks(updatedTasks);
      setTaskDetails({ taskName: "", description: "", assignee: "", priority: "", dueDate: "", column: "toDo", id: null });
      setShowPopup(false);
    }
  };

  const deleteTask = (taskId, column) => {
    const updatedTasks = { ...tasks };
    updatedTasks[selectedBoard][column] = updatedTasks[selectedBoard][column].filter(
      (task) => task.id !== taskId
    );
    setTasks(updatedTasks);
  };

  const editTask = (taskId, column) => {
    const task = tasks[selectedBoard][column].find((task) => task.id === taskId);
    setTaskDetails({
      taskName: task.taskName,
      description: task.description,
      assignee: task.assignee,
      priority: task.priority,
      dueDate: task.dueDate,
      column: column,
      id: taskId,
    });
    setShowPopup(true);
  };

  const handleDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;

    const updatedTasks = { ...tasks };
    const [removed] = updatedTasks[selectedBoard][source.droppableId].splice(source.index, 1);
    updatedTasks[selectedBoard][destination.droppableId].splice(destination.index, 0, removed);

    setTasks(updatedTasks);
  };

  useEffect(() => {
    localStorage.setItem("boards", JSON.stringify(board));
  }, [board]);

  return (
    <div className="container">
      <div className="left-section">
        <button onClick={handleButtonClick}>Create Board +</button>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <h2>{taskDetails.id ? "Edit Task" : "Enter Task Details"}</h2>
              <input
                type="text"
                name="taskName"
                value={taskDetails.taskName}
                onChange={handleTaskInputChange}
                placeholder="Task Name"
              />
              <textarea
                name="description"
                value={taskDetails.description}
                onChange={handleTaskInputChange}
                placeholder="Description"
              />
              <input
                type="text"
                name="assignee"
                value={taskDetails.assignee}
                onChange={handleTaskInputChange}
                placeholder="Assignee"
              />
              <input
                type="text"
                name="priority"
                value={taskDetails.priority}
                onChange={handleTaskInputChange}
                placeholder="Priority"
              />
              <input
                type="date"
                name="dueDate"
                value={taskDetails.dueDate}
                onChange={handleTaskInputChange}
              />
              <select
                name="column"
                value={taskDetails.column}
                onChange={handleTaskInputChange}
              >
                <option value="toDo">To-Do</option>
                <option value="inProgress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <div className="popup-buttons">
                <button onClick={handleClosePopup}>Close</button>
                <button onClick={addOrUpdateTask}>
                  {taskDetails.id ? "Update Task" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <h3>Boards:</h3>
          <div>
            {board.map((b, index) => (
              <div
                key={index}
                onClick={() => openBoard(b)}
                className="board-item"
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="right-section">
        {selectedBoard ? (
          <div>
            <h2>{selectedBoard}</h2>
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="columns">
                {["toDo", "inProgress", "done"].map((column) => (
                  <Droppable droppableId={column} key={column}>
                    {(provided) => (
                      <div
                        className="column"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <h3>{column.replace(/([A-Z])/g, " $1").toUpperCase()}</h3>
                        <button onClick={handleButtonClick}>Add Task</button>
                        <ul>
                          {tasks[selectedBoard]?.[column]?.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                              {(provided) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="task-card"
                                >
                                  <h4>{task.taskName}</h4>
                                  <p>{task.description}</p>
                                  <p>Assignee: {task.assignee}</p>
                                  <p>Priority: {task.priority}</p>
                                  <p>Due Date: {task.dueDate}</p>
                                  <button onClick={() => editTask(task.id, column)}>Edit</button>
                                  <button onClick={() => deleteTask(task.id, column)}>Delete</button>
                                </li>
                              )}
                            </Draggable>
                          ))}
                        </ul>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          </div>
        ) : (
          <h3>Select a board to view its details</h3>
        )}
      </div>
    </div>
  );
}

export default CreateBoard;
