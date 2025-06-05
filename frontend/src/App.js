import { useEffect, useState } from "react";
import "./App.css";

// Data imports
import servicesData from './data/services.json';
import siteData from './data/siteData.json';

// Components
const FloatingButtons = ({ phone, whatsapp }) => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
        title="تواصل عبر الواتساب"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.495"/>
        </svg>
      </a>

      {/* Phone Button */}
      <a
        href={`tel:${phone}`}
        className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
        title="اتصل بنا"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
      </a>
    </div>
  );
};

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-orange-400 transition-all duration-300 hover:transform hover:scale-105">
      <div className="text-4xl mb-4">{service.icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
      <p className="text-gray-300 leading-relaxed">{service.description}</p>
    </div>
  );
};

const FeatureCard = ({ feature }) => {
  return (
    <div className="text-center">
      <div className="text-3xl mb-3">{feature.icon}</div>
      <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
      <p className="text-gray-300 text-sm">{feature.description}</p>
    </div>
  );
};

const Header = ({ siteInfo }) => {
  return (
    <header className="text-center mb-16">
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
        {siteInfo.title}
      </h1>
      <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
        {siteInfo.subtitle}
      </p>
      <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
        {siteInfo.description}
      </p>
    </header>
  );
};

function App() {
  const [timeOfDay, setTimeOfDay] = useState('day');

  useEffect(() => {
    // Security: Disable right click and text selection
    const handleContextMenu = (e) => e.preventDefault();
    const handleSelectStart = (e) => e.preventDefault();
    const handleDragStart = (e) => e.preventDefault();

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);

    // Disable F12, Ctrl+Shift+I, Ctrl+U
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Set time of day for theme
    const hour = new Date().getHours();
    setTimeOfDay(hour >= 6 && hour < 18 ? 'day' : 'night');

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const activeServices = servicesData.services.filter(service => service.active);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 ${timeOfDay === 'night' ? 'brightness-90' : ''}`} dir="rtl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
        backgroundSize: '20px 20px'
      }}></div>
      
      <div className="relative z-10">
        {/* Main Container */}
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <Header siteInfo={siteData.site} />

          {/* Features Section */}
          <div className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {siteData.features.map((feature, index) => (
                <FeatureCard key={index} feature={feature} />
              ))}
            </div>
          </div>

          {/* Services Section */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              خدماتنا
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </section>

          {/* Contact Info */}
          <section className="text-center">
            <h3 className="text-2xl font-bold text-white mb-6">تواصل معنا</h3>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 max-w-md mx-auto">
              <p className="text-orange-400 font-semibold text-lg mb-2">{siteData.site.workingHours}</p>
              <p className="text-gray-300 mb-4">{siteData.site.address}</p>
              <div className="flex justify-center space-x-4 space-x-reverse">
                <a
                  href={`tel:${siteData.site.phone}`}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                >
                  اتصل الآن
                </a>
                <a
                  href={`https://wa.me/${siteData.site.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                >
                  واتساب
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-white/20 mt-16">
          <p className="text-gray-400">
            © 2024 {siteData.site.title} - جميع الحقوق محفوظة
          </p>
        </footer>

        {/* Floating Action Buttons */}
        <FloatingButtons 
          phone={siteData.site.phone} 
          whatsapp={siteData.site.whatsapp} 
        />
      </div>
    </div>
  );
}

export default App;