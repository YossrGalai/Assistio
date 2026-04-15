import { FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { MessageSquare, Send, X, MessageCircle } from "lucide-react";
import { sendChatMessage } from "../api/chat";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Bonjour ! Je suis l'assistant d'Assistio. Posez-moi une question sur la plateforme.",
    },
  ]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const { answer } = await sendChatMessage(trimmed);
      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Désolé, impossible de répondre pour le moment. Réessayez dans quelques instants.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <div className="mb-3 inline-flex rounded-full bg-primary text-primary-foreground shadow-xl">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Fermer le chatbot" : "Ouvrir le chatbot"}
        >
          {open ? <X className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
        </Button>
      </div>

      {open && (
        <div className="w-80 max-w-full overflow-hidden rounded-[28px] border border-border bg-card/95 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Assistant Assistio</h2>
                <p className="text-xs text-muted-foreground">Posez vos questions sur le service.</p>
              </div>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-96 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-3xl px-4 py-3 text-sm shadow-sm ${
                  message.role === "assistant"
                    ? "bg-slate-950/90 text-slate-100 self-start"
                    : "bg-primary/10 text-primary-foreground self-end"
                }`}
              >
                <div className="font-medium text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {message.role === "assistant" ? "Assistante" : "Vous"}
                </div>
                <div className="whitespace-pre-wrap break-words">{message.text}</div>
              </div>
            ))}
          </div>

          <form className="border-t border-border px-4 py-4" onSubmit={handleSubmit}>
            <Textarea
              rows={3}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Tapez votre question..."
              className="resize-none bg-background/80"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <Button type="submit" disabled={loading || !prompt.trim()}>
                {loading ? "Envoi..." : (
                  <span className="inline-flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Envoyer
                  </span>
                )}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setPrompt("")}>Effacer</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
