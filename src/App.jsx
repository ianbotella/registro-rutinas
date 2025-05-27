import { useState } from 'react'
import './App.css'
import RutinaVieja from './RutinaVieja';

function App() {
  const [tab, setTab] = useState('inicio')
  const [rutinas, setRutinas] = useState(() => {
    const saved = localStorage.getItem('rutinas')
    return saved ? JSON.parse(saved) : []
  })
  const [favoritas, setFavoritas] = useState(() => {
    const saved = localStorage.getItem('favoritas')
    return saved ? JSON.parse(saved) : []
  })

  const [form, setForm] = useState({
    fecha: '',
    nombre: '',
    esFavorita: false,
    ejercicios: [
      {
        nombre: '',
        series: '',
        repeticiones: '',
        peso: '',
        pesosPorSerie: [],
        notas: ''
      }
    ]
  })

  const handleFormChange = (e, index = null) => {
    const { name, value } = e.target
    if (index !== null) {
      const updated = [...form.ejercicios]
      if (name === 'pesosPorSerie') {
        updated[index][name] = value.split(',').map(p => p.trim())
      } else {
        updated[index][name] = value
      }
      setForm({ ...form, ejercicios: updated })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const agregarEjercicio = () => {
    setForm({
      ...form,
      ejercicios: [
        ...form.ejercicios,
        { nombre: '', series: '', repeticiones: '', peso: '', pesosPorSerie: [], notas: '' }
      ]
    })
  }
  
  const eliminarEjercicio = (index) => {
    const updated = form.ejercicios.filter((_, i) => i !== index)
    setForm({ ...form, ejercicios: updated})
  }

  const guardarRutina = () => {
    // Validacion basica
    if (!form.fecha || !form.nombre || form.ejercicios.length === 0) {
      alert('por favor, completa la fecha, el nombre de la rutina y al menos un ejercicio.');
      return;
    }

    // Validar cada ejercicio
    const ejerciciosValidos = form.ejercicios.every(e =>
      e.nombre.trim() &&
      e.series &&
      e.repeticiones
    );

    if (!ejerciciosValidos) {
      alert('Todos los ejercicios deben tener nombre, series y repeticiones.');
      return;
    }

    // Si todo esta bien, guardar
    const nuevasRutinas = [...rutinas, form];
    setRutinas(nuevasRutinas);
    localStorage.setItem('rutinas', JSON.stringify(nuevasRutinas));

    // Guardar en favoritas si es necesario
    if (form.esFavorita) {
      const rutinaFavorita = {
        nombre: form.nombre,
        ejercicios: form.ejercicios.map(e => ({
          nombre: e.nombre, 
          series: e.series,
          repeticiones: e.repeticiones
        }))
      };
      const nuevasFavoritas = [...favoritas, rutinaFavorita];
      setFavoritas(nuevasFavoritas);
      localStorage.setItem('favoritas', JSON.stringify(nuevasFavoritas));
    }

    //Resetear formulario
    setForm({
      fecha: '',
      nombre: '',
      ejercicios: [
        {
          nombre: '',
          series: '',
          repeticiones: '',
          peso: '',
          pesosPorSerie: [],
          notas: ''
        }
      ]
    });
  };

  const guardarComoFavorita = () => {
    // Solo se extrae nombre y ejercicios con series y repeticiones
    const rutinaFavorita = {
      nombre: form.nombre,
      ejercicios: form.ejercicios.map(e => ({
        nombre: e.nombre,
        series: e.series,
        repeticiones: e.repeticiones
      }))
    }

    const nuevasFavoritas = [...favoritas, rutinaFavorita]
    setFavoritas(nuevasFavoritas)
    localStorage.setItem('favoritas', JSON.stringify(nuevasFavoritas))
  }

  const usarComoNueva = (rutina) => {
    const copia = JSON.parse(JSON.stringify(rutina))
    copia.fecha = new Date().toISOString().split('T')[0]
    setForm(copia)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const eliminarFavorita = (index) => {
    const confirmar = window.confirm("Estas seguro de que quieres eliminar esta rutina favorita?")
    if (!confirmar) return;

    const nuevas = [...favoritas];
    nuevas.splice(index, 1);
    setFavoritas(nuevas);
    localStorage.setItem('favoritas', JSON.stringify(nuevas));
  };

  const editarFavorita = (index) => {
    const favorita = favoritas[index]
    const copia = {
      nombre: favorita.nombre,
      fecha: new Date().toISOString().split('T')[0],
      esFavorita: true,
      ejercicios: favorita.ejercicios.map(e => ({
        nombre: e.nombre,
        series: e.series,
        repeticiones: e.repeticiones,
        peso: '',
        pesosPorSerie: [],
        notas: ''
      }))
    }

    setForm(copia)
    setTab('inicio')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container">
      <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
        Tailwind está funcionando 🎉
      </div>
      <h1>Registro de Rutinas</h1>

      {/* Pestañas */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px'}}>
        <button onClick={() => setTab('inicio')} style={{ fontWeight: tab === 'inicio' ? 'bold' : 'normal' }}>
          Inicio
        </button>
        <button onClick={() => setTab('rutinas')} style={{ fontWeight: tab === 'rutinas' ? 'bold' : 'normal' }}>
          Rutinas guardadas
        </button>
        <button onClick={() => setTab('favoritas')} style={{ fontWeight: tab === 'favoritas' ? 'bold' : 'normal' }}>
          Favoritas
        </button>
      </div>
      {/* Formulario para añadir rutinas */}
      {tab === 'inicio' && (
        <div className="form">
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleFormChange}
        />
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleFormChange}
          placeholder="Nombre de la rutina"
        />

        {form.ejercicios.map((ejercicio, i) => (
          <div key={i} className="ejercicio">
            <input
              type="text"
              name="nombre"
              value={ejercicio.nombre}
              onChange={(e) => handleFormChange(e, i)}
              placeholder="Ejercicio"
            />
            <input
              type="number"
              name="series"
              value={ejercicio.series}
              onChange={(e) => handleFormChange(e, i)}
              placeholder="Series"
            />
            <input
              type="number"
              name="repeticiones"
              value={ejercicio.repeticiones}
              onChange={(e) => handleFormChange(e, i)}
              placeholder="Repeticiones"
            />
            <input
              type="number"
              name="peso"
              value={ejercicio.peso}
              onChange={(e) => handleFormChange(e, i)}
              placeholder="Peso general (kg)"
            />
            <input
              type="text"
              name="pesosPorSerie"
              value={ejercicio.pesosPorSerie.join(', ')}
              onChange={(e) => handleFormChange(e, i)}
              placeholder="Pesos por serie (ej. 10,10,12)"
            />
            <input
              type="text"
              name="notas"
              value={ejercicio.notas}
              onChange={(e) => handleFormChange(e, i)}
              placeholder="Notas"
            />
            <button onClick={() => eliminarEjercicio(i)}>Eliminar</button>
          </div>
        ))}

        <button onClick={agregarEjercicio}>+ Añadir ejercicio</button>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '12px', color: '#000' }}>
          <input
            type='checkbox'
            id='favorita'
            name='esFavorita'
            checked={form.esFavorita}
            onChange={(e) => setForm({ ...form, esFavorita: e.target.checked })}
            style={{
              width: '16px',
              height: '16px',
              accentColor: '#000',
              marginRight: '8px',
              marginTop: 0,
              marginBottom: 0
            }}
          />
          <label htmlFor='favorita' style={{ fontSize: '14px', lineHeight: '1', cursor: 'pointer' }}>
            Guardar como rutina favorita
          </label>
        </div>
        <button onClick={guardarRutina}>Guardar rutina</button>
      </div>
      )}
      
      {/* Rutinas guardadas */}
      {tab === 'rutinas' && (
        <div className="rutinas">
          {rutinas.length === 0 ? (
            <p>No hay rutinas guardadas.</p>
          ) : (
            rutinas.map((rutina, i) => (
              <RutinaVieja
                key={i}
                rutina={rutina}
                usarComoNueva={usarComoNueva}
              />
            ))
          )}
        </div>
      )}

      {/* Rutinas Favoritas */}
      {tab === 'favoritas' && (
          <div className='rutinas'>
            {favoritas.length === 0 ? (
              <p>No hay rutinas favoritas.</p>
            ) : (
              favoritas.map((fav, i) => (
                <div key={i} className='rutina' style={{ border: '1px solid #ccc', padding: '12px', marginBottom: '12px' }}>
                  <h3 style={{ marginBottom: '8px', color: '#000' }}>{fav.nombre}</h3>
                  {fav.ejercicios.map((e, j) => (
                    <div key={j} style={{ paddingLeft: '8px', marginBottom:  '4px', color: '#000' }}>
                      <strong>{e.nombre}</strong>: {e.series} x {e.repeticiones}
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button onClick={() => editarFavorita(i)}>Editar</button>
                    <button onClick={() => eliminarFavorita(i)} style={{ color: 'red' }}>Eliminar</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
    </div>
  )
}

export default App
