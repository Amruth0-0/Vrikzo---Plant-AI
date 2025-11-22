import { useState, useEffect } from 'react';
import { HeroLanding } from './components/HeroLanding';
import { FuturisticPage2 } from './components/FuturisticPage2';
import { PlantShowcase } from './components/PlantShowcase';
import { VrikzoAIChatbot } from './components/VrikzoAIChatbot';

export default function App() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // 🧊 Freeze background scroll when chatbot is open
  useEffect(() => {
    if (chatbotOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [chatbotOpen]);

  return (
    <div className="min-h-screen bg-black">
      {/* Landing and main futuristic sections */}
      <HeroLanding />

      <FuturisticPage2
        onOpenChatbot={() => setChatbotOpen(true)}        // Opens chatbot fullscreen
        onImageUpload={(url: string) => setUploadedImage(url)} // Pass uploaded image
      />

      <PlantShowcase />
      

      {/* Chatbot appears fullscreen only when open */}
      {chatbotOpen && (
        <VrikzoAIChatbot
          isOpen={chatbotOpen}
          onClose={() => setChatbotOpen(false)}           // Handles close action
          uploadedImage={uploadedImage}
        />
      )}
    </div>
  );
}
