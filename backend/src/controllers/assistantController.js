import ResearchConversation from '../models/ResearchConversation.js';
import ResearchReport from '../models/ResearchReport.js';
import { askAssistantQuestion } from '../services/aiService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const sendAssistantMessage = async (req, res, next) => {
  try {
    const { researchId } = req.params;
    const { message } = req.body;
    const userId = req.user._id;

    const report = await ResearchReport.findById(researchId);
    if (!report) {
      return errorResponse(res, 'Research report not found', 404);
    }

    if (report.userId.toString() !== userId.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'Access denied', 403);
    }

    // Find or create conversation
    let conversation = await ResearchConversation.findOne({ reportId: researchId, userId });
    if (!conversation) {
      conversation = await ResearchConversation.create({
        reportId: researchId,
        userId,
        companyName: report.companyName,
        messages: [],
      });
    }

    // Add user message
    conversation.messages.push({
      sender: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Query AI service with report context
    const aiResponse = await askAssistantQuestion({
      report,
      userQuestion: message,
      conversationHistory: conversation.messages,
      userApiKey: req.user.apiKeys,
    });

    // Add assistant response
    const assistantMsg = {
      sender: 'assistant',
      content: aiResponse.answer,
      citedSources: aiResponse.citedSources,
      timestamp: new Date(),
    };
    conversation.messages.push(assistantMsg);

    await conversation.save();

    return successResponse(
      res,
      {
        message: assistantMsg,
        conversationId: conversation._id,
      },
      'Assistant response generated'
    );
  } catch (error) {
    next(error);
  }
};

export const getConversation = async (req, res, next) => {
  try {
    const { researchId } = req.params;
    const userId = req.user._id;

    const conversation = await ResearchConversation.findOne({ reportId: researchId, userId });
    return successResponse(
      res,
      { conversation: conversation || { reportId: researchId, messages: [] } },
      'Conversation retrieved'
    );
  } catch (error) {
    next(error);
  }
};

