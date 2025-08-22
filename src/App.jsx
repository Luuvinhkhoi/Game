import { useState, useEffect, useRef } from 'react'
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
  const [isAutoPlay, setIsAutoPlay]=useState(false)
  const isAutoPlayRef = useRef(false)
  const autoPlayIntervalRef = useRef(null)
  const autoPlayIndexRef = useRef(0)
  const getRandomPosition = () => {
    if(window.innerWidth>1700){
      const top = Math.floor(Math.random() * 350); 
      const left = Math.floor(Math.random() * window.innerWidth*0.95);
      return { top, left };
    } else if(window.innerWidth>1500){
      const top = Math.floor(Math.random() * 350); 
      const left = Math.floor(Math.random() * window.innerWidth*0.93);
      return { top, left };
    }
    else if(window.innerWidth>1200 && window.innerWidth<1500){
      const top = Math.floor(Math.random() * 350); 
      const left = Math.floor(Math.random() * window.innerWidth*0.915);
      return { top, left };
    } 
     else if(window.innerWidth>900 && window.innerWidth<1200){
      const top = Math.floor(Math.random() * 350); 
      const left = Math.floor(Math.random() * window.innerWidth*0.9);
      return { top, left };
    } 
    else if(window.innerWidth>700 && window.innerWidth<900){
      const top = Math.floor(Math.random() * 350); 
      const left = Math.floor(Math.random() * window.innerWidth*0.85);
      return { top, left };
    } else if(window.innerWidth>400 && window.innerWidth<700){
      const top = Math.floor(Math.random() * 350); 
      const left = Math.floor(Math.random() * window.innerWidth*0.8);
      return { top, left };
    } 
    else{
      const top = Math.floor(Math.random() * 350); 
      const left = Math.floor(Math.random() * window.innerWidth*0.7);
      return { top, left };
    }
  };
  const circleClick = (index) => {
    const clickedCircle = circle[index]
    if(isGameOver) return
    if (clickedCircle.index !== currentTarget) {
      setIsGameOver(true)
      stopAutoPlay()
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
  const autoPlay = () => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current)
    }
    isAutoPlayRef.current = true

    autoPlayIntervalRef.current = setInterval(() => {
      if (!isAutoPlayRef.current) {
        clearInterval(autoPlayIntervalRef.current)
        return
      }
      const currentIndex = autoPlayIndexRef.current
      if (currentIndex >= circle.length) {
        clearInterval(autoPlayIntervalRef.current)
        setIsAutoPlay(false)
        isAutoPlayRef.current = false
        return
      }
      setCircle(prev => prev.map((item, i) => 
        i === currentIndex 
          ? { ...item, isCountingDown: true, countdown: 3 }
          : item
      ))
      setCurrentTarget(currentIndex + 2)
      autoPlayIndexRef.current++
    }, 1000)
  }

  const stopAutoPlay = () => {
    isAutoPlayRef.current = false
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current)
      autoPlayIntervalRef.current = null
    }
    autoPlayIndexRef.current = 0
  }
  const pauseAutoPlay=()=>{
    isAutoPlayRef.current = false
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current)
      autoPlayIntervalRef.current = null
    }
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
      <div style={{display:'flex', alignItems:'center', gap:'2rem'}}>
          {buttonPlay
            ?
            <button 
              onClick={()=>{
                play(),
                setIsDone(false),
                setIsGameOver(false),
                setGameTime(0), 
                setIsPlay(true), 
                setCurrentTarget(1),
                setIsAutoPlay(false),
                stopAutoPlay()}}
            >Restart</button>
            :
            <button onClick={()=>{setIsPlay(true), setButtonPlay(true), play()}}>Play</button>
          }
          {isGameOver || isDone ?<div></div>:(isAutoPlay
            ?
            <button onClick={()=>{setIsAutoPlay(false), pauseAutoPlay()}}>Auto Play OFF</button>
            :
            <button onClick={()=>{autoPlay(),setIsAutoPlay(true)}}>Auto Play ON</button>
          )}
      </div>
      <div id='play-ground'>
        {isPlay ? circle.map((item, index)=>
            item.visible  ?
            (
              <div 
                onClick={()=>circleClick(index)} 
                className='circle' 
                key={item.index}
                style={{
                  backgroundColor:item.isCountingDown?'red':'white', 
                  top: `${item.top}px`, 
                  left: `${item.left}px`,
                  zIndex:`${(inputValue - item.index + 1) * 10}`, 
                  opacity:item.isCountingDown?item.countdown/3:1
                }}
              >
                {item.isCountingDown ? (
                    <div className='content'>
                      <p>{item.index}</p>
                      <p style={{color:'white'}}>{item.countdown}</p>
                    </div>
                ):(<p>{item.index}</p>)}
              </div>
            )
            :
            (<div></div>)         
        ):(<div></div>)
        }
      </div>
    </div>
  )
}

export default App
