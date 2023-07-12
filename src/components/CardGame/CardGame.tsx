import { useEffect, useState } from "react";
import { EvolutionChain, MainClient } from 'pokenode-ts';
import { TiArrowLeftOutline,TiArrowRightOutline } from "react-icons/ti";
import { Button, Card } from "../../ui";
import { Header, ModalSpinner } from "..";

interface iPokemonInfo{
    name:string;
    img:string;
    bgcolor:string;
    types:string[];
}

export const CardGame = () => {

    const [pokemonId, setPokemonId] = useState(1);
    const [pokemonChain, setPokemonChain] = useState<iPokemonInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const pokeApi = new MainClient();

    const getEvolves = async (data:EvolutionChain)=> {
        
        const evolutions:iPokemonInfo[] =[];

        evolutions.push( await pokemonObj(data.chain.species.name));

        if(data.chain.evolves_to.length !== 0 ){
            evolutions.push( await pokemonObj(data.chain.evolves_to[0].species.name));

            if(data.chain.evolves_to[0].evolves_to.length !== 0){
                evolutions.push( await pokemonObj(data.chain.evolves_to[0].evolves_to[0].species.name));
            }
        }
        return{evolutions}
    }

    const pokemonObj = async (name:string)=>{

        const pkmName = name;
        const {pokeSprite,typePkm,TypesPkm}  = await getPokemonData(name);
        const pkm:iPokemonInfo ={ name:pkmName,img:pokeSprite, bgcolor:typePkm, types:TypesPkm}
        

        return pkm
    }

    const getPokemonData = async (name:string) => {
        let pokeSprite ='';

        const pokemon = await pokeApi.pokemon.getPokemonByName(name);
        
        if(pokemon)
            pokeSprite = pokemon.sprites.other?.["official-artwork"].front_default as string;

        let typePkm ='';

        typePkm = pokemon.types[0].type.name;
        
        const TypesPkm:string[] = [];
        pokemon.types.map((type)=> TypesPkm.push(type.type.name));
        
        return {pokeSprite, typePkm,TypesPkm}
    }

    const getData = async () => {
        try {
            setLoading(true);
            const evolutionChain:EvolutionChain= await pokeApi.evolution.getEvolutionChainById(pokemonId);
            
            return getEvolves(evolutionChain);
        } catch (error) {
            console.log(error)
        }
        
    }

    useEffect(() => {
        getData()
        .then((response)=> {
            if(response){
                const {evolutions}=response;
                setPokemonChain(evolutions);
                setLoading(false);
            }
        })
        .catch((error)=>console.log(error))
      }, [pokemonId])

    const prevClick =()=>{
        (pokemonId==1)?setPokemonId(1):setPokemonId(pokemonId-1)
    }

    const nextClick =()=>{
        setPokemonId(pokemonId+1)
    }
  return (
    <div className="app">
        <Header/>
        <div className={`card-container card${pokemonChain.length}`}>
            {
                pokemonChain.map((pkm,index)=> 
                    <Card   name={pkm.name} 
                            sprite={pkm.img} 
                            key={index} 
                            bgcolor={pkm.bgcolor}
                            types={pkm.types}
                    />)
            }
        </div>

        <div className="buttons-container">
            <Button icon={<TiArrowLeftOutline/>} handeClick={prevClick}/>
            <Button icon={<TiArrowRightOutline/>} handeClick={nextClick}/>
        </div>
        {
            loading&&<ModalSpinner/>
        }
    </div>
  )
}
