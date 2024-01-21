import React, { useEffect, useState } from "react";

export const App = () => {
    const [tareas, setTareas] = useState([]);
    const urlBase = "https://playground.4geeks.com/apis/fake/todos/user";
    const [input, setInput] = useState("")


    const handleChange = (event) => {
        setInput(event.target.value);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (input.trim() !== "") {
            await postTarea(input);
            setInput("");
        }
    };

    const handleCancel = async (index) => {
        const tarea = tareas.splice(index, 1);
        await deleteTarea(tarea)
        setTareas([...tareas]);
    }

    const handleCancelAll = async () => {
        setTareas([]);
    };


    const getTareas = async () => {
        const options = {};
        const response = await fetch(urlBase, options);
        if (!response.ok) {
            console.log('Error: ', response.status, response.statusText);
            return response.status
        }
        const data = await response.json();
        console.log(data)
        setTareas(data);
    };


    const postTarea = async (tarea) => {
        const url = `${urlBase}/${tarea}`;
        const options = {
            method: 'POST',
            body: JSON.stringify([]),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const response = await fetch(url, options);
        if (!response.ok) {
            console.log('Error: ', response.status, response.statusText);
            return response.status
        }
        await response.json();
        setTareas([...tareas, tarea]);
        console.log(`Tarea '${tarea}' agregada correctamente`);

    };




    const deleteTarea = async (tarea) => {
        const url = `${urlBase}/${tarea}`
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response = await fetch(url, options)
        if (!response.ok) {
            console.log('Error: ', response.status, response.statusText)
            return response.status
        }
    }


    useEffect(() => {
        getTareas();
    }, []);

    return (
        <main className="container d-flex flex-column vh-100 justify-content-center align-items-center">
            <form id="form" className="col-auto border border-success p-4 rounded" onSubmit={handleSubmit}>

                <header className="d-flex justify-content-center align-items-center">
                    <h1 className="px-5">To Do List</h1>
                </header>

                <ul className="d-flex flex-column list-group w-100 mt-2 mx-0 border rounded">
                    <li className="list-group">
                        <input
                            type="text"
                            value={input}
                            className="w-100 p-2"
                            onChange={handleChange}
                            placeholder={tareas.length == 0 ? "Escribe la primera tarea:" : "Escribe una tarea:"}>
                        </input>
                    </li>
                    {tareas.map((tarea, index) =>
                    (<li key={index} className="list-group-item border p-2 d-flex justify-content-between ">
                        {tarea}
                        <button
                            onClick={() => handleCancel(index)}
                            type="button"
                            className="d-flex justify-content-center align-items-center text-danger border-0  bg-white">
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </li>)
                    )}
                </ul>
                <footer className="mt-2">
                    <small>
                        {tareas.length == 0 ? "No hay tareas disponibles" : tareas.length == 1 ? tareas.length + " tarea disponible" : tareas.length + " tareas disponibles"}
                    </small>
                </footer>
            </form>
            <button onClick={() => handleCancelAll()} className="btn btn-danger mt-4 p-2">Elimina todas las tareas!</button>
        </main>
    )
}

