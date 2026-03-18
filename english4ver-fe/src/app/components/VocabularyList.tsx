import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Vocabulary } from "../data/mockData";

interface VocabularyListProps {
  vocabularies: Vocabulary[];
}

export function VocabularyList({ vocabularies }: VocabularyListProps) {
  return (
    <div className="space-y-4">
      {vocabularies.map((vocab) => (
        <div
          key={vocab.id}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex gap-6 items-center">
            <div className="w-32 h-32 flex-shrink-0">
              <ImageWithFallback
                src={`https://source.unsplash.com/400x400/?${encodeURIComponent(vocab.imageUrl)}`}
                alt={vocab.english}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Tiếng Anh</p>
                <p className="text-2xl font-bold text-gray-900">{vocab.english}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Tiếng Việt</p>
                <p className="text-xl text-blue-600 font-medium">{vocab.vietnamese}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
