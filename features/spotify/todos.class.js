class Todo {
  constructor(id, title, completed = false) {
    this.id = id;
    this.title = title;
    this.completed = completed;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      completed: this.completed
    };
  }

  create() {
    // Logic to create a new todo item
    // This could involve saving to a database or in-memory store
    console.log(`Creating todo: ${this.title}`);
    return this;
  }
}

export default Todo;
