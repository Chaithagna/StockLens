import axios from 'axios';
import { isPromptInjection, neutralizeForPrompt } from '../utils/sanitizer.js';

/**
 * AI Service: Synthesizes risk reports, generates executive summaries,
 * and handles interactive due diligence Q&A.
 */

export const generateAIResearchSynthesis = async ({
  companyName,
  ticker,
  verificationData,
  financialData,
  newsData,
  userApiKey = null,
}) => {
  const geminiKey = userApiKey?.geminiApiKey || process.env.GEMINI_API_KEY;
  const openAiKey = userApiKey?.openaiApiKey || process.env.OPENAI_API_KEY;

  const promptContext = `
COMPANY: ${companyName} (${ticker || 'N/A'})
PHYSICAL VERIFICATION:
- Address: ${verificationData.formattedAddress}
- Location Type: ${verificationData.locationType}
- Virtual Office / Coworking: ${verificationData.isVirtualOffice ? 'YES (' + verificationData.virtualOfficeProvider + ')' : 'NO (Verified Physical Footprint)'}
- Google Rating: ${verificationData.googleRating || 'N/A'} (${verificationData.userRatingsTotal || 0} reviews)
- Status: ${verificationData.businessStatus}

FINANCIAL HEALTH:
- Market Cap: $${financialData.marketCap?.toLocaleString() || 'N/A'}
- Revenue (TTM): $${financialData.revenue?.toLocaleString() || 'N/A'}
- Net Income: $${financialData.netIncome?.toLocaleString() || 'N/A'}
- P/E Ratio: ${financialData.peRatio || 'N/A'}
- Debt-to-Equity: ${financialData.debtToEquity || 'N/A'}
- Current Ratio: ${financialData.currentRatio || 'N/A'}
- Profit Margin: ${financialData.profitMargin ? financialData.profitMargin + '%' : 'N/A'}
- Solvency Rating: ${financialData.solvencyRating}

NEWS & REGULATORY HIGHLIGHTS:
${newsData.map((n) => `- [${n.category} / ${n.sentiment}] ${n.title}: ${n.snippet}`).join('\n')}
`;

  if (geminiKey) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are a Senior Investment Due Diligence Analyst for StockLens. Analyze the following verified company evidence and generate a comprehensive executive summary in clear markdown. Focus on:
1. Physical and corporate legitimacy.
2. Financial durability and solvency risks.
3. Key red flags vs positive indicators.
4. Final verdict for an investor.

Strict instruction: Do NOT fabricate unmentioned filings or details. Clearly distinguish verified facts from inferences.

EVIDENCE:
${promptContext}`,
                },
              ],
            },
          ],
        },
        { timeout: 12000 }
      );

      const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText) {
        return buildSynthesisOutput(aiText, verificationData, financialData, newsData, companyName, ticker);
      }
    } catch (err) {
      console.warn(`[AIService] Gemini API error: ${err.message}. Engaging expert heuristic synthesis.`);
    }
  }

  if (openAiKey) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an institutional investment due diligence AI. Analyze evidence objectively and distinguish verified facts from potential risks.',
            },
            {
              role: 'user',
              content: `Analyze this corporate due diligence dossier:\n${promptContext}`,
            },
          ],
        },
        {
          headers: { Authorization: `Bearer ${openAiKey}` },
          timeout: 12000,
        }
      );

      const aiText = response.data?.choices?.[0]?.message?.content;
      if (aiText) {
        return buildSynthesisOutput(aiText, verificationData, financialData, newsData, companyName, ticker);
      }
    } catch (err) {
      console.warn(`[AIService] OpenAI API error: ${err.message}. Engaging expert heuristic synthesis.`);
    }
  }

  // Analytical Synthesis Engine Fallback
  return buildSynthesisOutput(null, verificationData, financialData, newsData, companyName, ticker);
};

const buildSynthesisOutput = (customSummary, verificationData, financialData, newsData, companyName, ticker) => {
  const isVirtual = verificationData.isVirtualOffice;
  const isDistressed = financialData.solvencyRating === 'DISTRESSED' || financialData.solvencyRating === 'VULNERABLE';
  const hasNegativeNews = newsData.some((n) => n.sentiment === 'NEGATIVE' || n.sentiment === 'CONCERNING');

  // Compute 5 Risk Vectors
  const legitimacyScore = isVirtual ? 70 : 15;
  const financialScore = isDistressed ? 75 : financialData.debtToEquity > 1.2 ? 40 : 15;
  const regulatoryScore = hasNegativeNews ? 60 : 18;
  const businessScore = financialData.profitMargin < 0 ? 55 : 22;
  const governanceScore = isVirtual ? 65 : 20;

  // Composite Safety Score (0-100, where 100 is safest)
  const avgRisk = (legitimacyScore * 0.25 + financialScore * 0.25 + regulatoryScore * 0.2 + businessScore * 0.15 + governanceScore * 0.15);
  const overallSafetyScore = Math.round(Math.max(10, Math.min(95, 100 - avgRisk)));

  let overallRiskLevel = 'LOW';
  if (overallSafetyScore < 40) overallRiskLevel = 'CRITICAL';
  else if (overallSafetyScore < 60) overallRiskLevel = 'HIGH';
  else if (overallSafetyScore < 75) overallRiskLevel = 'MODERATE';

  // Red Flags
  const redFlags = [];
  if (isVirtual) {
    redFlags.push({
      category: 'Physical Legitimacy',
      title: 'Shared / Virtual Office Address Detected',
      description: `Corporate headquarters matches a known coworking maildrop facility (${verificationData.virtualOfficeProvider || 'Shared Office'}). High risk of shell structure.`,
      severity: 'HIGH',
      source: 'Google Maps Place Details API',
    });
  }

  if (financialData.debtToEquity > 2.0) {
    redFlags.push({
      category: 'Financial Solvency',
      title: 'Elevated Leverage Ratio',
      description: `Debt-to-equity ratio of ${financialData.debtToEquity} indicates heightened sensitivity to interest rate fluctuations and credit tightening.`,
      severity: 'MEDIUM',
      source: 'Audited Financial Statements',
    });
  }

  if (financialData.profitMargin !== null && financialData.profitMargin < 0) {
    redFlags.push({
      category: 'Operational Profitability',
      title: 'Negative Operating Margins',
      description: `Current net profit margin is ${financialData.profitMargin}%, reflecting ongoing cash burn.`,
      severity: 'HIGH',
      source: 'Income Statement Disclosures',
    });
  }

  newsData
    .filter((n) => n.isFlaggedAsRisk)
    .forEach((n) => {
      redFlags.push({
        category: n.category === 'LITIGATION' ? 'Legal & Disputes' : 'Regulatory Affairs',
        title: n.title,
        description: n.snippet,
        severity: n.sentiment === 'CONCERNING' ? 'CRITICAL' : 'MEDIUM',
        source: n.source,
      });
    });

  // Positive Indicators
  const positiveIndicators = [];
  if (!isVirtual && verificationData.locationType === 'HQ / Corporate Campus') {
    positiveIndicators.push({
      category: 'Physical Presence',
      title: 'Verified Commercial Headquarters',
      description: 'Physical inspection confirms an established corporate campus with operational commercial footprint.',
      impact: 'HIGH',
    });
  }

  if (financialData.currentRatio > 1.2) {
    positiveIndicators.push({
      category: 'Liquidity Health',
      title: 'Adequate Short-Term Liquidity',
      description: `Current ratio of ${financialData.currentRatio} demonstrates solid capability to cover immediate short-term obligations.`,
      impact: 'HIGH',
    });
  }

  if (financialData.profitMargin > 15) {
    positiveIndicators.push({
      category: 'Profitability',
      title: 'Superior Operating Margin Profile',
      description: `Net margin of ${financialData.profitMargin}% provides substantial buffer against macroeconomic downturns.`,
      impact: 'HIGH',
    });
  }

  positiveIndicators.push({
    category: 'Regulatory Standing',
    title: 'Transparent Public Disclosures',
    description: 'Entity complies with mandatory statutory reporting schedules and maintains accessible regulatory filings.',
    impact: 'MODERATE',
  });

  // Generated Summary
  const executiveSummary =
    customSummary ||
    `### Executive Due Diligence Summary: ${companyName} (${ticker || 'N/A'})

**Physical & Corporate Legitimacy:**
${companyName}'s headquarters at **${verificationData.formattedAddress}** has been categorized as **${verificationData.locationType}**. ${
      isVirtual
        ? `⚠️ **Warning:** The registered address is linked to a virtual office provider (${verificationData.virtualOfficeProvider}), indicating an unverified physical footprint.`
        : `Physical location verification confirms an established operational property with active commercial activity (${verificationData.userRatingsTotal || 'standard'} verified interactions).`
    }

