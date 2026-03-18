import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";
import { motion } from "framer-motion";

interface ReviewFormProps {
  requestTitle: string;
  targetUserName: string;
  onSubmit?: (rating: number, comment: string) => void;
}

const ReviewForm = ({ requestTitle, targetUserName, onSubmit }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const ratingLabels = ["", "Décevant", "Passable", "Bien", "Très bien", "Excellent"];

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Note requise",
        description: "Veuillez attribuer une note avant d'envoyer votre avis.",
        variant: "destructive",
      });
      return;
    }

    onSubmit?.(rating, comment);
    setSubmitted(true);
    toast({
      title: "Avis envoyé !",
      description: `Merci d'avoir évalué ${targetUserName}.`,
    });
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-card text-center"
      >
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--success))]/10">
          <Star className="h-7 w-7 fill-accent text-accent" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Merci pour votre avis !</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Votre évaluation aide la communauté Assistio à maintenir un service de qualité.
        </p>
        <div className="mt-3 flex items-center justify-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h3 className="mb-1 text-lg font-bold text-foreground">Évaluer le service</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Comment s'est passé « {requestTitle} » avec <strong>{targetUserName}</strong> ?
      </p>

      {/* Star rating */}
      <div className="mb-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => {
            const starValue = i + 1;
            return (
              <button
                key={i}
                type="button"
                className="p-0.5 transition-transform hover:scale-110"
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoveredRating(starValue)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    starValue <= (hoveredRating || rating)
                      ? "fill-accent text-accent"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            );
          })}
          {(hoveredRating || rating) > 0 && (
            <span className="ml-2 text-sm font-medium text-foreground">
              {ratingLabels[hoveredRating || rating]}
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      <Textarea
        placeholder="Décrivez votre expérience (optionnel)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        className="mb-4"
      />

      <Button variant="hero" className="w-full gap-1.5" onClick={handleSubmit}>
        <Send className="h-4 w-4" />
        Envoyer mon avis
      </Button>
    </div>
  );
};

export default ReviewForm;
