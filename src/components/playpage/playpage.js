import {useRef,useContext,useState, useMemo} from 'react'
//import Block15 from "../block15/block15.js00";
import Block15csstr from '../block15/block15csstr';
import {FieldSizeContext} from "../../context";
import { Link } from "react-router-dom";
import useWindowDimensions  from "../../dimension"

function Playpage(props)
{
    const refReset=useRef(null)
    const {fieldSize,setFieldSize}=useContext(FieldSizeContext)
    const { height, width } = useWindowDimensions();
    const minSize = useMemo(() => Math.floor(Math.max(220,Math.min(width-30,height-120))),[width,height])




    return (
<div className='gamediv'>
<div>
<Link to="/" className="bigbutton">НАЗАД НА ГЛАВНУЮ</Link>&nbsp;&nbsp;



    
    
    <a  className="bigbutton"  onClick={(event)=> {event.preventDefault();refReset.current.resetField(); }}>СБРОС</a>
    </div><br />
    <Block15csstr fieldSize=  {fieldSize} width={minSize} ref={refReset}></Block15csstr>

    </div>
    )
}

export default Playpage;