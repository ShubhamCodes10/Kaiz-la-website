export async function getLocalIntent(userMessageContent: string, conversationStage: string): Promise<string> {
  const lowerCaseMessage = userMessageContent.toLowerCase().trim();

  if (lowerCaseMessage.includes('just exploring')) {
    return 'EXPLORING_INTENT';
  }

  const isQuestion = lowerCaseMessage.includes('what') || 
                     lowerCaseMessage.includes('how') || 
                     lowerCaseMessage.includes('where') || 
                     lowerCaseMessage.includes('who') || 
                     lowerCaseMessage.includes('why') || 
                     lowerCaseMessage.includes('when') ||
                     lowerCaseMessage.includes('can you') ||
                     lowerCaseMessage.includes('are you') ||
                     lowerCaseMessage.endsWith('?');

  switch (conversationStage) {
    case 'product':
    case 'region':
    case 'timeline':
      if (lowerCaseMessage.length > 1 && !isQuestion) {
        return 'QUALIFICATION_INTENT';
      }
      break;
    case 'volume':
      if (lowerCaseMessage.match(/(\d+k|\d{1,3}(,\d{3})*|\d+|\d{1,}\s*k)/i) || lowerCaseMessage.includes('hundred') || lowerCaseMessage.includes('thousand') || lowerCaseMessage.includes('million')) {
        return 'QUALIFICATION_INTENT';
      }
      break;
    case 'contact':
      if (lowerCaseMessage.includes('@') || lowerCaseMessage.match(/\b\d{7,}\b/)) {
        return 'QUALIFICATION_INTENT';
      }
      break;
    case 'schedule':
      if (lowerCaseMessage.includes('yes') || lowerCaseMessage.includes('sure') || lowerCaseMessage.includes('ok') || lowerCaseMessage.includes('yeah') || lowerCaseMessage.includes('yup')) {
        return 'QUALIFICATION_INTENT';
      }
      break;
  }
  
  if (isQuestion) {
    return 'GENERAL_QUESTION_INTENT';
  }

  return 'OFF_TOPIC_INTENT';
}