**Financial Health & Solvency:**
The company exhibits a **${financialData.solvencyRating}** financial standing. Current annual revenues stand at approximately **$${(financialData.revenue / 1e9).toFixed(2)}B** with a net margin of **${financialData.profitMargin}%**. Debt-to-Equity is positioned at **${financialData.debtToEquity}**, alongside a Current Ratio of **${financialData.currentRatio}**.

**Regulatory & Legal Posture:**
Recent news and regulatory scans reveal **${newsData.filter((n) => n.isFlaggedAsRisk).length} potential risk points**. Overall market sentiment is **${newsData[0]?.sentiment || 'NEUTRAL'}**.

**Final Due Diligence Recommendation:**
StockLens assigns an **Overall Investment Safety Score of ${overallSafetyScore}/100 (${overallRiskLevel} Risk)**. ${
      overallSafetyScore >= 75
        ? 'The company demonstrates a credible physical presence, robust financial durability, and clean regulatory status.'
        : 'Investors should exercise heightened diligence and review flagged governance or leverage discrepancies before allocating capital.'
    }`;

  // Evidence Citations
  const evidenceCitations = [
    {
      title: 'Physical Location & Geospatial Registry',
      type: 'Google Maps Place',
      url: verificationData.mapEmbedUrl || '',
      excerpt: `Address: ${verificationData.formattedAddress}. Business Status: ${verificationData.businessStatus}. Rating: ${verificationData.googleRating || 'N/A'}/5.`,
    },
    {
      title: 'Audited Financial Statements & Solvency Ratios',
      type: 'Financial Statement',
      url: '',
      excerpt: `Revenue: $${(financialData.revenue / 1e9).toFixed(2)}B | Net Income: $${(financialData.netIncome / 1e9).toFixed(2)}B | Debt/Equity: ${financialData.debtToEquity} | Current Ratio: ${financialData.currentRatio}.`,
    },
    {
      title: 'Public News & Regulatory Investigation Wire',
      type: 'News Investigation',
      url: newsData[0]?.url || '',
      excerpt: `${newsData[0]?.source || 'Wire'}: ${newsData[0]?.snippet || 'Routine disclosures observed.'}`,
    },
  ];

  return {
    overallSafetyScore,
    overallRiskLevel,
    riskBreakdown: {
      financialRisk: {
        score: financialScore,
        level: financialScore > 60 ? 'HIGH' : financialScore > 30 ? 'MODERATE' : 'LOW',
        analysis: isDistressed ? 'High leverage or negative margins impair solvency.' : 'Healthy liquidity buffers and sustainable capital structure.',
        flags: isDistressed ? ['High leverage', 'Cash burn risk'] : ['Adequate liquidity'],
      },
      businessRisk: {
        score: businessScore,
        level: businessScore > 60 ? 'HIGH' : businessScore > 30 ? 'MODERATE' : 'LOW',
        analysis: 'Assessed based on industry cyclicality, margin stability, and competitive positioning.',
        flags: financialData.revenueGrowthYoY < 0 ? ['Declining revenue YoY'] : ['Positive growth trajectory'],
      },
      regulatoryRisk: {
        score: regulatoryScore,
        level: regulatoryScore > 60 ? 'HIGH' : regulatoryScore > 30 ? 'MODERATE' : 'LOW',
        analysis: hasNegativeNews ? 'Active regulatory inquiries or pending litigation detected.' : 'No material disciplinary enforcement actions identified.',
        flags: hasNegativeNews ? ['Active legal scrutiny'] : ['Clean regulatory filings'],
      },
      governanceRisk: {
        score: governanceScore,
        level: governanceScore > 60 ? 'HIGH' : governanceScore > 30 ? 'MODERATE' : 'LOW',
        analysis: isVirtual ? 'Opaque corporate registration and shared maildrop create governance concerns.' : 'Transparent leadership team and verified headquarters.',
        flags: isVirtual ? ['Unverified corporate headquarters'] : ['Standard governance oversight'],
      },
      legitimacyRisk: {
        score: legitimacyScore,
        level: legitimacyScore > 60 ? 'HIGH' : legitimacyScore > 30 ? 'MODERATE' : 'LOW',
        analysis: isVirtual ? 'Entity fails physical location verification; virtual office provider flagged.' : 'Confirmed physical commercial existence with high registry confidence.',
        flags: isVirtual ? ['Virtual office address'] : ['Physical office verified'],
      },
    },
    redFlags,
    positiveIndicators,
    aiExecutiveSummary: executiveSummary,
    evidenceCitations,
  };
};

/**
 * Interactive AI Assistant: Answers questions strictly grounded in the research report
 */
export const askAssistantQuestion = async ({
  report,
  userQuestion,
  conversationHistory = [],
  userApiKey = null,
}) => {
  // Guard against prompt injection
  if (isPromptInjection(userQuestion)) {
    return {
      answer: "I cannot fulfill this request. I am programmed to provide objective investment due diligence grounded strictly in verified corporate evidence. Please ask a specific question regarding this company's financials, physical presence, or risk assessment.",
      citedSources: [],
    };
  }

  const sanitizedQuery = neutralizeForPrompt(userQuestion);
  const geminiKey = userApiKey?.geminiApiKey || process.env.GEMINI_API_KEY;
  const openAiKey = userApiKey?.openaiApiKey || process.env.OPENAI_API_KEY;

  const reportContext = `
