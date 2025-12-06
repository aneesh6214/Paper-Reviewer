/** 
 * Shared types for the results page and its components.
 * These types will be used for backend integration.
 */

/** A single text chunk within a paragraph. If highlightId is present, this chunk is linked to a comment. */
export type TextChunk = {
  text: string;
  highlightId?: string;
};

/** A paragraph is an array of text chunks. */
export type Paragraph = TextChunk[];

/** A feedback/comment item linked to a highlighted portion of text. */
export type FeedbackItem = {
  id: string;
  text: string;
};

/** A score category displayed in the summary. */
export type ScoreCategory = {
  id: string;
  title: string;
  /** If true, displays a numeric score. If false, displays an info icon. */
  isNumeric: boolean;
  /** The numeric score value (only used when isNumeric is true). */
  score?: number;
  /** Description text shown when the category card is expanded. */
  description?: string;
};

/** The complete review response structure (for backend integration). */
export type ReviewResponse = {
  fileName: string;
  grade: string;
  categories: ScoreCategory[];
  paragraphs: Paragraph[];
  feedback: FeedbackItem[];
};

