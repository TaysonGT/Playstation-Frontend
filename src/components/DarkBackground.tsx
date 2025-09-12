import React from 'react'

interface Props {
    cancel: ()=> void
    show: boolean
}

const DarkBackground:React.FC<Props> = ({cancel})=>{
    return (
        <div 
            className={`w-screen h-screen fixed top-0 left-0 z-[99] bg-black/60 animate-appear`} 
            onClick={()=>cancel()}
        />
    )
}

export default DarkBackground