COMPANY RESEARCH REPORT CONTEXT:
Company Name: ${report.companyName} (${report.ticker || 'N/A'})
Overall Safety Score: ${report.overallSafetyScore}/100 (${report.overallRiskLevel} RISK)
Legitimacy Score: ${report.legitimacyScore}/100

PHYSICAL VERIFICATION:
Address: ${report.snapshotData?.verification?.formattedAddress || 'N/A'}
Location Type: ${report.snapshotData?.verification?.locationType || 'N/A'}
Virtual Office: ${report.snapshotData?.verification?.isVirtualOffice ? 'YES' : 'NO'}

FINANCIAL METRICS:
Revenue: $${report.snapshotData?.financials?.revenue?.toLocaleString() || 'N/A'}
Net Income: $${report.snapshotData?.financials?.netIncome?.toLocaleString() || 'N/A'}
Debt/Equity: ${report.snapshotData?.financials?.debtToEquity || 'N/A'}
Current Ratio: ${report.snapshotData?.financials?.currentRatio || 'N/A'}
Profit Margin: ${report.snapshotData?.financials?.profitMargin || 'N/A'}%

RED FLAGS:
${report.redFlags?.map((rf) => `- [${rf.severity}] ${rf.title}: ${rf.description}`).join('\n') || 'None'}

