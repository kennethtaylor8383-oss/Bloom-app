import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import LandingView from './components/LandingView.jsx';
import InputView from './components/InputView.jsx';
import ResultsView from './components/ResultsView.jsx';
import PricingModal from './components/PricingModal.jsx';

const FREE_LIMIT = 3;
const STORAGE_KEY = 'tariffiq_items';

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [view, setView] = useState('landing');
  const [items, setItems] = useState(loadItems);
  const [isPro, setIsPro] = useState(false);
  const [pricingModal, setPricingModal] = useState(null); // null | 'limit' | 'feature'

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  function addItem(item) {
    if (!isPro && items.length >= FREE_LIMIT) {
      setPricingModal('limit');
      return false;
    }
    const newItem = { ...item, id: crypto.randomUUID() };
    setItems(prev => [...prev, newItem]);
    return true;
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function showPricing(trigger = 'feature') {
    setPricingModal(trigger);
  }

  return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        isPro={isPro}
        onShowPricing={() => showPricing('feature')}
        onGoHome={() => setView('landing')}
      />

      {view === 'landing' && (
        <LandingView
          onStart={() => setView('input')}
          hasItems={items.length > 0}
          onResume={() => setView(items.length > 0 ? 'results' : 'input')}
        />
      )}

      {view === 'input' && (
        <InputView
          items={items}
          isPro={isPro}
          onAddItem={addItem}
          onRemoveItem={removeItem}
          onViewResults={() => setView('results')}
          onShowPricing={showPricing}
          onBack={() => setView('landing')}
        />
      )}

      {view === 'results' && (
        <ResultsView
          items={items}
          isPro={isPro}
          onAddMore={() => setView('input')}
          onShowPricing={showPricing}
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
