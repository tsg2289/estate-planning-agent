import { useNavigate } from 'react-router-dom'
import './HomeLink.css'

const HomeLink = () => {
  const navigate = useNavigate()

  const handleHomeClick = () => {
    navigate('/')
  }

  return (
    <button className="home-link" onClick={handleHomeClick}>
      🏠 Home
    </button>
  )
}

export default HomeLink
