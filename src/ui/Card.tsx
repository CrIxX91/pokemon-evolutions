import { FC } from 'react';
import '../sass/Card.scss';


interface CardProps{
    name:string;
    sprite?:string|null;
    bgcolor:string;
    types:string[];
}

export const Card:FC<CardProps> = ({name,sprite,bgcolor,types}:CardProps) => {
  return (
    <div className={`card ${bgcolor}`}>
        <p className='card__name'>{ name.charAt(0).toUpperCase() + name.slice(1)}</p>
        <div className='card__types'>
          {
            types.map((typepkm)=> <img src={`../../public/icons/${typepkm}.svg`} className='card__typeicon' key={typepkm}/>)
          }
        </div>
        <div className='card__circle'></div>
        <img  className='card__img' src={sprite||''} alt='pokemo img'/>
    </div>
  )
}
