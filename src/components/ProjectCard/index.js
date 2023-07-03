import './index.css'

const ProjectCard = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails

  return (
    <li className="list-container">
      <img src={imageUrl} alt={name} className="image" />
      <p>{name}</p>
    </li>
  )
}

export default ProjectCard
