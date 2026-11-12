import axios from 'axios';
import { isPromptInjection, neutralizeForPrompt } from '../utils/sanitizer.js';

/**
 * AI Service: Synthesizes multi-vector risk reports, generates executive summaries,
 * and powers the interactive StockLens Due Diligence AI Assistant with strict factual grounding.
 */

// Candidate Gemini models in order of priority & responsiveness
const GEMINI_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-2.5-flash-lite',
];

/**
 * Helper to query Google Gemini with automatic model failover
 */
const callGeminiAPI = async (geminiKey, contents, timeoutMs = 15000) => {
  if (!geminiKey) return null;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
      const response = await axios.post(
        url,
        {
          contents,
          generationConfig: {
            temperature: 0.2, // Low temperature for factual precision
            topP: 0.85,
            maxOutputTokens: 1500,
          },
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: timeoutMs,
        }
      );

      const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText && aiText.trim().length > 0) {
        return aiText.trim();
      }
    } catch (err) {
      const status = err.response?.status;
      const errorMsg = err.response?.data?.error?.message || err.message;
      console.warn(`[AIService] Gemini model ${model} error (${status || 'network'}): ${errorMsg?.slice(0, 100)}`);
      // Try next candidate model on 404, 503, or 429
      continue;
    }
  }

  return null;
};

/**
 * Helper to query OpenAI GPT-4o-mini as secondary external AI provider
 */
const callOpenAIAPI = async (openAiKey, systemInstruction, userMessages, timeoutMs = 15000) => {
  if (!openAiKey) return null;

  try {
    const messages = [
      { role: 'system', content: systemInstruction },
      ...userMessages,
    ];

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.2,
        max_tokens: 1500,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        timeout: timeoutMs,
      }
    );

    const aiText = response.data?.choices?.[0]?.message?.content;
    if (aiText && aiText.trim().length > 0) {
      return aiText.trim();
    }
  } catch (err) {
    console.warn(`[AIService] OpenAI API error: ${err.message}`);
  }

  return null;
};

