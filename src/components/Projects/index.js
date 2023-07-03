import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Header, Image} from './styledComponents'
import ProjectCard from '../ProjectCard'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Projects extends Component {
  state = {
    option: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
    projectsData: [],
  }

  componentDidMount() {
    this.apiCall()
  }

  onChangeSelect = event => {
    this.setState({option: event.target.value}, () => this.apiCall())
  }

  apiCall = async () => {
    const {option} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = `https://apis.ccbp.in/ps/projects?category=${option}`

    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const fetchedData = await response.json()

      const updatedData = fetchedData.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderHeader = () => (
    <Header>
      <Image
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
        alt="website logo"
      />
    </Header>
  )

  renderDetailsView = () => {
    const {projectsData} = this.state
    return (
      <ul className="project-container">
        {projectsData.map(each => (
          <ProjectCard key={each.id} projectDetails={each} />
        ))}
      </ul>
    )
  }

  onClickRetry = () => {
    this.apiCall()
  }

  renderFailureView = () => (
    <div className="courses-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="courses-failure-img"
      />
      <h1 className="courses-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="courses-failure-description ">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  renderDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {option} = this.state
    return (
      <div>
        {this.renderHeader()}
        <select value={option} onChange={this.onChangeSelect}>
          {categoriesList.map(each => (
            <option value={each.id} key={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>
        {this.renderDetails()}
      </div>
    )
  }
}

export default Projects
