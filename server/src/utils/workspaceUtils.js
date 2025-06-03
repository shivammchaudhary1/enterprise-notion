import Document from "../models/document.model.js";

async function getWorkspaceContent(query, workspaceId) {
  console.log("workspaceId", workspaceId);
  try {
    // Build query criteria
    let searchCriteria = {
      isDeleted: false,
      "settings.showInSearch": true,
    };

    if (workspaceId) {
      searchCriteria.workspace = workspaceId;
    }

    console.log("searchCriteria", workspaceId);
    // Get documents based on criteria
    const documents = await Document.find(searchCriteria).sort({ position: 1 });

    console.log("documents", documents);

    if (!documents || documents.length === 0) {
      return { content: "", sources: [] };
    }

    // Process content for AI - extract actual text content from document structure
    const allContent = documents.map((doc) => {
      let extractedContent = "";

      if (doc.content && typeof doc.content === "object") {
        if (doc.content.type === "doc" && doc.content.content) {
          extractedContent = extractTextFromContent(doc.content.content);
        }
      } else if (typeof doc.content === "string") {
        extractedContent = doc.content;
      }

      return {
        title: doc.title,
        content: extractedContent,
        metadata: doc.metadata,
        id: doc._id,
      };
    });

    // Simple relevance scoring
    const scoredContent = allContent.map((item) => {
      const score = calculateRelevanceScore(
        query,
        item.content + " " + item.title
      );
      return { ...item, score };
    });

    const relevantContent = scoredContent
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const formattedContent = relevantContent
      .map((item) => `[${item.title}]: ${item.content.substring(0, 1000)}...`)
      .join("\n\n");

    return {
      content: formattedContent,
      sources: relevantContent.map((item) => ({
        title: item.title,
        metadata: item.metadata,
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
    if (!term) return score; // Skip empty terms
    // Escape special regex characters
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const count = (contentLower.match(new RegExp(escapedTerm, "g")) || [])
      .length;
    return score + count;
  }, 0);
}

function extractTextFromContent(contentArray) {
  if (!Array.isArray(contentArray)) return "";

  let text = "";

  for (const node of contentArray) {
    if (node.type === "paragraph" || node.type === "heading") {
      if (node.content && Array.isArray(node.content)) {
        for (const inlineNode of node.content) {
          if (inlineNode.type === "text" && inlineNode.text) {
            text += inlineNode.text + " ";
          }
        }
      }
      text += "\n";
    } else if (node.type === "bulletList" || node.type === "orderedList") {
      if (node.content && Array.isArray(node.content)) {
        for (const listItem of node.content) {
          if (listItem.type === "listItem" && listItem.content) {
            text += "• " + extractTextFromContent(listItem.content) + "\n";
          }
        }
      }
    } else if (node.type === "blockquote") {
      if (node.content) {
        text += "> " + extractTextFromContent(node.content) + "\n";
      }
    } else if (node.type === "codeBlock") {
      if (node.content && Array.isArray(node.content)) {
        for (const codeNode of node.content) {
          if (codeNode.type === "text" && codeNode.text) {
            text += codeNode.text + "\n";
          }
        }
      }
    }
  }

  return text.trim();
}

export { getWorkspaceContent };
