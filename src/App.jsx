import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import LandingView from './components/LandingView.jsx';
import InputView from './components/InputView.jsx';
import ResultsView from './components/ResultsView.jsx';
import PricingModal from './components/PricingModal.jsx';
import AdminView from './components/AdminView.jsx';

export const FREE_ITEM_LIMIT = 3;
export const FREE_PROJECT_LIMIT = 1;
const STORAGE_KEY = 'tariffiq_projects';

function makeProject(name = 'New Analysis') {
  return {
    id: crypto.randomUUID(),
    name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    items: [],
  };
}

function loadProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}
  return [makeProject('My First Analysis')];
}

function parseSharedHash() {
  try {
    const hash = window.location.hash;
    if (!hash.startsWith('#share=')) return null;
    const encoded = hash.slice(7);
    const json = atob(encoded);
    const items = JSON.parse(json);
    if (!Array.isArray(items)) return null;
    return items;
  } catch {
    return null;
  }
}

export default function App() {
  const isAdmin = window.location.pathname === '/admin';

  const [projects, setProjects] = useState(loadProjects);
  const [activeId, setActiveId] = useState(() => loadProjects()[0]?.id ?? null);
  const [view, setView] = useState('landing');
  const [isPro, setIsPro] = useState(false);
  const [pricingModal, setPricingModal] = useState(null);
  const [importItems, setImportItems] = useState(null); // from shared URL

  // Persist projects to localStorage
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)); } catch {}
  }, [projects]);

  // Check for shared BOM in URL hash on first load
  useEffect(() => {
    const shared = parseSharedHash();
    if (shared) {
      setImportItems(shared);
      window.location.hash = '';
    }
  }, []);

  const activeProject = projects.find(p => p.id === activeId) ?? projects[0];
  const items = activeProject?.items ?? [];

  // ── Project CRUD ──────────────────────────────────────────────────────────

  function createProject(name = 'New Analysis') {
    if (!isPro && projects.length >= FREE_PROJECT_LIMIT) {
      setPricingModal('limit');
      return null;
    }
    const project = makeProject(name);
    setProjects(prev => [...prev, project]);
    setActiveId(project.id);
    return project.id;
  }

  function renameProject(id, name) {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name, updatedAt: Date.now() } : p));
  }

  function deleteProject(id) {
    setProjects(prev => {
      const next = prev.filter(p => p.id !== id);
      if (next.length === 0) {
        const fresh = makeProject();
        setActiveId(fresh.id);
        return [fresh];
      }
      if (activeId === id) setActiveId(next[0].id);
      return next;
    });
  }

  function openProject(id) {
    setActiveId(id);
    setView('input');
  }

  // ── Item CRUD (scoped to active project) ─────────────────────────────────

  function updateItems(newItems) {
    setProjects(prev => prev.map(p =>
      p.id === activeProject.id ? { ...p, items: newItems, updatedAt: Date.now() } : p
    ));
  }

  function addItem(item) {
    if (!isPro && items.length >= FREE_ITEM_LIMIT) {
      setPricingModal('limit');
      return false;
    }
    updateItems([...items, { ...item, id: crypto.randomUUID() }]);
    return true;
  }

  function removeItem(id) {
    updateItems(items.filter(i => i.id !== id));
  }

  // ── Import shared BOM ─────────────────────────────────────────────────────

  function acceptImport() {
    const project = makeProject('Shared Analysis');
    const itemsWithIds = importItems.map(i => ({ ...i, id: crypto.randomUUID() }));
    project.items = itemsWithIds;
    setProjects(prev => [...prev, project]);
    setActiveId(project.id);
    setImportItems(null);
    setView('results');
  }

  function dismissImport() {
    setImportItems(null);
  }

  if (isAdmin) {
    return <AdminView onExit={() => window.location.pathname !== '/' && (window.location.href = '/')} />;
  }

  return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        isPro={isPro}
        projectName={activeProject?.name}
        onShowPricing={() => setPricingModal('feature')}
        onGoHome={() => setView('landing')}
        onGoProjects={() => setView('landing')}
      />

      {/* Shared BOM import banner */}
      {importItems && (
        <div className="import-banner">
          <span>📋 Someone shared a BOM with {importItems.length} part{importItems.length !== 1 ? 's' : ''} — open it?</span>
          <div className="import-banner-actions">
            <button className="btn btn-primary btn-sm" onClick={acceptImport}>Import BOM</button>
            <button className="btn btn-ghost btn-sm" onClick={dismissImport}>Dismiss</button>
          </div>
        </div>
      )}

      {view === 'landing' && (
        <LandingView
          onStart={() => {
            const id = activeProject?.id ?? createProject();
            if (id) { setActiveId(id); setView('input'); }
          }}
          projects={projects}
          isPro={isPro}
          onOpenProject={openProject}
          onDeleteProject={deleteProject}
          onNewProject={() => {
            const id = createProject();
            if (id) { setView('input'); }
          }}
        />
      )}

      {view === 'input' && (
        <InputView
          project={activeProject}
          items={items}
          isPro={isPro}
          onAddItem={addItem}
          onRemoveItem={removeItem}
          onRenameProject={name => renameProject(activeProject.id, name)}
          onViewResults={() => setView('results')}
          onShowPricing={setPricingModal}
          onBack={() => setView('landing')}
        />
      )}

      {view === 'results' && (
        <ResultsView
          project={activeProject}
          items={items}
          isPro={isPro}
          onAddMore={() => setView('input')}
          onShowPricing={setPricingModal}
          onBack={() => setView('input')}
        />
      )}

      {pricingModal && (
        <PricingModal
          trigger={pricingModal}
          onClose={() => setPricingModal(null)}
        />
      )}
    </div>
  );
}
