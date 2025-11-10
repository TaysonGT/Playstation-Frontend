import React from 'react'

interface Props {
    setShow?: (c: boolean)=> void
    show?: boolean
}

const DarkBackground:React.FC<Props> = ({show, setShow})=>{
    return (
        <div 
            className={`w-screen h-screen ${show? 'opacity-100 pointer-events-auto':'opacity-0 pointer-events-none'} duration-150 fixed top-0 left-0 z-[99] bg-black/60`} 
            onClick={()=>setShow?setShow(false):0}
        />
    )
}

export default DarkBackground