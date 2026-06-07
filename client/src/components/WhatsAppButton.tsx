import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phoneNumber = "5511999999999"; // Você pode alterar para o seu número real
  const message = "Olá! Gostaria de tirar uma dúvida sobre um produto personalizado.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 active:scale-95 animate-bounce-slow"
      title="Fale conosco no WhatsApp"
    >
      <MessageCircle className="h-8 w-8" />
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-white/20"></span>
      </span>
    </a>
  );
}
