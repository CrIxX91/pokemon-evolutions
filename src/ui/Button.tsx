import { FC, ReactNode } from 'react';
import '../sass/Button.scss';


interface ButtonProps {
    icon:ReactNode;
    handeClick:()=>void;
}

export const Button:FC<ButtonProps> = ({icon,handeClick}:ButtonProps) => {

  return (
    <div className="button__box">
        <button className="button" onClick={handeClick}>{icon}</button>
        <div className='button__shadow'></div>
    </div>
  )
}
