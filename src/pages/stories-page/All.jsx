import { useLoaderData } from 'react-router-dom';
import React from 'react';
import UserStoryCard from '../../components/UserStoryCard';
import './allstory.css';

function generateUserStoryIssueURL() {
  const queryParams = new URLSearchParams();
  queryParams.append('title', 'User Success Story');
  queryParams.append('labels', 'success-story');

  const bodyContent = `### Title  
_enter the title for your success story_

### Story Summary  
_give a short summary of your success story_

### _Next Steps_  
_After submitting this issue, please create a PR adding your full success story at:  \`/src/user-story/[story-title]/index.yaml\`  
Also, include any related images in the same directory._`;

  queryParams.append('body', bodyContent);

  return `https://github.com/jenkins-infra/stories/issues/new?${queryParams.toString()}`;
}

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="all-page-modal-overlay">
      <div className="all-page-modal-content">
        <h2>Contribute Your Story</h2>
        <p>
          To share your Jenkins story, create an Issue and follow up with a Pull
          Request to the following GitHub repository:
        </p>
        <a
          href={generateUserStoryIssueURL()}
          target="_blank"
          rel="noopener noreferrer"
          className="all-page-github-link"
        >
          Share Your Story Now
        </a>
        <button onClick={onClose} className="all-page-close-btn">
          ✖
        </button>
      </div>
    </div>
  );
};

const SORT_OPTIONS = [
  { key: 'az',     label: 'A-Z' },
  { key: 'za',     label: 'Z-A' },
  { key: 'latest', label: 'latest' },
  { key: 'oldest', label: 'oldest' },
];

function applyFiltersAndSort(stories, industry, sortKey) {
  let result = [...stories];

  if (industry && industry !== 'all') {
    result = result.filter(s =>
      Array.isArray(s.map?.industries) && s.map.industries.includes(industry)
    );
  }

  switch (sortKey) {
    case 'az':
      result.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''));
      break;
    case 'za':
      result.sort((a, b) => (b.title ?? '').localeCompare(a.title ?? ''));
      break;
    case 'latest':
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'oldest':
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    default:
      break;
  }

  return result;
}

const FilterBar = ({ industries, selectedIndustry, onIndustryChange, sortKey, onSortChange }) => (
  <div className="all-page-filter-bar">
    <div className="all-page-filter-left">
      <label className="all-page-filter-label" htmlFor="industry-select">
        Filter By Industry
      </label>
      <div className="all-page-select-wrapper">
        <select
          id="industry-select"
          className="all-page-industry-select"
          value={selectedIndustry}
          onChange={e => onIndustryChange(e.target.value)}
        >
          <option value="all">All Industries</option>
          {industries.map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
        <span className="all-page-select-arrow">&#8964;</span>
      </div>
    </div>

    <div className="all-page-sort-right">
      <span className="all-page-filter-label">Sort by</span>
      <div className="all-page-sort-pills">
        {SORT_OPTIONS.map(opt => (
          <button
            key={opt.key}
            className={`all-page-sort-pill ${sortKey === opt.key ? 'active' : ''}`}
            onClick={() => onSortChange(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const AllPage = () => {
  const stories = useLoaderData() ?? [];
  const [displayCount, setDisplayCount] = React.useState(10);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedIndustry, setSelectedIndustry] = React.useState('all');
  const [sortKey, setSortKey] = React.useState('latest');
  const storiesPerLoad = 10;

  const industries = React.useMemo(() => {
    const set = new Set(
      stories.flatMap(s =>
        Array.isArray(s.map?.industries) ? s.map.industries : []
      ).filter(Boolean)
    );
    return [...set].sort();
  }, [stories]);

  const handleIndustryChange = (val) => {
    setSelectedIndustry(val);
    setDisplayCount(storiesPerLoad);
  };

  const handleSortChange = (val) => {
    setSortKey(val);
    setDisplayCount(storiesPerLoad);
  };

  const filteredStories = React.useMemo(
    () => applyFiltersAndSort(stories, selectedIndustry, sortKey),
    [stories, selectedIndustry, sortKey]
  );

  const totalStories = filteredStories.length;
  const displayedStories = filteredStories.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + storiesPerLoad);
  };

  return (
    <div id="all-page">
      <div className="all-page-container">
        <div className="all-page-row">
          <div className="all-page-col all-page-text-center">
            <h1>Jenkins Is The Way</h1>
          </div>
        </div>

        <div className="all-page-row">
          <div className="all-page-col">
            <div className="all-page-tell-your-story">
              <h2>Tell Your Story</h2>
              <p>
                "Jenkins Is The Way" is a global showcase of how developers and
                engineers are building, deploying, and automating great stuff
                with Jenkins. Share the story of your project's goals, technical
                challenges, and the unique solutions you encountered with
                Jenkins.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="all-page-share-story-btn"
              >
                Share Your Story
              </button>
            </div>
          </div>
        </div>

        <div className="all-page-row">
          <h2 className="all-page-userstories-heading">Jenkins User Stories</h2>

          <FilterBar
            industries={industries}
            selectedIndustry={selectedIndustry}
            onIndustryChange={handleIndustryChange}
            sortKey={sortKey}
            onSortChange={handleSortChange}
          />

          <div className="all-page-col all-page-cards-wrapper">
            {displayedStories.length > 0 ? (
              displayedStories.map(story => (
                <UserStoryCard
                  key={story.slug}
                  slug={story.slug}
                  image={story.image}
                  title={story.title}
                  date={story.date}
                  tag_line={story.tag_line}
                  body_content={story.body_content}
                />
              ))
            ) : (
              <p className="all-page-no-results">No stories match the selected filter.</p>
            )}
          </div>
        </div>

        {displayCount < totalStories && (
          <div className="all-page-row">
            <div className="all-page-col all-page-text-center">
              <button onClick={handleLoadMore} className="all-page-load-more-btn">
                Load More
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default AllPage;