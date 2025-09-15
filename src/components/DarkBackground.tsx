import React from 'react'

interface Props {
    setShow?: (c: boolean)=> void
    show?: boolean
}

const DarkBackground:React.FC<Props> = ({show=true, setShow})=>{
    return (
        <div 
            className={`w-screen h-screen fixed top-0 left-0 z-[99] bg-black/60 animate-appear`} 
            onClick={()=>setShow&&setShow(false)}
        />
    )
}

export default DarkBackground