import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import PublicIcon from '@mui/icons-material/Public';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function App() {
  const [planetas, setPlanetas] = useState(
    JSON.parse(localStorage.getItem('planetas')) || []
  );
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editDescripcion, setEditDescripcion] = useState('');
  const [errores, setErrores] = useState({});
  const inputImagenRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('planetas', JSON.stringify(planetas));
  }, [planetas]);

  const validar = () => {
    const nuevosErrores = {};

    // 1. Nombre único
    if (planetas.some(p => p.nombre.trim().toLowerCase() === nombre.trim().toLowerCase())) {
      nuevosErrores.nombre = 'El nombre del planeta ya existe.';
    }

    // 2. Longitud mínima/máxima
    if (nombre.trim().length < 3 || nombre.trim().length > 50) {
      nuevosErrores.nombre = 'El nombre debe tener entre 3 y 50 caracteres.';
    }
    if (descripcion.trim().length < 5 || descripcion.trim().length > 500) {
      nuevosErrores.descripcion = 'La descripción debe tener entre 5 y 500 caracteres.';
    }

    // 3. Validar imagen
    if (imagen) {
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
      if (!tiposPermitidos.includes(imagen.type)) {
        nuevosErrores.imagen = 'Solo se permiten imágenes JPG, PNG o WEBP.';
      }
      if (imagen.size > 2 * 1024 * 1024) {
        nuevosErrores.imagen = 'La imagen no debe superar los 2MB.';
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const nuevoPlaneta = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      imagen: imagen ? URL.createObjectURL(imagen) : null,
    };

    setPlanetas([...planetas, nuevoPlaneta]);
    setNombre('');
    setDescripcion('');
    setImagen(null);
    setErrores({});

    if (inputImagenRef.current) {
      inputImagenRef.current.value = '';
    }
  };

  const handleDelete = (index) => {
    const nuevosPlanetas = [...planetas];
    nuevosPlanetas.splice(index, 1);
    setPlanetas(nuevosPlanetas);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditDescripcion(planetas[index].descripcion);
  };

  const handleSave = (index) => {
    const nuevosPlanetas = [...planetas];
    nuevosPlanetas[index].descripcion = editDescripcion;
    setPlanetas(nuevosPlanetas);
    setEditIndex(null);
    setEditDescripcion('');
  };

  return (
    <div>
      <h1>Bitácora de Exploración</h1>

      <form onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          placeholder="Nombre del planeta"
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value);
            setErrores(prev => ({ ...prev, nombre: undefined }));
          }}
          required
        />
        {errores.nombre && <div className="error">{errores.nombre}</div>}
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => {
            setDescripcion(e.target.value);
            setErrores(prev => ({ ...prev, descripcion: undefined }));
          }}
          required
        />
        {errores.descripcion && <div className="error">{errores.descripcion}</div>}
        <input
          type="file"
          onChange={(e) => {
            setImagen(e.target.files[0]);
            setErrores(prev => ({ ...prev, imagen: undefined }));
          }}
          ref={inputImagenRef}
        />
        {errores.imagen && <div className="error">{errores.imagen}</div>}
        <button type="submit">Guardar</button>
      </form>

      <h2>Planetas Registrados</h2>
      <ul>
        {planetas.map((planeta, index) => (
          <li key={index}>
            <h3>
              <PublicIcon style={{ verticalAlign: 'middle', marginRight: 6 }} />
              {planeta.nombre}
            </h3>
            {editIndex === index ? (
              <>
                <textarea
                  className="edit-descripcion"
                  value={editDescripcion}
                  onChange={(e) => setEditDescripcion(e.target.value)}
                />
                <button
                  className="guardar-btn"
                  onClick={() => handleSave(index)}
                >
                  Guardar
                </button>
              </>
            ) : (
              <p>{planeta.descripcion}</p>
            )}
            {planeta.imagen && <img src={planeta.imagen} alt={planeta.nombre} />}
            <button className="editar-btn" onClick={() => handleEdit(index)}>
              <EditIcon style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Editar
            </button>
            <button className="eliminar-btn" onClick={() => handleDelete(index)}>
              <DeleteIcon style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;