import { FaArrowLeft } from "react-icons/fa"
import { Link } from "react-router"


const NotFoundPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
        <p className="font-bold text-6xl">Error 404</p>
        <p className="text-lg">Page Not Found!</p>
        <Link to='/' className="bg-blue-600 hover:bg-blue-400 p-2 text-white rounded-md duration-150 mt-8 flex items-center gap-2"><FaArrowLeft/> Back to Home</Link>
    </div>
  )
}

export default NotFoundPage