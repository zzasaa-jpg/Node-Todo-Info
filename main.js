require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { console } = require('inspector');
const { Todo, RecycleBinTodo } = require('./schema.js');
const port = process.env.port || 7231;

const app = express();
app.use(express.json());
app.use(cors());

let timerStart = null;
let timer = null;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"));
});

app.post("/addTodo", async (req, res) => {
    const { todo, Modifyed_Date, done } = req.body;
    try {
        const todos = new Todo({
            todo: todo,
            Date: Modifyed_Date,
            Done: done,
        })
        await todos.save();
        console.log("Succefully Todo added!", todos);
        res.status(200).json({ message: "Todo added successfuly", addedTodo: todos })

    } catch (error) {
        console.error("ERROR", error);
        res.status(500).json({ message: "Failed to add todo", error: error.message });
    }
});

app.get("/getTodos", async (req, res) => {
    const data = await Todo.find();
    res.send(data);
})

app.put("/doneTodo/:id", async (req, res) => {
    const { done } = req.body;
    const clickedId2 = req.params.id;
    try {
        const data = await Todo.findByIdAndUpdate(clickedId2, { Done: done }, { new: true });
        if (!data) {
            return res.status(404).send("Todo not found!");
        }
        console.log("Todo was Done!", data);
        res.status(200).send({ message: "Todo was done!", DoneTodo: data });
    } catch (error) {
        console.error("error:", error);
        res.status(500).send({ message: "Failed Done Todo!", error: error.message });
    }
})
app.put("/editTodo/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { todo } = req.body;
        const data = await Todo.findByIdAndUpdate(id, { todo: todo }, { new: true });
        if (!data) {
            return res.status(404).send("Todo not found!");
        }
        console.log("Successfully data edited:", data);
        res.status(200).json({ message: "Todo succefully edited", edit_todo: data });
    } catch (err) {
        console.error("erroe", err);
        res.status(500).send("An occurred");
    }

});

app.delete("/delete/:id", async (req, res) => {
    try {
        const clickedId = req.params.id;
        const data = await RecycleBinTodo.findByIdAndDelete(clickedId);
        if (!data) {
            return res.status(400).send("no todos!")
        }
        console.log("succefully data deleted:", data);
        if(timer){
            clearTimeout(timer);
            timer = null;
            timerStart = null;
        }
        res.status(200).json({ message: "Todo successfully deleted", deletedTodo: data });
    } catch (error) {
        console.error("error:", error);
        res.status(500).send("An occurred");
        timerStart = null;
    }
});

app.get("/recycle_bin/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Todo.findById(id);

        if (!data) {
            return res.status(404).json({ message: "Todo not found!" });
        }
        const recycle_bin_data = new RecycleBinTodo({
            todo: data.todo,
            Date: data.Date,
            Done: data.Done,
        })
        await recycle_bin_data.save();
        console.log(recycle_bin_data)
        await Todo.findByIdAndDelete(id);
        if(timer){
            clearTimeout(timer);
            timer = null;
            timerStart = null;
        }

        res.status(200).json({ message: "Todo moved to recycle bin successfully", movedTodo: recycle_bin_data })
    } catch (error) {
        console.error("Error moving Todo to recycle bin:", error)
        res.status(500).json({ message: "Failed to move Todo", error: error.message })
    }
})

app.get("/recycle_bin_todo", async (req, res) => {
    const data = await RecycleBinTodo.find();
    console.log(data)
    res.send(data)
})

app.get("/restore/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await RecycleBinTodo.findById(id);

        if (!data) {
            return res.status(404).json({ message: "Todo not found!" });
        }
        const restore = new Todo({
            todo: data.todo,
            Date: data.Date,
            Done: data.Done,
        })
        await restore.save();
        console.log(restore)
        await RecycleBinTodo.findByIdAndDelete(id);
        if(timer){
            clearTimeout(timer);
            timer = null;
            timerStart = null;
        }

        res.status(200).json({ message: "Todo was restored successfully", restore_value: restore })
    } catch (error) {
        console.error("Error restoring Todo:", error)
        res.status(500).json({ message: "Failed to restoring Todo", error: error.message })
    }
})

app.get('/start-timer', (req, res) => {
    if (!timerStart) {
        timerStart = Date.now();
        timer = setTimeout(async () => {
            // Reset the timer after 2 minutes
            try {
                const data = await RecycleBinTodo.deleteMany({});
                console.log("succefully data deleted:", data);
                // res.status(200).json({ message: "Todo successfully deleted", deletedTodo: data });
                timerStart = null;
                timer = null;
            } catch (error) {
                console.error("error:", error);
                timerStart = null;
                timer = null;
                // res.status(500).send("An occurred");
            }
        }, 2 * 60 * 1000); // 2 minutes in milliseconds
    }
    res.json({ message: 'Timer started!' });
});

app.get('/timer-status', (req, res) => {
    if (timerStart) {
        const elapsed = Date.now() - timerStart;
        const remaining = Math.max(2 * 60 * 1000 - elapsed, 0);
        res.json({ timerRunning: true, remainingTime: remaining });
    } else {
        res.json({ timerRunning: false });
    }
});

app.listen(port, () => {
    console.log(`APP RUNNING ON ${port}`);
});
