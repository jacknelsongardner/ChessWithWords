// Slideshow.tsx
import { useState } from "react";

interface Slide {
  image: string;
  text: string;
}

interface SlideshowProps {
  slides: Slide[];
  onFinish: () => void;
}

function Slideshow({ slides, onFinish }: SlideshowProps) {
  const [index, setIndex] = useState(0);

  const isLast = index === slides.length - 1;
  const isFirst = index === 0;

  return (
    <div className="flex flex-col items-center text-center">
      {/* Image */}
      <img
        src={slides[index]!.image}
        alt={`Slide ${index + 1}`}
        className="max-h-64 object-contain rounded-lg shadow mb-4"
      />

      {/* Text */}
      <p className="text-gray-800 mb-6">{slides[index]!.text}</p>

      {/* Navigation buttons */}
      <div className="flex justify-between w-full gap-2">
        {!isFirst && (
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg"
            onClick={() => setIndex((i) => i - 1)}
          >
            Back
          </button>
        )}

        {!isLast && (
          <button
            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => setIndex((i) => i + 1)}
          >
            Next
          </button>
        )}

        {isLast && (
          <button
            className="ml-auto px-4 py-2 bg-green-600 text-white rounded-lg"
            onClick={onFinish}
          >
            Finish
          </button>
        )}
      </div>
    </div>
  );
};

export {Slideshow}