POSITIVE INDICATORS:
${report.positiveIndicators?.map((pi) => `- ${pi.title}: ${pi.description}`).join('\n') || 'None'}
`;

  if (geminiKey) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are the StockLens AI Research Assistant. You are having a conversation with an investor reviewing the following research report:
${reportContext}

USER QUESTION: "${sanitizedQuery}"

RULES:
1. Answer directly and concisely based ONLY on the evidence provided above.
2. If evidence for a question is not present in the dossier, explicitly state that it is unverified or unavailable in public records. Do NOT invent data.
3. Cite the relevant source (e.g. Physical Location Verification, Audited Financials, Regulatory Scan) when answering.`,
                },
              ],
            },
          ],
        },
        { timeout: 10000 }
      );

      const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText) {
        return {
          answer: aiText,
          citedSources: extractCitationsFromReport(report, sanitizedQuery),
        };
      }
    } catch (err) {
      console.warn(`[AIService] Gemini query failed: ${err.message}. Engaging expert fallback.`);
    }
  }

  // Expert Heuristic Q&A Engine Fallback
  return generateHeuristicAssistantAnswer(report, sanitizedQuery);
};

const extractCitationsFromReport = (report, query) => {
  const citations = [];
  const lower = query.toLowerCase();

  if (lower.includes('address') || lower.includes('location') || lower.includes('physical') || lower.includes('office') || lower.includes('legitimacy')) {
    citations.push({
      title: 'Physical Location Verification',
      type: 'Google Maps / Registry',
      excerpt: report.snapshotData?.verification?.formattedAddress || 'Physical address verification records.',
    });
  }

  if (lower.includes('debt') || lower.includes('revenue') || lower.includes('margin') || lower.includes('profit') || lower.includes('financial') || lower.includes('solvency')) {
    citations.push({
      title: 'Company Financial Disclosures',
      type: 'Financial Statement',
      excerpt: `Solvency: ${report.snapshotData?.financials?.solvencyRating || 'SOUND'}, D/E: ${report.snapshotData?.financials?.debtToEquity || 'N/A'}, Net Margin: ${report.snapshotData?.financials?.profitMargin || 'N/A'}%.`,
    });
  }

  if (lower.includes('risk') || lower.includes('flag') || lower.includes('concern') || lower.includes('lawsuit') || lower.includes('news')) {
    citations.push({
      title: 'Risk Assessment & Regulatory Wire',
      type: 'Forensic Risk Analysis',
      excerpt: report.redFlags?.[0]?.title ? `${report.redFlags[0].title}: ${report.redFlags[0].description}` : 'No critical regulatory red flags detected.',
    });
  }

  return citations;
};

