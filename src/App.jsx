import React from 'react';
import './App.css';
import CreateBoard from './components/CreateBoard';
import Boards from './components/Boards';

const App = () => (
 
    <div className="app">
      <h1>Kanban Board</h1>
      <CreateBoard/>
      {/* <Boards/> */}
    </div>
 
);

export default App;
