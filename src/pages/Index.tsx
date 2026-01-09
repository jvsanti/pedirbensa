import HeroSection from '@/components/HeroSection';
import DecretoSection from '@/components/DecretoSection';
import PedirBencaoForm from '@/components/PedirBencaoForm';
import ListaBencaos from '@/components/ListaBencaos';
import FAQSection from '@/components/FAQSection';
import RegrasSection from '@/components/RegrasSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
