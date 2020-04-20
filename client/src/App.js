import React from 'react';
import io from 'socket.io-client';
import randomID from '@kozlowskanka/randomid-generator';

class App extends React.Component {

  state = {
    tasks: [],
    taskName: '',
  }

  componentDidMount() {
    this.socket = io.connect('http://localhost:8000/');

    this.socket.on('addTask', addedTask => {
      this.addTask(addedTask);
    });
    this.socket.on('removeTask', removedTask => {
      this.removeTask(removedTask);
    });
    this.socket.on('updateData', tasks => {
      this.updateTasks(tasks);
    });
  }

  removeTask(id, fromOutside) {
    const {tasks} = this.state;
    this.setState({ tasks: tasks.filter(item => item.id !== id )});
    if (fromOutside==true) {
      this.socket.emit('removeTask', id, fromOutside);
    }
  }

  submitForm(event) {
    event.preventDefault();
    const {taskName, tasks} = this.state;
    const task = {name: taskName, id: randomID(6)};
    this.addTask(task);
    this.socket.emit('addTask', task);
  }

  addTask(task) {
    const {tasks} = this.state;
    this.setState({
      tasks: [...tasks, task]
    });
  }

  updateTasks(tasks) {
    this.setState({tasks: tasks});
  }

  render() {
    const {tasks, taskName} = this.state;

    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li key={task.id} className="task">
                {task.name}
                <button 
                  className="btn btn--red" 
                  onClick={() => this.removeTask(task.id)}>
                    Remove
                </button>
              </li>
            ))}
          </ul>
    
          <form id="add-task-form">
            <input 
              className="text-input" 
              autoComplete="off" 
              type="text" 
              placeholder="Type your description" 
              id="task-name"
              value={taskName} 
              onChange={event => this.setState({taskName: event.target.value})}
              />
            <button 
              className="btn" 
              type="submit"
              onClick={event => this.submitForm(event)}
            >
              Add
            </button>
          </form>
    
        </section>
      </div>
    );
  };
};

export default App;