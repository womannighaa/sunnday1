import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryHero from './components/CategoryHero';
import FeaturedCollections from './components/FeaturedCollections';
import ProductGrid from './components/ProductGrid';
import BrandStory from './components/BrandStory';
import WhatsAppCTA from './components/WhatsAppCTA';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import WhatsAppFloating from './components/WhatsAppFloating';

function App() {
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [showHero, setShowHero] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    setShowHero(category === 'all');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== '') {
      setShowHero(false);
    }
  };

  const isSpecificCategory = ['men', 'women', 'unisex'].includes(currentCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCategoryChange={handleCategoryChange}
        currentCategory={currentCategory}
        onSearch={handleSearch}
      />

      {showHero && currentCategory === 'all' && (
        <>
          <Hero onShopClick={handleCategoryChange} />
          <FeaturedCollections onCollectionClick={handleCategoryChange} />
          <BrandStory />
        </>
      )}

      {isSpecificCategory && !searchQuery && (
        <CategoryHero category={currentCategory as 'men' | 'women' | 'unisex'} />
      )}

      <ProductGrid category={currentCategory} searchQuery={searchQuery} />

      {showHero && currentCategory === 'all' && (
        <>
          <WhatsAppCTA />
          <Newsletter />
        </>
      )}

      <Footer />
      <WhatsAppFloating />
    </div>
  );
}

export default App;
