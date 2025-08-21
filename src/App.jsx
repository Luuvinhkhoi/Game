import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [inputValue, setInputValue]=useState(5)
  const [circle, setCircle]=useState([])
  const [isPlay, setIsPlay]=useState(false)
  const [buttonPlay, setButtonPlay]=useState(false)
  const [gameTime, setGameTime]=useState(0)
  const [isDone, setIsDone]=useState(false)
  const [currentTarget, setCurrentTarget] = useState(1)
  const [isGameOver, setIsGameOver]=useState(false)
  const getRandomPosition = () => {
    const top = Math.floor(Math.random() * 300); 
    const left = Math.floor(Math.random() * window.innerWidth*0.8);
    return { top, left };
  };
  const circleClick = (index) => {
    const clickedCircle = circle[index]
    if (clickedCircle.index !== currentTarget) {
      setIsGameOver(true)
    }
    
    setCircle(prev => prev.map((item, i) => 
      i === index 
        ? { ...item, isCountingDown: true, countdown: 3 }
        : item
    ))
    
    setCurrentTarget(prev => prev + 1)
  }
  const play=()=>{
    const newCircles = []
    for(let i=1; i<=inputValue; i++){
      const {top, left}=getRandomPosition()
      newCircles.push({index: i, visible: true, countdown: null,isCountingDown: false, top:top, left:left})
    }
    setCircle(newCircles)
  }
  useEffect(() => {
    if (isGameOver) return
    const interval = setInterval(() => {
      setCircle(prev => prev.map(circle => {
        if (!circle.isCountingDown) return circle
        
        const newCountdown = Math.round((circle.countdown - 0.1)*10)/10
        if (newCountdown <= 0) {
          return { ...circle, visible: false, isCountingDown: false }
        }
        return { ...circle, countdown: newCountdown }
      }))
    }, 100)

    return () => clearInterval(interval)
  }, [isGameOver])
  useEffect(() => {
    if (!isPlay || isDone || isGameOver) return

    const timer = setInterval(() => {
      setGameTime(prev => Math.round((prev + 0.1) * 10) / 10)
    }, 100)
    
    return () => clearInterval(timer)
  }, [isPlay, isDone, isGameOver])
  useEffect(() => {
    if (isPlay && circle.length > 0) {
      const allHidden = circle.every(c => !c.visible)
      if (allHidden) {
        setIsDone(true)
        setIsPlay(false)
      }
    }
  }, [circle, isPlay, gameTime])


  return (
    <div style={{textAlign:'left', width:'100%'}}>
      { isGameOver?(<h2 style={{color:'red'}}>GAME OVER</h2>):isDone?<h2 style={{color:'green'}}>ALL CLEARED</h2>:<h2>LET'S PLAY</h2>}
      <div id='point'>
        <p>Points:</p>
        <div>
          <input value={inputValue} onChange={(e)=>setInputValue(e.target.value)}></input>
        </div>
      </div>
      <div id='time'>
        <p>Time:</p>
        <p>{gameTime}s</p>
      </div>
      {buttonPlay?<button onClick={()=>{play(),setIsDone(false), setIsGameOver(false), setGameTime(0), setIsPlay(true), setCurrentTarget(1)}} >Restart</button>:<button onClick={()=>{setIsPlay(true), setButtonPlay(true), play()}}>Play</button>}
      <div id='play-ground'>
        {isPlay ? circle.map((item, index)=>
            item.visible?(<div onClick={()=>circleClick(index)} style={{backgroundColor:item.isCountingDown?'red':'white',fontWeight:'bold' ,border:'solid 1px red',display:'flex', alignItems:'center', justifyContent:'center',borderRadius:'10rem', width:'40px', height:'40px', fontSize:'12px', position:'absolute', top: `${item.top}px`, left: `${item.left}px`, opacity:item.isCountingDown?item.countdown/3:1}}>
              {item.isCountingDown ? (
                  <div style={{ fontSize: '10px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' ,gap:'4px'}}>
                    <p>{item.index}</p>
                    <p style={{color:'white'}}>{item.countdown}</p>
                  </div>
              ):(<p>{item.index}</p>)}
            </div>):(<div></div>)         
        ):(<div></div>)}
      </div>
    </div>
  )
}

export default App
