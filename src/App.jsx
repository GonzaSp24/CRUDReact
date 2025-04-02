import React, { useState, useEffect } from "react";


const ObjectComponent = () => {
    const [name, setName] = useState("");
    const [features, setFeatures] = useState("");
    const [price, setPrice] = useState("");
    const [year, setYear] = useState("");
    const [objects, setObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState("");

    // Cargar objetos al montar el componente
    useEffect(() => {
        fetch("https://api.restful-api.dev/objects")
            .then((response) => response.json())
            .then((data) => {
                setObjects(data);
            })
            .catch((error) => console.error("Error al obtener los objetos:", error));
    }, []);

    const handleAddObject = () => {
        fetch("https://api.restful-api.dev/objects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                data: {
                    features: features,
                    price: Number(price),
                    year: Number(year),
                },
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Objeto añadido:", data);
                setObjects([...objects, data]); // Agregar el nuevo objeto a la lista
            })
            .catch((error) => console.error("Error al añadir el objeto:", error));
    };

    const handleEditObject = () => {
        if (!selectedObjectId) {
            alert("Selecciona un objeto para editar.");
            return;
        }

        fetch(`https://api.restful-api.dev/objects/${selectedObjectId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name || "Objeto actualizado",
                data: {
                    features: features || "Características actualizadas",
                    price: Number(price) || 0,
                    year: Number(year) || new Date().getFullYear(),
                },
            }),
        })
            .then((response) => response.json())
            .then((updatedObject) => {
                console.log("Objeto actualizado:", updatedObject);
                setObjects(objects.map((obj) => (obj.id === selectedObjectId ? updatedObject : obj)));
            })
            .catch((error) => console.error("Error al actualizar el objeto:", error));
    };

    const handleDeleteObject = () => {
        if (!selectedObjectId) {
            alert("Selecciona un objeto para eliminar.");
            return;
        }

        fetch(`https://api.restful-api.dev/objects/${selectedObjectId}`, {
            method: "DELETE",
        })
            .then(() => {
                console.log("Objeto eliminado con éxito");
                setObjects(objects.filter((obj) => obj.id !== selectedObjectId));
                setSelectedObjectId("");
            })
            .catch((error) => console.error("Error al eliminar el objeto:", error));
    };

    return (
        <div className="container">
            <h2>Gestión de Objetos</h2>

            <div className="form-group">
                <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="Características" value={features} onChange={(e) => setFeatures(e.target.value)} />
                <input type="number" placeholder="Precio" value={price} onChange={(e) => setPrice(e.target.value)} />
                <input type="number" placeholder="Año" value={year} onChange={(e) => setYear(e.target.value)} />
            </div>

            <div className="buttons">
                <button onClick={handleAddObject}>Agregar Objeto</button>
                <button onClick={handleEditObject} disabled={!selectedObjectId}>Editar Objeto</button>
                <button onClick={handleDeleteObject} disabled={!selectedObjectId}>Eliminar Objeto</button>
            </div>

            <h3>Objetos Disponibles</h3>
            <select onChange={(e) => setSelectedObjectId(e.target.value)} value={selectedObjectId}>
                <option value="">Selecciona un objeto</option>
                {objects.map((obj) => (
                    <option key={obj.id} value={obj.id}>
                        {obj.name} - {obj.id}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ObjectComponent;
