import { useState }  from 'react';

function RutinaVieja({rutina, usarComoNueva}) {
    const[menuAbierto, setMenuAbierto] = useState(false);

    return (
        <div style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '8px', marginBottom: '12px', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <h3 style={{ margin: 0 }}>{rutina.nombre}</h3>
                    <small>{rutina.fecha}</small>
                </div>

                {/*Boton de menu*/}
                <div className='menu-container'>
                    <button 
                        className='menu-button' 
                        onClick={() => setMenuAbierto(!menuAbierto)}
                        style={{ color: '#000' }}
                    >⋮</button>
                    {menuAbierto && (
                        <div className='menu-dropdown'>
                            <button 
                                onClick={() => {
                                usarComoNueva(rutina);
                                setMenuAbierto(false);
                                }}
                                style={{ color: '#000 '}}
                            >
                                Usar esta rutina otra vez
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Ejercicios */}
            <div style={{ marginTop: '8px'}}>
                {Array.isArray(rutina.ejercicios) ? rutina.ejercicios.map((e, idx) => (
                    <p key={idx} style={{ margin: '4px 0'}}>
                        <strong>{e.nombre}</strong>: {e.series}x{e.repeticiones} - {' '}
                        {Array.isArray(e.pesosPorSerie) && e.pesosPorSerie.length > 0
                            ? e.pesosPorSerie.map((p, i) => (
                                <span key={i}>
                                    {p}kg{i < e.pesosPorSerie.length -  1 ? ', ' : ''}
                                </span>
                            ))
                        : `${e.peso}kg`}
                    </p>
                )) : null}
            </div>
        </div>
    );
}

export default RutinaVieja;