import React, { useEffect, useState } from "react";

//css
import "./todo.css";

//images
import edit from "../assets/images/edit.svg";
import dlt from "../assets/images/remove.svg";

export default function Todo() {
    //input states
    const [input, setInput] = useState("");
    const [editInput, setEditInput] = useState("");

    //todo states
    const [todos, setTodos] = useState([]);
    const [todoCount, setTodoCount] = useState(1);
    const [completedId, setCompletedId] = useState([]);

    const [editTodo, setEditTodo] = useState("");

    //fetching todo data from localstorage
    useEffect(() => {
        const todoFromLocalStorage = localStorage.getItem("todo");
        if (todoFromLocalStorage) {
            const parsedTodoList = JSON.parse(todoFromLocalStorage);
            setTodos(parsedTodoList);
        }
        const count = localStorage.getItem("count");
        if (count) {
            const parsedCount = JSON.parse(count);
            setTodoCount(parsedCount);
        }

        const completedTodo = localStorage.getItem("completedTodo");
        if (completedTodo) {
            const parsedCompletedTodo = JSON.parse(completedTodo);
            setCompletedId(parsedCompletedTodo);
        }
    }, []);

    //storing todo input data
    const handleInputchange = (e) => {
        const { value } = e.target;
        setInput(value.trimStart());
    };

    //storing edit-todo input data
    const handleEditInputChange = (e) => {
        const { value } = e.target;
        setEditInput(value);
    };

    //add todo function
    const addTodo = () => {
        if (input) {
            setTodos((prev) => [...prev, { id: todoCount, task: input }]);
            setTodoCount((prev) => prev + 1);

            //storing in local storage
            const count = todoCount + 1;
            const newTodo = { id: todoCount, task: input };
            const allToDo = [...todos, newTodo];
            localStorage.setItem("todo", JSON.stringify(allToDo));
            localStorage.setItem("count", JSON.stringify(count));

            //clearing input field after adding a todo
            setInput("");
        }
    };

    //add todo using enter key
    const handleKeyPress = (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
            if (input) {
                addTodo();
            }
        }
    };

    //delete todo function
    const deleteTodo = (id) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
        const remainingToDos = todos.filter((todo) => todo.id !== id);

        //deleting todo from localstorage
        localStorage.setItem("todo", JSON.stringify(remainingToDos));
    };

    //edit todo function
    const EditTodo = (todo) => {
        setEditTodo(todo?.id);
        setEditInput(todo?.task);
    };

    //save edited-todo function
    const saveTodo = (todo) => {
        //edited todo
        const newTodo = {
            id: todo.id,
            task: editInput,
        };

        //updated todo list
        const updatedTodos = todos?.map((item) => {
            if (item.id === editTodo) {
                return newTodo;
            }
            return item;
        });
        setTodos(updatedTodos);

        //storing updated todo in localstorage
        localStorage.setItem("todo", JSON.stringify(updatedTodos));
        setEditTodo("");
    };

    //cancel edit function
    const cancelEdit = () => {
        setEditTodo("");
    };

    //mark as complete todo function
    const MarkAsCompleted = (id) => {
        const completedTodos = completedId?.includes(id)
            ? completedId.filter((i) => i !== id)
            : [...completedId, id];
        setCompletedId(completedTodos);

        //storing completed data in localstorage
        localStorage.setItem("completedTodo", JSON.stringify(completedTodos));
    };

    return (
        <section className="main-container">
            <div className="shadow-box">
                <div className="todo-main-box">
                    <h1 className="heading">Todo List</h1>
                    <div className="top-box">
                        <input
                            type="text"
                            className="add-todo"
                            placeholder="New Todo"
                            value={input}
                            onChange={handleInputchange}
                            onKeyDown={handleKeyPress}
                        />
                        <button
                            onClick={addTodo}
                            className="add"
                        >
                            ADD TODO
                        </button>
                    </div>
                    <div className="bottom">
                        <div className="all-todo-container">
                            {todos?.map((todo) =>
                                editTodo === todo?.id ? (
                                    <div
                                        key={todo?.id}
                                        className="edit-box"
                                    >
                                        <input
                                            type="text"
                                            className="edit"
                                            placeholder={todo?.task}
                                            value={editInput}
                                            onChange={handleEditInputChange}
                                            onKeyDown={handleKeyPress}
                                        />
                                        <button
                                            onClick={() => saveTodo(todo)}
                                            className="save"
                                        >
                                            SAVE
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="cancel"
                                        >
                                            CANCEL
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        key={todo?.id}
                                        className="todo"
                                    >
                                        <div className="left">
                                            <h2
                                                className={`task ${
                                                    completedId.includes(todo?.id) && "active"
                                                }`}
                                                onClick={() => MarkAsCompleted(todo?.id)}
                                            >
                                                {`${todo?.id})`} {todo?.task}
                                            </h2>
                                        </div>
                                        <div className="right">
                                            <div
                                                onClick={() => EditTodo(todo)}
                                                className="edit"
                                            >
                                                <img
                                                    src={edit}
                                                    alt="edit"
                                                />
                                            </div>
                                            <div
                                                onClick={() => deleteTodo(todo?.id)}
                                                className="delete"
                                            >
                                                <img
                                                    src={dlt}
                                                    alt="remove"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
