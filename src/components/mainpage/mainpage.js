import { useContext,useState } from "react";
import { Link } from "react-router-dom";

import {FieldSizeContext} from "../../context";



function Mainpage(props)
{

    const {fieldSize,setFieldSize}=useContext(FieldSizeContext);

  

    function selectChange(event)
    {   
        setFieldSize( parseInt(event.target.value))
    }    

    return (

        
        <div className="mainpage">

            <h1>Игра в пятнашки</h1>
            <br />
            <div>
                Размер поля <br />


                <select onChange={selectChange}  value={fieldSize} className="bigselect">
                    
                    <option value="3">3x3</option>
                    <option value="4" >4x4</option>
                    <option value="5">5x5</option>
                </select>
                <br />
                <br />

            </div>
            <Link to="play" className="bigbutton">ИГРАТЬ!</Link>
        </div>

    )
}

export default Mainpage;