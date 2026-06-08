import PropTypes from 'prop-types';
import '../components/StoryPopup.css'

const StoryPopup = ({ story }) => {
  return (
    <div className="story-popup">
      {story.image && (
        <div className="story-popup-image">
          <img
            src={story.image}
            alt={`Thumbnail for ${story.title}`}
            className="story-img"
            height={200}
            width={200}
          />
        </div>
      )}
      <div className="story-popup-title">{story.title}</div>
      <div className="story-popup-details">
        <div className="story-popup-row">
          <span className="story-popup-label">Author:</span>
          <span className="story-popup-value">
            {story.map.authored_by || story.authored_by || ''}
          </span>
        </div>
        <div className="story-popup-row">
          <span className="story-popup-label">Location:</span>
          <span className="story-popup-value">{story.map.location ?? ''}</span>
        </div>
        {story.metadata?.industries?.length > 0 && (
          <div className="story-popup-row">
            <span className="story-popup-label">Industries:</span>
            <span className="story-popup-value">
              {story.metadata.industries.join(', ')}
            </span>
          </div>
        )}
      </div>
      <div className="story-btn-container">
        <a
          href={`/user-story/${story.slug}`}
          className="story-popup-button"
          aria-label={`Read the full story about ${story.title}`}
        >
          Read Story
        </a>
      </div>
    </div>
  );
};

StoryPopup.propTypes = {
  story: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    authored_by: PropTypes.string,
    image: PropTypes.string,
    map: PropTypes.shape({
      authored_by: PropTypes.string,
      location: PropTypes.string.isRequired,
    }).isRequired,
    metadata: PropTypes.shape({
      organization: PropTypes.string,
      industries: PropTypes.arrayOf(PropTypes.string),
    }),
  }).isRequired,
};

export default StoryPopup;