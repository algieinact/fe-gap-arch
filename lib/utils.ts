export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Extract text from PDF file by sending to backend
 */
export async function extractPdfText(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const response = await fetch(`${apiUrl}/extract-pdf`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.data?.text || data.text || "";
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error("Failed to read PDF file. Please ensure it's a valid PDF and try again.");
  }
}
