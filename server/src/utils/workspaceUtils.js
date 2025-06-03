import mongoose from "mongoose";

const Document = mongoose.model("Document");

async function getWorkspaceContent(query) {
  try {
    // Get all documents that are not deleted
    const documents = await Document.find({
      isDeleted: false,
      settings: { showInSearch: true },
    });

    // Process content for AI
    const allContent = documents.map((doc) => ({
      title: doc.title,
      content:
        typeof doc.content === "object"
          ? JSON.stringify(doc.content)
          : doc.content,
      id: doc._id,
    }));

    // Simple relevance scoring based on keyword matching
    const scoredContent = allContent.map((item) => {
      const score = calculateRelevanceScore(
        query,
        item.content + " " + item.title
      );
      return { ...item, score };
    });

    // Sort by relevance and take top results
    const relevantContent = scoredContent
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Format content for the AI
    const formattedContent = relevantContent
      .map((item) => `[${item.title}]: ${item.content.substring(0, 1000)}...`)
      .join("\n\n");

    return {
      content: formattedContent,
      sources: relevantContent.map((item) => ({
        title: item.title,
        link: `/documents/${item.id}`,
      })),
    };
  } catch (error) {
    console.error("Error retrieving workspace content:", error);
    return { content: "", sources: [] };
  }
}

function calculateRelevanceScore(query, content) {
  const queryTerms = query.toLowerCase().split(" ");
  const contentLower = content.toLowerCase();

  return queryTerms.reduce((score, term) => {
    const count = (contentLower.match(new RegExp(term, "g")) || []).length;
    return score + count;
  }, 0);
}

export { getWorkspaceContent };
