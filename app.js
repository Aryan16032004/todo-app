const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// In-memory todos list
let todos = [];
let id = 1;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes

// Get all todos
app.get('/api/todos', (req, res) => {
    res.json(todos);
});

// Add a new todo
app.post('/api/todos', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const todo = { id: id++, text, completed: false };
    todos.push(todo);
    res.status(201).json(todo);
});

// Toggle completed
app.patch('/api/todos/:id/toggle', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    todo.completed = !todo.completed;
    res.json(todo);
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
    const idx = todos.findIndex(t => t.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Todo not found' });
    todos.splice(idx, 1);
    res.status(204).send();
});

// Serve the HTML frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start server
app.listen(PORT, () => {
    console.log(`Todo app listening at http://localhost:${PORT}`);
});