import { useState, useCallback } from "react";

export function usePdfText() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const extractPdfText = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    try {
      const pdf2mdModule = await import("@opendocsg/pdf2md");
      const pdf2md = pdf2mdModule.default;
      const arrayBuffer = await file.arrayBuffer();
      const markdown = await pdf2md(arrayBuffer);
      setLoading(false);
      return markdown;
    } catch (err) {
      setError("Failed to extract text from PDF.");
      setLoading(false);
      return null;
    }
  }, []);

  return { extractPdfText, loading, error };
}
