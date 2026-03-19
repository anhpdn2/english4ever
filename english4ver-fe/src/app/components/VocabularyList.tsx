import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Vocabulary } from "../data/mockData";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface VocabularyListProps {
  vocabularies: Vocabulary[];
}

export function VocabularyList({ vocabularies }: VocabularyListProps) {
  return (
    <div className="space-y-3">
      {vocabularies.map((vocab, index) => (
        <Card key={vocab.id} className="hover:shadow-md transition-shadow overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-stretch gap-0">
              {/* Index */}
              <div className="flex items-center justify-center w-12 bg-muted text-muted-foreground font-bold text-sm flex-shrink-0 border-r">
                {index + 1}
              </div>

              {/* Image */}
              {vocab.imageUrl && (
                <div className="w-24 h-24 flex-shrink-0">
                  <ImageWithFallback
                    src={`https://source.unsplash.com/200x200/?${encodeURIComponent(vocab.imageUrl)}`}
                    alt={vocab.english}
                    className="w-full h-full object-cover border-r"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex flex-1 items-center gap-4 px-5 py-4 min-w-0">
                {/* English */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5 font-medium">Tiếng Anh</p>
                  <p className="text-xl font-bold text-foreground truncate">{vocab.english}</p>
                </div>

                {/* Divider */}
                <div className="w-px h-10 bg-border flex-shrink-0" />

                {/* Vietnamese */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5 font-medium">Tiếng Việt</p>
                  <p className="text-lg font-semibold text-primary truncate">
                    {vocab.vietnamese}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {vocabularies.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          Chưa có từ vựng nào
        </div>
      )}
    </div>
  );
}
