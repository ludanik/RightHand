import React, { useState, useEffect } from 'react';
import openAIService from '../services/openAIService';
import './SummaryPage.css';

function SummaryPage({ reviewData, conversationHistory, onApprove, onCancel }) {
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    generateSummary();
  }, []);

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      if (openAIService.isConfigured() && conversationHistory.length > 0) {
        // Use OpenAI to generate a formal summary
        const completion = await openAIService.client.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Create a concise, anonymous course review summary (2-3 sentences) based on the conversation. Make it professional, clear, and helpful for other students.`
            },
            {
              role: 'user',
              content: `Based on this conversation about ${reviewData.course || 'the course'}, create a brief summary review:\n\n${conversationHistory.filter(msg => msg.type === 'user').map(msg => msg.message).join(' ')}`
            }
          ],
          temperature: 0.7,
          max_tokens: 200
        });
        
        const generatedSummary = completion.choices[0]?.message?.content?.trim();
        setSummary(generatedSummary || reviewData.comment || 'No summary available.');
      } else {
        setSummary(reviewData.comment || 'No summary available.');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary(reviewData.comment || 'No summary available.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async () => {
    setIsPosting(true);
    // Add a delay to show posting state
    setTimeout(() => {
      onApprove({
        ...reviewData,
        comment: summary
      });
    }, 500);
  };

  return (
    <div className="summary-page-overlay">
      <div className="summary-page-modal">
        <div className="summary-header">
          <h2>Review Summary</h2>
          <p className="summary-subtitle">Review and approve your anonymous post</p>
        </div>

        <div className="summary-content">
          {isGenerating ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Generating summary...</p>
            </div>
          ) : (
            <div className="summary-preview">
              <div className="preview-card">
                <div className="preview-header">
                  <span className="preview-course">{reviewData.course || 'Course'}</span>
                  <div className="preview-ratings">
                    <span className="rating-badge quality">Quality: {reviewData.quality?.toFixed(1) || 'N/A'}</span>
                    <span className="rating-badge difficulty">Difficulty: {reviewData.difficulty?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
                <p className="preview-comment">{summary}</p>
                <div className="preview-meta">
                  {reviewData.attendance && (
                    <span>Attendance: {reviewData.attendance === 'Yes' ? 'Mandatory' : 'Optional'}</span>
                  )}
                  {reviewData.grade && <span>Grade: {reviewData.grade}</span>}
                  {reviewData.wouldTakeAgain !== null && (
                    <span>Would Take Again: {reviewData.wouldTakeAgain ? 'Yes' : 'No'}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="summary-actions">
          <button
            className="btn-cancel"
            onClick={onCancel}
            disabled={isPosting}
          >
            Cancel
          </button>
          <button
            className="btn-approve"
            onClick={handleApprove}
            disabled={isGenerating || isPosting}
          >
            {isPosting ? 'Posting...' : 'Post Anonymously'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SummaryPage;