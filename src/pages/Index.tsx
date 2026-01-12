import HeroSection from '@/components/HeroSection';
import DecretoSection from '@/components/DecretoSection';
import PedirBencaoForm from '@/components/PedirBencaoForm';
import ListaBencaos from '@/components/ListaBencaos';
import FAQSection from '@/components/FAQSection';
import RegrasSection from '@/components/RegrasSection';
import Footer from '@/components/Footer';
import BackgroundMusic from '@/components/BackgroundMusic';
import BencaoNotifications from '@/components/BencaoNotifications';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <BackgroundMusic />
      <BencaoNotifications />
      <HeroSection />
      <DecretoSection />
      <RegrasSection />
      <PedirBencaoForm />
      <ListaBencaos />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