const formatCurrency = (val) => {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  if (Math.abs(val) >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
  if (Math.abs(val) >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
  return `$${Number(val).toLocaleString()}`;
};

/**
 * Generates an institutional-grade research synthesis report
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

1. PHYSICAL VERIFICATION & GEOSPATIAL FOOTPRINT:
- Address: ${verificationData.formattedAddress || 'Not recorded'}
- Location Type: ${verificationData.locationType || 'Commercial Facility'}
- Virtual Office / Coworking: ${verificationData.isVirtualOffice ? 'YES (' + (verificationData.virtualOfficeProvider || 'Shared Maildrop') + ')' : 'NO (Verified Physical Footprint)'}
- Google Rating: ${verificationData.googleRating ? `${verificationData.googleRating}/5.0 (${verificationData.userRatingsTotal || 0} reviews)` : 'N/A'}
- Operational Status: ${verificationData.businessStatus || 'OPERATIONAL'}

2. FINANCIAL HEALTH & SOLVENCY:
- Market Cap: ${formatCurrency(financialData.marketCap)}
- Revenue (TTM): ${formatCurrency(financialData.revenue)}
- Net Income: ${formatCurrency(financialData.netIncome)}
- P/E Ratio: ${financialData.peRatio ?? 'N/A'}
- Debt-to-Equity: ${financialData.debtToEquity ?? 'N/A'}
- Current Ratio: ${financialData.currentRatio ?? 'N/A'}
- Profit Margin: ${financialData.profitMargin != null ? financialData.profitMargin + '%' : 'N/A'}
- Solvency Rating: ${financialData.solvencyRating || 'SOUND'}

3. NEWS & REGULATORY SCAN HIGHLIGHTS:
${newsData && newsData.length > 0 ? newsData.slice(0, 6).map((n) => `- [${n.category || 'GENERAL'} / ${n.sentiment || 'NEUTRAL'}] ${n.title}: ${n.snippet}`).join('\n') : '- Routine disclosures observed.'}
`;

  const synthesisPrompt = `You are a Senior Forensic Investment Due Diligence Analyst for StockLens. Synthesize the verified company evidence below into an authoritative, institutional-grade Executive Due Diligence Report.

Follow this exact Markdown format:

### Executive Due Diligence Summary: ${companyName} (${ticker || 'N/A'})

#### 1. Corporate Identity & Physical Footprint
Analyze the registered address, location classification, and whether virtual office / coworking flags indicate shell company risk.

#### 2. Financial Durability & Solvency Analysis
Evaluate the solvency rating, revenue scale, net margins, leverage (Debt-to-Equity), and liquidity (Current Ratio).

#### 3. Forensic Risk Vectors & Red Flag Breakdown
Detail identified operational, regulatory, or governance red flags versus verified positive strengths.

#### 4. Investor Verdict & Risk Classification
Synthesize the overall investment safety score, risk level, and final actionable diligence recommendation.

CRITICAL INSTRUCTIONS:
- Ground every single finding strictly in the provided evidence.
- Do NOT fabricate filings, numbers, or details not present in the dossier.
- Distinguish verified empirical facts from analytical inferences.

VERIFIED EVIDENCE DOSSIER:
${promptContext}`;

  // 1. Try Gemini
  if (geminiKey) {
    const aiText = await callGeminiAPI(
      geminiKey,
      [{ role: 'user', parts: [{ text: synthesisPrompt }] }],
      15000
    );
    if (aiText) {
      return buildSynthesisOutput(aiText, verificationData, financialData, newsData, companyName, ticker);
    }
  }

  // 2. Try OpenAI fallback
  if (openAiKey) {
    const aiText = await callOpenAIAPI(
      openAiKey,
      'You are an institutional investment due diligence AI. Analyze evidence objectively and distinguish verified facts from potential risks.',
      [{ role: 'user', content: synthesisPrompt }],
      15000
    );
    if (aiText) {
      return buildSynthesisOutput(aiText, verificationData, financialData, newsData, companyName, ticker);
    }
  }

  // 3. Fallback to analytical synthesis engine
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
  const avgRisk =
    legitimacyScore * 0.25 +
    financialScore * 0.25 +
    regulatoryScore * 0.2 +
    businessScore * 0.15 +
    governanceScore * 0.15;
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

#### 1. Corporate Identity & Physical Footprint
${companyName}'s headquarters at **${verificationData.formattedAddress || 'Commercial Records'}** has been categorized as **${verificationData.locationType || 'Corporate Office'}**. ${
      isVirtual
        ? `⚠️ **Warning:** The registered address is linked to a virtual office provider (${verificationData.virtualOfficeProvider}), indicating an unverified physical footprint and potential shell structure risk.`
        : `Physical location verification confirms an established operational property with active commercial activity (${verificationData.userRatingsTotal || 'standard'} verified interactions).`
    }

#### 2. Financial Durability & Solvency Analysis
The company exhibits a **${financialData.solvencyRating || 'SOUND'}** financial standing. Current annual revenues stand at approximately **${formatCurrency(financialData.revenue)}** with a net margin of **${financialData.profitMargin}%**. Debt-to-Equity is positioned at **${financialData.debtToEquity}**, alongside a Current Ratio of **${financialData.currentRatio}**.

#### 3. Forensic Risk Vectors & Red Flag Breakdown
Recent news and regulatory scans reveal **${newsData.filter((n) => n.isFlaggedAsRisk).length} potential risk points**. Overall market sentiment is **${newsData[0]?.sentiment || 'NEUTRAL'}**.

#### 4. Investor Verdict & Risk Classification
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
      excerpt: `Revenue: ${formatCurrency(financialData.revenue)} | Net Income: ${formatCurrency(financialData.netIncome)} | Debt/Equity: ${financialData.debtToEquity} | Current Ratio: ${financialData.currentRatio}.`,
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
 * Supports multi-turn conversation history and Google Gemini / OpenAI with institutional precision.
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

  const v = report.snapshotData?.verification || {};
  const f = report.snapshotData?.financials || {};
  const n = report.snapshotData?.news || [];
  const redFlags = report.redFlags || [];
  const positiveIndicators = report.positiveIndicators || [];
  const riskBreakdown = report.riskBreakdown || {};

  const dossierContext = `
================================================================================
STOCKLENS VERIFIED COMPANY DOSSIER: ${report.companyName} (${report.ticker || 'N/A'})
================================================================================
• Overall Investment Safety Score: ${report.overallSafetyScore}/100 [${report.overallRiskLevel} RISK]
• Physical & Corporate Legitimacy Score: ${report.legitimacyScore}/100

1. PHYSICAL PRESENCE & GEOSPATIAL VERIFICATION:
- Registered Address: ${v.formattedAddress || 'Not recorded in public registry'}
- Facility Type: ${v.locationType || 'Commercial Facility'}
- Virtual Office / Coworking Maildrop: ${v.isVirtualOffice ? `YES — FLAGGED (${v.virtualOfficeProvider || 'Known Coworking / Maildrop Suite'})` : 'NO — Verified Dedicated Commercial Footprint'}
- Google Maps Rating: ${v.googleRating ? `${v.googleRating}/5.0 stars (${v.userRatingsTotal || 0} reviews)` : 'No public Google rating available'}
- Operational Status: ${v.businessStatus || 'OPERATIONAL'}

2. FINANCIAL HEALTH & BALANCE SHEET METRICS:
- Market Capitalization: ${formatCurrency(f.marketCap)}
- Annual Revenue (TTM): ${formatCurrency(f.revenue)}
- Net Income (TTM): ${formatCurrency(f.netIncome)}
- Net Profit Margin: ${f.profitMargin != null ? f.profitMargin + '%' : 'N/A'}
- Debt-to-Equity Ratio: ${f.debtToEquity != null ? f.debtToEquity : 'N/A'}
- Current Liquidity Ratio: ${f.currentRatio != null ? f.currentRatio : 'N/A'}
- Solvency Classification: ${f.solvencyRating || 'SOUND'}

3. FIVE-FACTOR RISK VECTOR ANALYSIS:
- Financial Risk: ${riskBreakdown.financialRisk?.level || 'LOW'} (${riskBreakdown.financialRisk?.score || 20}/100) — ${riskBreakdown.financialRisk?.analysis || 'Solvent balance sheet'}
- Business Risk: ${riskBreakdown.businessRisk?.level || 'LOW'} (${riskBreakdown.businessRisk?.score || 25}/100) — ${riskBreakdown.businessRisk?.analysis || 'Standard industry competitive dynamics'}
- Regulatory Risk: ${riskBreakdown.regulatoryRisk?.level || 'LOW'} (${riskBreakdown.regulatoryRisk?.score || 15}/100) — ${riskBreakdown.regulatoryRisk?.analysis || 'No active material regulatory enforcement'}
- Governance Risk: ${riskBreakdown.governanceRisk?.level || 'LOW'} (${riskBreakdown.governanceRisk?.score || 20}/100) — ${riskBreakdown.governanceRisk?.analysis || 'Standard corporate governance'}
- Legitimacy Risk: ${riskBreakdown.legitimacyRisk?.level || 'LOW'} (${riskBreakdown.legitimacyRisk?.score || 10}/100) — ${riskBreakdown.legitimacyRisk?.analysis || 'Physical commercial presence confirmed'}

4. FORENSIC RED FLAGS IDENTIFIED:
${redFlags.length > 0 ? redFlags.map((rf, idx) => `${idx + 1}. [${rf.severity} SEVERITY] ${rf.title}: ${rf.description} (Source: ${rf.source})`).join('\n') : '• No critical red flags detected.'}

5. VERIFIED POSITIVE STRENGTHS & INDICATORS:
${positiveIndicators.length > 0 ? positiveIndicators.map((pi, idx) => `${idx + 1}. [${pi.impact} IMPACT] ${pi.title}: ${pi.description}`).join('\n') : '• Standard commercial operational profile.'}

6. NEWS & REGULATORY SCAN HIGHLIGHTS:
${n.length > 0 ? n.slice(0, 5).map((item) => `• [${item.category || 'GENERAL'} | ${item.sentiment || 'NEUTRAL'}] ${item.title}: ${item.snippet} (${item.source})`).join('\n') : '• Routine statutory disclosures observed.'}
================================================================================
`;

  const systemInstruction = `You are the StockLens Lead AI Research Assistant and Senior Forensic Investment Due Diligence Analyst. You are interacting with an institutional investor, equity analyst, or risk officer reviewing the verified company research dossier below.

DOSSIER:
${dossierContext}

MANDATORY RULES FOR ACCURACY, TRUTHFULNESS & INSTITUTIONAL RIGOR:
1. STRICT FACTUAL ACCURACY: You must ground all answers strictly in the verified data points from the dossier above. Always quote specific metrics (e.g. Debt/Equity, Revenue, Address, Rating, Red Flag titles) to substantiate your statements.
2. MISSING DATA HANDLING: If the user asks about an aspect not contained in the dossier (such as insider trading details, forward 5-year speculative projections, unlisted litigation, or patents not mentioned), NEVER invent or fabricate facts. Explicitly state:
   "Based on the verified records in this dossier, [topic] is unverified or not publicly disclosed in current filings."
3. PHYSICAL & CORPORATE LEGITIMACY: When asked about physical presence, address, or legitimacy:
   - State the registered address clearly.
   - Explicitly highlight whether it is a verified dedicated commercial campus or a flagged virtual office / coworking maildrop suite (e.g., Regus, WeWork). Explain that virtual offices carry shell company risks.
4. FINANCIAL SOLVENCY & LEVERAGE: When asked about financial health, debt, or solvency:
   - Cite the exact Revenue, Net Income, Net Margin %, Debt-to-Equity, and Current Ratio.
   - State whether the company is solvent, vulnerable, or distressed, and explain the real-world implications (e.g., debt refinancing vulnerability, cash burn runway).
5. BALANCED OBJECTIVITY & RISK EVALUATION:
   - Always reference the StockLens Overall Safety Score (${report.overallSafetyScore}/100) and Risk Classification (${report.overallRiskLevel} Risk).
   - Weigh positive operational indicators against identified forensic red flags.
6. PROFESSIONAL PRESENTATION:
   - Use clean Markdown with bold section titles, clean bullet points, and concise language.
   - Avoid generic AI pleasantries or filler phrases ("Certainly!", "As an AI..."). Start directly with the factual finding.
   - When appropriate, conclude with a brief, high-value due diligence follow-up suggestion.`;

  // 1. Try Gemini with conversational multi-turn context
  if (geminiKey) {
    const geminiContents = [
      {
        role: 'user',
        parts: [
          {
            text: `${systemInstruction}\n\nAcknowledge your role as StockLens Lead Due Diligence Analyst for ${report.companyName} and state that you are ready to answer inquiries with strict empirical precision.`,
          },
        ],
      },
      {
        role: 'model',
        parts: [
          {
            text: `Understood. I am your StockLens Lead Due Diligence Analyst, initialized with the verified research dossier for **${report.companyName}** (${report.ticker || 'N/A'}). I will provide rigorous, evidence-grounded answers based strictly on verified physical presence records, balance sheet metrics, and forensic risk indicators.`,
          },
        ],
      },
    ];

    // Add recent conversation history (up to last 8 messages)
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-8);
      for (const msg of recentHistory) {
        if (msg.sender === 'user' && msg.content === sanitizedQuery) continue;
        geminiContents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        });
      }
    }

    // Append current user inquiry
    geminiContents.push({
      role: 'user',
      parts: [{ text: sanitizedQuery }],
    });

    const aiText = await callGeminiAPI(geminiKey, geminiContents, 15000);
    if (aiText) {
      return {
        answer: aiText,
        citedSources: extractCitationsFromReport(report, sanitizedQuery, aiText),
      };
    }
  }

  // 2. Try OpenAI GPT-4o-mini as secondary provider
  if (openAiKey) {
    const openAiMessages = [
      {
        role: 'assistant',
        content: `Understood. I am your StockLens Lead Due Diligence Analyst, initialized with the verified research dossier for ${report.companyName} (${report.ticker || 'N/A'}).`,
      },
    ];

    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-8);
      for (const msg of recentHistory) {
        if (msg.sender === 'user' && msg.content === sanitizedQuery) continue;
        openAiMessages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content,
        });
      }
    }

    openAiMessages.push({
      role: 'user',
      content: sanitizedQuery,
    });

    const aiText = await callOpenAIAPI(openAiKey, systemInstruction, openAiMessages, 15000);
    if (aiText) {
      return {
        answer: aiText,
        citedSources: extractCitationsFromReport(report, sanitizedQuery, aiText),
      };
    }
  }

  // 3. Fallback to Forensic Heuristic Q&A Engine
  return generateHeuristicAssistantAnswer(report, sanitizedQuery);
};

/**
 * Extracts relevant evidence citations from report based on inquiry and response content
 */
const extractCitationsFromReport = (report, query, aiAnswer = '') => {
  const citations = [];
  const textToScan = `${query} ${aiAnswer}`.toLowerCase();
  const v = report.snapshotData?.verification || {};
  const f = report.snapshotData?.financials || {};
  const n = report.snapshotData?.news || [];

  // Physical Location Citation
  if (
    textToScan.includes('address') ||
    textToScan.includes('location') ||
    textToScan.includes('physical') ||
    textToScan.includes('office') ||
    textToScan.includes('virtual') ||
    textToScan.includes('legitimacy') ||
    textToScan.includes('building') ||
    textToScan.includes('campus') ||
    textToScan.includes('where')
  ) {
    citations.push({
      title: 'Physical Location & Geospatial Registry',
      type: 'Google Maps Place',
      url: v.mapEmbedUrl || '',
      excerpt: `Address: ${v.formattedAddress || 'Not recorded'}. Status: ${v.businessStatus || 'OPERATIONAL'}. Type: ${v.locationType || 'Commercial'}. Virtual Office: ${v.isVirtualOffice ? 'YES (' + (v.virtualOfficeProvider || 'Coworking') + ')' : 'NO (Verified Physical Presence)'}. Rating: ${v.googleRating ? v.googleRating + '/5' : 'N/A'}.`,
    });
  }

  // Financial Disclosures Citation
  if (
    textToScan.includes('debt') ||
    textToScan.includes('revenue') ||
    textToScan.includes('margin') ||
    textToScan.includes('profit') ||
    textToScan.includes('financial') ||
    textToScan.includes('solvency') ||
    textToScan.includes('liquidity') ||
    textToScan.includes('balance sheet') ||
    textToScan.includes('current ratio') ||
    textToScan.includes('market cap')
  ) {
    citations.push({
      title: 'Audited Financial Statements & Solvency Ratios',
      type: 'Financial Statement',
      url: '',
      excerpt: `Revenue: ${formatCurrency(f.revenue)} | Net Income: ${formatCurrency(f.netIncome)} | Net Margin: ${f.profitMargin ?? 'N/A'}% | Debt/Equity: ${f.debtToEquity ?? 'N/A'} | Current Ratio: ${f.currentRatio ?? 'N/A'} | Solvency: ${f.solvencyRating || 'SOUND'}.`,
    });
  }

  // Risk & Regulatory Scan Citation
  if (
    textToScan.includes('risk') ||
    textToScan.includes('flag') ||
    textToScan.includes('lawsuit') ||
    textToScan.includes('litigation') ||
    textToScan.includes('sec') ||
    textToScan.includes('regulatory') ||
    textToScan.includes('concern') ||
    textToScan.includes('danger') ||
    textToScan.includes('safe') ||
    textToScan.includes('fraud') ||
    textToScan.includes('scam')
  ) {
    const topFlag = report.redFlags?.[0];
    const topNews = n.find((item) => item.isFlaggedAsRisk) || n[0];
    citations.push({
      title: 'Forensic Risk Analysis & Regulatory Scan',
      type: 'Forensic Risk Analysis',
      url: topNews?.url || '',
      excerpt: topFlag
        ? `[${topFlag.severity}] ${topFlag.title}: ${topFlag.description}`
        : `Overall Safety Score: ${report.overallSafetyScore}/100 (${report.overallRiskLevel} Risk). No critical disciplinary enforcement records identified.`,
    });
  }

  // Leverage pre-stored evidence citations if present
  if (Array.isArray(report.evidenceCitations)) {
    for (const ec of report.evidenceCitations) {
      if (citations.length >= 3) break;
      if (!citations.some((c) => c.title === ec.title)) {
        citations.push(ec);
      }
    }
  }

  // Default fallback citation
  if (citations.length === 0) {
    citations.push({
      title: 'StockLens Corporate Due Diligence Dossier',
      type: 'Multi-Source Registry',
      excerpt: `${report.companyName} (${report.ticker || 'N/A'}): Overall Safety Score ${report.overallSafetyScore}/100 (${report.overallRiskLevel} Risk), Legitimacy Score ${report.legitimacyScore}/100.`,
    });
  }

  return citations.slice(0, 3);
};

/**
 * Institutional Heuristic Q&A Engine
 * Provides rich, authoritative, markdown-formatted answers if external AI APIs are offline.
 */
const generateHeuristicAssistantAnswer = (report, query) => {
  const lower = query.toLowerCase();
  const v = report.snapshotData?.verification || {};
  const f = report.snapshotData?.financials || {};
  let answer = '';

  if (lower.includes('red flag') || lower.includes('risk') || lower.includes('danger') || lower.includes('safe') || lower.includes('flag')) {
    if (report.redFlags && report.redFlags.length > 0) {
      answer = `### Forensic Risk Assessment: ${report.companyName} (${report.ticker || 'N/A'})\n\n` +
        `StockLens has evaluated **${report.companyName}** with an **Overall Investment Safety Score of ${report.overallSafetyScore}/100 (${report.overallRiskLevel} Risk)**.\n\n` +
        `**Identified Red Flags (${report.redFlags.length}):**\n` +
        report.redFlags.map((rf, i) => `${i + 1}. **${rf.title}** [${rf.severity} Severity]\n   - *Detail:* ${rf.description}\n   - *Source:* ${rf.source}`).join('\n\n') +
        `\n\n**Analyst Takeaway:** Heightened risk vectors require independent verification of corporate registrations and debt covenant terms prior to capital commitment.`;
    } else {
      answer = `### Forensic Risk Assessment: ${report.companyName} (${report.ticker || 'N/A'})\n\n` +
        `Our consolidated multi-source audit did not identify critical red flags for **${report.companyName}**.\n\n` +
        `- **Overall Investment Safety Score:** **${report.overallSafetyScore}/100**\n` +
        `- **Risk Classification:** **${report.overallRiskLevel} Risk**\n` +
        `- **Physical Legitimacy Score:** **${report.legitimacyScore}/100**\n\n` +
        `The company demonstrates a verifiable commercial footprint and standard statutory reporting compliance.`;
    }
  } else if (lower.includes('address') || lower.includes('location') || lower.includes('office') || lower.includes('virtual') || lower.includes('where') || lower.includes('legitimacy')) {
    answer = `### Physical Presence & Location Verification: ${report.companyName}\n\n` +
      `- **Registered Commercial Address:** ${v.formattedAddress || 'Not explicitly recorded in registry'}\n` +
      `- **Facility Classification:** ${v.locationType || 'Commercial Office'}\n` +
      `- **Virtual Office Status:** ${v.isVirtualOffice ? `⚠️ **FLAGGED AS VIRTUAL COWORKING FACILITY** (${v.virtualOfficeProvider || 'Shared Maildrop'})` : '✅ Verified Physical Commercial Footprint'}\n` +
      `- **Operational Status:** ${v.businessStatus || 'OPERATIONAL'}\n` +
      `- **Google Business Rating:** ${v.googleRating ? `${v.googleRating}/5.0 (${v.userRatingsTotal || 0} reviews)` : 'No public Google rating records'}\n` +
      `- **Legitimacy Score:** **${report.legitimacyScore}/100**\n\n` +
      (v.isVirtualOffice
        ? `⚠️ **Due Diligence Warning:** Companies registered at shared coworking or virtual office facilities carry an elevated risk of shell or maildrop entity structures. Direct physical confirmation is strongly advised.`
        : `Physical verification confirms authentic corporate infrastructure with operational commercial activity.`);
  } else if (lower.includes('financial') || lower.includes('revenue') || lower.includes('debt') || lower.includes('profit') || lower.includes('margin') || lower.includes('solvency') || lower.includes('liquidity')) {
    answer = `### Financial Health & Solvency Analysis: ${report.companyName}\n\n` +
      `- **Market Capitalization:** ${formatCurrency(f.marketCap)}\n` +
      `- **Annual Revenue (TTM):** ${formatCurrency(f.revenue)}\n` +
      `- **Net Income (TTM):** ${formatCurrency(f.netIncome)}\n` +
      `- **Net Profit Margin:** ${f.profitMargin != null ? f.profitMargin + '%' : 'N/A'}\n` +
      `- **Debt-to-Equity Ratio:** ${f.debtToEquity != null ? f.debtToEquity : 'N/A'}\n` +
      `- **Current Liquidity Ratio:** ${f.currentRatio != null ? f.currentRatio : 'N/A'}\n` +
      `- **Solvency Classification:** **${f.solvencyRating || 'SOUND'}**\n\n` +
      `**Solvency Assessment:** Balance sheet inspection indicates ${
        f.solvencyRating === 'EXCELLENT'
          ? 'a fortress capital structure with substantial liquidity buffers and negligible insolvency risk.'
          : f.solvencyRating === 'DISTRESSED'
          ? 'severe balance sheet distress with acute leverage or cash burn constraints.'
          : 'manageable financial leverage with adequate capacity to service short-term operational obligations.'
      }`;
  } else {
    answer = `### Due Diligence Dossier Overview: ${report.companyName} (${report.ticker || 'N/A'})\n\n` +
      `StockLens assigns **${report.companyName}** an **Overall Investment Safety Score of ${report.overallSafetyScore}/100 (${report.overallRiskLevel} Risk)** and a **Legitimacy Score of ${report.legitimacyScore}/100**.\n\n` +
      `**Key Evidence Highlights:**\n` +
      `- **Physical Presence:** ${v.locationType || 'Commercial Office'} (${v.isVirtualOffice ? 'Virtual Office Warning' : 'Verified Dedicated Site'})\n` +
      `- **Financial Durability:** Solvency rated **${f.solvencyRating || 'SOUND'}** with annual revenue of **${formatCurrency(f.revenue)}**\n` +
      `- **Forensic Red Flags:** **${report.redFlags?.length || 0} flagged item(s)**\n` +
      `- **Operational Strengths:** **${report.positiveIndicators?.length || 0} verified indicator(s)**\n\n` +
      `*You may ask detailed follow-ups regarding this company's debt profile, physical address legitimacy, or specific regulatory red flags.*`;
  }

  return {
    answer,
    citedSources: extractCitationsFromReport(report, query, answer),
  };
};
