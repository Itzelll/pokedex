import React, { useState, useEffect } from 'react';
import './App.css';
import './pokedex.png'

const API_URL = 'https://pokeapi.co/api/v2/pokemon';

const ListaPokemones = () => {
    const [pokemon, setPokemon] = useState([]);
    const [carga, setCarga] = useState(true);

    useEffect(() => {
        const fetchPokemones = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();

                const detalles = await Promise.all(
                    data.results.map(async (poke) => {
                        const pokeResponse = await fetch(poke.url);
                        const pokeData = await pokeResponse.json();
                        return {
                            name: pokeData.name,
                            weight: pokeData.weight,
                            height: pokeData.height,
                            types: pokeData.types.map(typeInfo => typeInfo.type.name), // Obtener tipos
                            image: pokeData.sprites.front_default,
                        };
                    })
                );
                setPokemon(data.detalles); //<--para guardar lo anterior
                //setPokemon(data.results);
            } catch (error) {
                console.error('Error al cargar pokemones', error);
            } finally {
                setCarga(false);
            }
        };
        fetchPokemones();
    }, []);

    return (
        <div className='encabezado'>
            <main className="main min-vh-100">
                <div className="container navbar-dark bg-dark">
                    <nav className="navbar navbar-expand-lg">
                        <div className="container-fluid">
                            <div className="navbar-brand" href="#">
                                <img src="/pokedex.png" width="250" />
                                <div className="collapse navbar-collapse" id="navbarNav">
                                    <div className="btn-group" role="group">
                                        <button type="button" className="btn btn-primary" id="home">
                                            Home
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
                <br />
                <div className="container" id="divContent">
                    <div className="row border"></div>
                    <div className='pokedex'>
                        <p></p>
                        {carga ? (
                            <p>Cargando...</p>
                        ) : (
                            <div className='pokemon-list'>
                                {pokemon.map((pokemon, index) => (
                                    <div key={index} className="pokemon-item">
                                        <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                                        <img src={pokemon.image} alt={pokemon.name} />
                                        <p>Peso: {pokemon.weight} hectogramos</p>
                                        <p>Altura: {pokemon.height} decímetros</p>
                                        <p>Tipo: {pokemon.types.join(', ')}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main >
        </div >
    );
}

export default ListaPokemones;