import { Outlet } from 'react-router-dom';
import JioNavbar from './JioNavbar';
import JioFooter from './JioFooter';

function Layout() {
  return (
    <>
      <JioNavbar property="https://vite-stories-jenkins.netlify.app/" />
      <Outlet />
      <JioFooter property="https://vite-stories-jenkins.netlify.app/" />
    </>
  );
}

export default Layout;
