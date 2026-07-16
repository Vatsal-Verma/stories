import StoryMap from '../../components/map/StoryMap.jsx';
import { Head } from 'vite-react-ssg';
import 'leaflet/dist/leaflet.css';

const MapPage = () => {
  return (
    <>
      <Head>
        <title>Jenkins User Stories - Map</title>
      </Head>
      <StoryMap />
    </>
  );
};

export default MapPage;
