import React, { useEffect, useState } from "react";

export const App = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState();
    const urlBase = "https://playground.4geeks.com/apis/fake/todos/user";
    const [input, setInput] = useState("");
    const [tareas, setTareas] = useState([]);
    const [newTask, setNewTask] = useState("")
    const [checkbox, setCheckbox] = useState([])

    const handleCheckboxChange = (event, tareas) => {
    }


    const handleCancel = async (index) => {
        const user = users.splice(index, 1);
        deleteUser(user);
        setUsers([...users]);
        setTareas([])
    };

    const handleChangeNewTask = (event) => {
        setNewTask(event.target.value)
    }
    const handleChange = (event) => {
        setInput(event.target.value);
    };


    const handleSubmitTask = (event) => {
        event.preventDefault();
        if (newTask.trim() !== "") {
            const task = { label: newTask, done: false }
            putTareas(selectedUser, task)
            setNewTask("");
            console.log(tareas)
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (input.trim() !== "") {
            setSelectedUser(input)
            postUser(input);
            setInput("");
        }
    };


    const handleUserClick = async (user) => {
        if (selectedUser !== user) {
            setSelectedUser(user);
            getTareas(user);
        }
    };


    const getUsers = async () => {
        const options = {};
        const response = await fetch(urlBase, options);
        if (!response.ok) {
            console.log("Error: ", response.status, response.statusText);
            return response.status;
        }
        const data = await response.json();
        setUsers(data);
    };


    const postUser = async (user) => {
        const url = `${urlBase}/${user}`;
        const options = {
            method: "POST",
            body: JSON.stringify([]),
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await fetch(url, options);
        if (!response.ok) {
            console.log("Error: ", response.status, response.statusText);
            return response.status;
        }
        const data = await response.json();
        console.log(`User '${user}' agregado correctamente`);
        getUsers();
        getTareas(user);
    };


    const deleteUser = async (user) => {
        const url = `${urlBase}/${user}`;
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await fetch(url, options);
        if (!response.ok) {
            console.log("Error: ", response.status, response.statusText);
            return response.status;
        }
    };


    const getTareas = async (user) => {
        const url = `${urlBase}/${user}`;
        const options = {};
        const response = await fetch(url, options);
        if (!response.ok) {
            console.log("Error: ", response.status, response.statusText);
            return response.status;
        }
        const data = await response.json();
        setTareas(data);
        console.log("Tareas obtenidas correctamente");
    };

    const putTareas = async (user, newTask) => {
        const dataToSend = [...tareas, newTask]
        const url = `${urlBase}/${user}`;

        const opciones = {
            method: "PUT",
            body: JSON.stringify(dataToSend),
            headers: {
                "Content-Type": "application/json",
            },
        };

        const response = await fetch(url, opciones);
        console.log("PUT response:", response);
        if (!response.ok) {
            console.log("Error: ", response.status, response.statusText);
            return response.status;
        }
        await response.json();
        console.log(`Tareas actualizadas correctamente`);
        getTareas(user)
    };






    useEffect(() => {
        getUsers();
    }, []);

    return (
        <main className="container d-flex flex-row gap-2 vh-100 justify-content-center align-items-center">
            <form
                id="formUsers"
                className="col-auto border border-success p-4 rounded"
                onSubmit={handleSubmit}
            >
                <header className="d-flex justify-content-center align-items-center">
                    <h1 className="px-5">Usuarios</h1>
                </header>

                <ul className="d-flex flex-column list-group w-100 mt-2 mx-0 border rounded">
                    <li className="list-group">
                        <input
                            type="text"
                            value={input}
                            className="w-100 p-2"
                            onChange={handleChange}
                            placeholder="Crea un nuevo usuario:"
                        ></input>
                    </li>
                    {users.map((user, index) => (
                        <li
                            key={index}
                            className={`list-group-item border p-2 d-flex justify-content-between ${selectedUser === user ? "active" : ""}`}
                            onClick={() => handleUserClick(user)}
                        >
                            {user}
                            <button
                                onClick={() => handleCancel(index)}
                                type="button"
                                className={`d-flex justify-content-center align-items-center text-danger border-0 ${selectedUser === user ? "bg-primary" : "bg-white"}`}
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </li>
                    ))}
                </ul>
                <footer className="mt-2">
                    <small>
                        {users.length === 0
                            ? "No hay usuarios disponibles"
                            : users.length === 1
                                ? users.length + " usuario disponible"
                                : users.length + " usuarios disponibles"}
                    </small>
                </footer>
            </form>

            <form
                id="formTareas"
                className="col-auto border border-success p-4 rounded"
                onSubmit={handleSubmitTask}
            >
                <header className="d-flex justify-content-center align-items-center">
                    <h1 className="px-5">Tareas</h1>
                </header>

                <ul className="d-flex flex-column justify-content-center align-items-center list-group w-100 mt-2 mx-0  rounded">
                    <li className={`list-group w-100 ${selectedUser == null || users.length === 0 ? "d-none" : ""}`}>
                        <input
                            type="text"
                            value={newTask}
                            className="w-100 p-2"
                            onChange={handleChangeNewTask}
                            placeholder="Escribe una nueva tarea:"
                        ></input>
                    </li>
                    {users.length === 0 || selectedUser == null ? (
                        <p>No hay tareas creadas</p>
                    ) : (
                        tareas
                            .filter((tarea) => tarea.label !== "example task")
                            .map((tarea) => (
                                <li
                                    key={tarea.id}
                                    className="list-group-item border w-100  p-2 d-flexflex-column gap-2 justify-content-center "
                                >
                                    <input
                                        className="form-check-input me-2"
                                        type="checkbox"
                                        id={tarea.id}
                                    //    checked={tarea.done[tarea.id]}
                                    //  onChange={() => handleCheckboxChange(tarea.done)}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor={tarea.id}
                                    >
                                        {tarea.label}
                                    </label>
                                </li>
                            ))
                    )}
                </ul>
            </form>
        </main>
    );
};
