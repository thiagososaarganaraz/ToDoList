import "bootstrap/dist/css/bootstrap.min.css"
import {useEffect, useState } from "react"
import axios from "../../../../../../../../node_modules/axios/index";


const App = () => {

    const [tareas, setTareas] = useState([]);
    const [input, setInput] = useState("");

    const mostrarTareas = async () => { 
        const response = await axios("api/tarea/Lista");
        console.log(response.status);

        if (response.status == 200) {
            const data = response.data;
            setTareas(data);
            console.log(tareas);
        } else {
            console.log("Status code: " + response.status);
        }
    }

    const guardarTarea = async (e) => {
        e.preventDefault();
        console.log(input);

        const response = await fetch("api/tarea/Guardar", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({descripcion:input})
        })

        if (response.ok) {
            setInput("");
            await mostrarTareas();
        }
    }

    const cerrarTarea = async (id) => {
        const response = await fetch("api/tarea/Cerrar/"+id, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ descripcion: input })
        })

        if (response.ok) {
            await mostrarTareas();
        }
    }

    //Metodo para convertir la fecha y hora
    const formatDate = (string) => {
        let options = { year: 'numeric', month: 'long', day: 'numeric' };
        let fecha = new Date(string).toLocaleDateString("es-AR", options);
        let hora = new Date(string).toLocaleTimeString();
        return fecha + " | " + hora;
    }

    useEffect(() => {
        mostrarTareas();
    }, [])

    return (
        <div className="container bg-dark p-4 vh-100">
            <h2 className="text-white">Lista de Tareas</h2>
            <div className="row">
                <div className="col-sm-12">
                    <form onSubmit={guardarTarea}>
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Descripcion de la tarea" value={input} onChange={(e)=> setInput(e.target.value)} />
                            <button className="btn btn-success" type="submit">Agregar</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-sm-12">
                    <div className="list-group">
                        {
                            tareas.map((t) => (
                                <div key={ t.idTarea} className="list-group-item list-group-item-action">
                                    <h5 className="text-primary">{t.descripcion}</h5>
                                    <div className="d-flex justify-content-between">
                                        <small className="text-muted">{formatDate(t.fechaRegistro)}</small>
                                        <button className="btn btn-sm btn-outline-danger" onClick={()=> cerrarTarea(t.idTarea) }>Cerrar</button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;