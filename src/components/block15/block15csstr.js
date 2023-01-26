import { useEffect, useState, useImperativeHandle, forwardRef, useRef,useMemo } from 'react'
import {CSSTransition} from 'react-transition-group'

import jss from 'jss'
import preset from 'jss-preset-default'
import { gameCompleteCheck,getRandomField } from './block15logics.js'



const animationDuration=100;

jss.setup(preset())

const sheet = jss
  .createStyleSheet(
    {
        myBrick: (d)=> {
            const brickWidth=d.brickWidth
            return (
            {
            width: (brickWidth*0.9), 
            height: (brickWidth*0.9),
            fontSize: Math.floor((brickWidth*0.9)*0.5),
            borderWidth:Math.max(1,Math.floor((brickWidth*0.9)/32)),
            borderRadius:Math.max(1,Math.floor((brickWidth*0.9)/16)),
            boxShadow: Math.floor((brickWidth*0.9)/24).toString()+'px '+Math.floor((brickWidth*0.9)/24).toString()+'px '+Math.floor((brickWidth*0.9)/24).toString()+'px rgb(137 137 137)'
    
        })},
    
        myBlock15: (d) =>({
            width:d.width,
            height: d.width
        }),      
          '@keyframes kMovingRight': ({
            from: {'margin-left': 0},
            to: (data)=>({ 'margin-left': data.brickWidth})
          }), 
          '@keyframes kMovingLeft': ({
            from: {'margin-left': 0},
            to: (data)=>({ 'margin-left': -data.brickWidth})
          }),           

          '@keyframes kMovingDown': ({
            from: {'margin-top': 0},
            to: (data)=>({ 'margin-top': data.brickWidth})
          }), 
          '@keyframes kMovingUp': ({
            from: {'margin-top': 0},
            to: (data)=>({ 'margin-top': -data.brickWidth})
          }),                     

        brickMovingRight: {
            'animation-name': '$kMovingRight',
        },
     
        brickMovingLeft: {
            'animation-name': '$kMovingLeft',
        },
        brickMovingUp: {
            'animation-name': '$kMovingUp',
        },
        brickMovingDown: {
            'animation-name': '$kMovingDown',
        },
        anim: {
            'animation-duration':animationDuration,
            'animation-fill-mode':'forwards',
            'animation-timing-function': 'ease-in'
        }

    }
,{link:true}

  )
  .attach()

const shifts=[
    {shift:[-1,0],animationClassName:sheet.classes.brickMovingUp+' '+sheet.classes.anim},
    {shift:[1,0],animationClassName:sheet.classes.brickMovingDown+' '+sheet.classes.anim},
    {shift:[0,-1],animationClassName:sheet.classes.brickMovingLeft+' '+sheet.classes.anim},
    {shift:[0,1],animationClassName:sheet.classes.brickMovingRight+' '+sheet.classes.anim}
]


function Block15csstr(props,refReset)
{

    const actualFieldSize = useRef(0);    

    
    const [brickWidth] = useMemo( ()=>{
        
        const brickWidth=Math.floor(props.width/props.fieldSize)        
        return [brickWidth]},  
    [props.width,props.fieldSize])

    const [gameCompleteState, setGameCompleteState] = useState(false)

    const [transitionMove,setTransitionMove] = useState(null)    

    const [field,setField] = useState([])
    
    useEffect(()=>{
        sheet.update({brickWidth:brickWidth,width:props.width})
    },[brickWidth,props.width])

    useEffect( ()=> {
        if (actualFieldSize.current!==props.fieldSize) //ensure to randomize field only once
        {

            console.log('fieldsize changed' ,props.fieldSize)
            const rf=getRandomField(props.fieldSize)
            setField(rf)    
            actualFieldSize.current=props.fieldSize
        }
        
    },[props.fieldSize])    
    
   //for Reset button (outside of that component)
    useImperativeHandle(refReset, () => ({
        resetField: () =>  setField(getRandomField(props.fieldSize)),
       }));


    function brickClickWithTransistion(x,y)
    {
        if (gameCompleteState) return;
        if (transitionMove) return;
        //if (localTransitionRunning) return;
        //console.log([x,y])
        let brick=field[y][x]

        if (brick===0) return;
        console.log(brick)

        function findZeroBrick(x,y)
        {
            function testBrick(xx,yy)
            {
                if (xx<0) return false;
                if (yy<0) return false;
                if (yy >= field.length) return false;
                if (xx >= field[yy].length) return false;

                return field[yy][xx]===0;

            }



            const tests=shifts.map( (shift ) => 
                ((newX,newY) => { 
                    return testBrick (newX,newY) ? {x:newX, y:newY, shift} : false
                })
                (x+shift.shift[1],y+shift.shift[0])                
              
              ).filter ( item => item )
            //console.log(tests)

            if (tests.length>1)
            {
                console.log('more than 1 free brick, movement is not determinated')
                return false;
            }
            if (tests.length===0) {
                console.log('impossible to move')
                return false;
            }
            console.log('move',tests[0].x, tests[0].y)

            return tests[0]


        }



        const move=findZeroBrick(x,y)
        if (!move)
        {
            return;
        }


       console.log(brick)

       const newField = field.map(row => [...row] )
       newField[move.y][move.x]=brick;
       newField[y][x]=0;            

       setTransitionMove({brick:brick, animationClassName:move.shift.animationClassName, newField})    
       console.log(move.shift)   

    }        

    
    useEffect( ()=>{

        const isGameComplete = gameCompleteCheck(field)
        setGameCompleteState(isGameComplete)
        console.log('isGameComplete',isGameComplete)

    }, [field])
    

    function brickMoved()
    {
        setField(transitionMove.newField)
        setTransitionMove(null)   
    }

    const nodeRef = useRef(null);
  
    
    return (        

        <div className={sheet.classes.myBlock15 + " block15"} >            
      
            {gameCompleteState  ? <div className='gameComplete'>Успех!</div> : ''}
            <div style={{position:'relative'}}>

            {field.map((row , y)=> row.map ((brick,x) => {

                    const positionStyle = { 
                        left: Math.floor(brickWidth*x).toString() + 'px',
                        top: Math.floor(brickWidth*y).toString() + 'px',
                        backgroundColor: (brick > 0) ? '#EEE' : undefined,
                        display: (brick===0) ? 'none' :  undefined,
                    
                    }                    
                    
                    return    (
                        <CSSTransition 
                            key={brick.toString()} 
                            in={transitionMove && transitionMove.brick===brick} 
                            nodeRef={nodeRef}  
                            timeout={animationDuration} 
                            classNames={{
                                enterActive: (transitionMove) ? transitionMove.animationClassName : ''                            
                            }}                         
                            onEntered={brickMoved}
                            >

                        <div 

                            className={sheet.classes.myBrick+" brick "} 
                            ref={(transitionMove && transitionMove.brick===brick) ? nodeRef:null} 
                            style={positionStyle}   
                            onClick={(event) => brickClickWithTransistion(x,y) }  
                        >
                            {brick > 0 ?  brick: ''}
                        </div>
                        </CSSTransition>
                    
                    )

                 }
                
                )  ) }

            </div>

        </div>
    )
}




export default forwardRef(Block15csstr);