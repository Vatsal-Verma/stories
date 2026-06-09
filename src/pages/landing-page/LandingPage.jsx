import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <img
          src="https://www.jenkins.io/images/logos/jenkins/jenkins.svg"
          alt="Jenkins logo"
          className="landing-logo"
        />
        <h1>Jenkins User Stories</h1>
        <p>
          A collection of real-world stories from teams and individuals using
          Jenkins all around the world.
        </p>
        <div className="landing-buttons">
          <Link to="/all" className="btn btn-primary">All Stories</Link>
          <Link to="/map" className="btn btn-outline">Map View</Link>
        </div>
        <p className="landing-wip">🚧 Site under construction — more coming soon.</p>
      </div>
    </div>
  );
}