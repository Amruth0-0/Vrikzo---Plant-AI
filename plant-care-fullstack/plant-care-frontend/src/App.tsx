import { useState } from 'react';
import { HeroLanding } from './components/HeroLanding';
import { FuturisticPage2 } from './components/FuturisticPage2';
import { PlantShowcase } from './components/PlantShowcase';
import { VrikzoAIChatbot } from './components/VrikzoAIChatbot';

export default function App() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Note: scroll lock is managed inside VrikzoAIChatbot to avoid duplicate effects


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