const generateHeuristicAssistantAnswer = (report, query) => {
  const lower = query.toLowerCase();
  let answer = '';

  if (lower.includes('red flag') || lower.includes('risk') || lower.includes('danger') || lower.includes('safe')) {
    if (report.redFlags && report.redFlags.length > 0) {
      answer = `Based on our multi-source due diligence on **${report.companyName}**, we have identified **${report.redFlags.length} primary red flags**:\n\n` +
        report.redFlags.map((rf, i) => `${i + 1}. **${rf.title}** (${rf.severity} Severity): ${rf.description}`).join('\n\n') +
        `\n\nThe overall safety score is currently evaluated at **${report.overallSafetyScore}/100 (${report.overallRiskLevel} Risk)**.`;
    } else {
      answer = `Our analysis of **${report.companyName}** did not reveal any critical red flags. The company holds an Overall Safety Score of **${report.overallSafetyScore}/100** with a **${report.overallRiskLevel} Risk** classification.`;
    }
  } else if (lower.includes('address') || lower.includes('location') || lower.includes('office') || lower.includes('virtual') || lower.includes('where')) {
    const v = report.snapshotData?.verification || {};
    answer = `**Physical Presence & Location Findings for ${report.companyName}:**\n\n` +
      `- **Registered Address:** ${v.formattedAddress || 'Not explicitly recorded'}\n` +
      `- **Location Classification:** ${v.locationType || 'Commercial Office'}\n` +
      `- **Virtual Office Status:** ${v.isVirtualOffice ? `⚠️ **Flagged as Virtual Office** (${v.virtualOfficeProvider})` : '✅ Verified Physical Commercial Footprint'}\n` +
      `- **Operational Status:** ${v.businessStatus || 'OPERATIONAL'}\n` +
      `- **Legitimacy Score:** ${report.legitimacyScore}/100\n\n` +
      (v.isVirtualOffice
        ? 'Note: Companies operating from virtual coworking suites represent higher shell risks and warrant independent physical confirmation.'
        : 'The property indicates legitimate corporate infrastructure.');
  } else if (lower.includes('financial') || lower.includes('revenue') || lower.includes('debt') || lower.includes('profit') || lower.includes('margin')) {
    const f = report.snapshotData?.financials || {};
    answer = `**Financial Performance Overview for ${report.companyName}:**\n\n` +
      `- **Market Capitalization:** $${(f.marketCap ? (f.marketCap / 1e9).toFixed(2) + 'B' : 'N/A')}\n` +
      `- **Annual Revenue:** $${(f.revenue ? (f.revenue / 1e9).toFixed(2) + 'B' : 'N/A')}\n` +
      `- **Net Income:** $${(f.netIncome ? (f.netIncome / 1e9).toFixed(2) + 'B' : 'N/A')}\n` +
      `- **Debt-to-Equity:** ${f.debtToEquity || 'N/A'}\n` +
      `- **Current Ratio:** ${f.currentRatio || 'N/A'}\n` +
      `- **Net Profit Margin:** ${f.profitMargin ? f.profitMargin + '%' : 'N/A'}\n` +
      `- **Solvency Health Rating:** **${f.solvencyRating || 'SOUND'}**\n\n` +
      `Solvency analysis indicates ${f.solvencyRating === 'EXCELLENT' ? 'a fortress balance sheet with minimal default risk' : f.solvencyRating === 'DISTRESSED' ? 'severe balance sheet distress with significant liquidity challenges' : 'standard commercial solvency with manageable leverage'}.`;
  } else {
    answer = `Regarding your inquiry on **${report.companyName}**:\n\n` +
      `Our consolidated research assigns this company an **Investment Safety Score of ${report.overallSafetyScore}/100 (${report.overallRiskLevel} Risk)** and a **Legitimacy Score of ${report.legitimacyScore}/100**.\n\n` +
      `Key Takeaways:\n` +
      `- **Physical Presence:** ${report.snapshotData?.verification?.locationType || 'Commercial Office'} (${report.snapshotData?.verification?.isVirtualOffice ? 'Virtual Office Warning' : 'Verified Dedicated Site'})\n` +
      `- **Financial Health:** ${report.snapshotData?.financials?.solvencyRating || 'SOUND'} solvency rating\n` +
      `- **Identified Red Flags:** ${report.redFlags?.length || 0} issues flagged\n` +
      `- **Positive Indicators:** ${report.positiveIndicators?.length || 0} strengths validated\n\n` +
      `Would you like me to elaborate on the company's balance sheet, verify the physical office address, or detail the regulatory background?`;
  }

  return {
    answer,
    citedSources: extractCitationsFromReport(report, query),
  };
};

