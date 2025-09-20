export async function getTrustBuildingReply(userMessageContent: string): Promise<string | null> {
  const lowerCaseMessage = userMessageContent.toLowerCase();

  if (lowerCaseMessage.includes('quality') || lowerCaseMessage.includes('defects')) {
    return "I understand that quality is a top priority. Our process includes multi-point QA checks at every stage, ensuring products meet your specifications.";
  }
  if (lowerCaseMessage.includes('cost') || lowerCaseMessage.includes('price')) {
    return "We believe in landed cost transparency. Our pricing is clear and includes all fees upfront, so there are no surprises.";
  }
  if (lowerCaseMessage.includes('new') || lowerCaseMessage.includes('first time')) {
    return "I'm glad you're considering us! We offer end-to-end support for new clients, guiding you through every step from initial inquiry to final delivery.";
  }
  return null;
}