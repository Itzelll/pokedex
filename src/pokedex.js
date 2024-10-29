import React, { useState, useEffect } from 'react';
import './App.css';
import ImgPokedex from './pokedex.png'

const API_URL = 'https://pokeapi.co/api/v2/pokemon';

const tiposPokemones = [
    'normal', 'fire', 'water', 'grass', 'electric', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic',
    'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
]; //lista tipos

const ListaPokemones = () => {
    const [pokemon, setPokemon] = useState([]);
    const [carga, setCarga] = useState(true);
    //    const [tipo, setTipo] = useState([]);
    const [tipoSeleccionado, setTipoSeleccionado] = useState('') //tipo texto

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
                            types: pokeData.types.map(typeInfo => typeInfo.type.name), //tipos
                            image: pokeData.sprites.front_default,
                        };
                    })
                );
                setPokemon(detalles); //<--guardar todo
                //setPokemon(data.results);
            } catch (error) {
                console.error('Error al cargar pokemones', error);
            } finally {
                setCarga(false);
            }
        };
        fetchPokemones(); //llamar funcion
    }, []); //carga inicial datos 1 vez

    //filtro tipos de pokemones
    const filtroPokemon = tipoSeleccionado //filtro directo
        ? pokemon.filter( //obtener tipo seleccionado
            (poke) =>
                poke.types.includes(tipoSeleccionado))
        : pokemon;

    /*
    const filtroTipos = () => {
        const filtrarpokemon = tipoSeleccionado.filter(
            (poke) => 
            poke.types.includes(tipoSeleccionado));
            setTipoSeleccionado(tipoSeleccionado);
    } 

    useEffect(() => {
        filtroTipos();        
    }, [])
    */

    const clicHome = () => { //borrar filtro
        setTipoSeleccionado('');
    }

    return (
        <div>
            <main className="main">
                <nav className="navbar">
                    <div className="header">
                        <img src={ImgPokedex} width="180" />
                        <button type="button" className="header-buttons nav-button" onClick={clicHome}>
                            Home
                        </button>
                        <select
                        className='header-buttons nav-button'
                        value={tipoSeleccionado}
                        onChange={(e) => setTipoSeleccionado(e.target.value)}
                    >
                        <option value="">Tipo pokemon</option>
                        {tiposPokemones.map((tipo) => (
                            <option key={tipo} value={tipo}>
                                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                            </option>
                        ))}
                    </select>
                    </div>                    
                </nav>
                <br />
                <div>
                    <div className='pokedex'>
                        <p></p>
                        {carga ? (
                            <p>Cargando...</p>
                        ) : (
                            <div className='pokemon-list'>
                                {filtroPokemon.map((pokemon, index) => (
                                    <div key={index} className="pokemon-item">
                                        <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                                        <img src={pokemon.image} alt={pokemon.name} className="img-p" />
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