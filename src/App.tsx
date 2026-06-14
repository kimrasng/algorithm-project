import { useEffect } from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import { applyMode, Mode } from '@cloudscape-design/global-styles';
import { useSimulationStore } from './store/simulationStore';
import Dashboard from './components/Dashboard';

export default function App() {
  const darkMode = useSimulationStore((s) => s.darkMode);
  const toggleDarkMode = useSimulationStore((s) => s.toggleDarkMode);

  useEffect(() => {
    applyMode(darkMode ? Mode.Dark : Mode.Light);
  }, [darkMode]);
// asdf
  return (
    <>
      <div id="top-nav">
        <TopNavigation
          identity={{
            href: '#',
            title: 'DNS Cache Algorithm Simulator',
          }}
          utilities={[
            {
              type: 'button',
              text: darkMode ? 'Light' : 'Dark',
              onClick: toggleDarkMode,
            },
          ]}
        />
      </div>
      <AppLayout
        content={<Dashboard />}
        navigationHide
        toolsHide
        headerSelector="#top-nav"
      />
    </>
  );
}
