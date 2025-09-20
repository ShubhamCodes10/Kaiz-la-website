export function getQualificationQuestion(stage: string): string {
  switch (stage) {
    case 'product': return "To continue, could you tell me what product you are looking to source?";
    case 'volume': return "And what's the expected order volume for this product?";
    case 'region': return "Which region are you looking to source from? For example, Asia, Europe, or North America.";
    case 'timeline': return "What is your sourcing timeline? Are you looking for a quick turnaround or a long-term plan?";
    case 'contact': return "Could you please provide your name, company, and email or phone number so we can get in touch?";
    default: return "To get started with your sourcing needs, please tell me what product you are looking to source?";
  }
}