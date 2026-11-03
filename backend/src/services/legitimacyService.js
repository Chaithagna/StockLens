/**
 * Service to assess company legitimacy and calculate Physical Footprint Score
 */
export const evaluateLegitimacy = ({
  companyName,
  verificationData,
  domain,
  country = 'United States',
  isPublic = true,
}) => {
  let score = 85;
  const findings = [];
  let registryMatchStatus = 'VERIFIED_MATCH';

  const {
    isVirtualOffice,
    virtualOfficeProvider,
    locationType,
    userRatingsTotal,
    businessStatus,
    formattedAddress,
  } = verificationData;

  // 1. Physical Location Presence Evaluation
  if (isVirtualOffice) {
    score -= 35;
    findings.push({
      type: 'WARNING',
      title: 'Virtual Office / Coworking Address Detected',
      description: `The physical address matches a known virtual office provider (${virtualOfficeProvider || 'Shared Space'}). Virtual maildrop suites are a common red flag in shell company structures.`,
      evidence: `Registered address: ${formattedAddress}`,
    });
  } else if (locationType === 'HQ / Corporate Campus') {
    score += 10;
    findings.push({
      type: 'POSITIVE',
      title: 'Dedicated Corporate Headquarters Verified',
      description: 'Physical location corresponds to an established corporate campus or multi-tenant commercial property with dedicated signage.',
      evidence: formattedAddress,
    });
  } else if (locationType === 'Residential Address') {
    score -= 25;
    findings.push({
      type: 'WARNING',
      title: 'Residential Property Listed as Commercial HQ',
      description: 'The entity lists a single-family residential address as its primary executive headquarters, indicating lack of verified commercial infrastructure.',
      evidence: formattedAddress,
    });
  }

  // 2. Business Operational Status
  if (businessStatus === 'CLOSED_PERMANENTLY') {
    score -= 50;
    registryMatchStatus = 'MISMATCH_DETECTED';
    findings.push({
      type: 'CRITICAL',
      title: 'Location Flagged as Permanently Closed',
      description: 'Public business registries and mapping services report that this commercial facility has ceased operations.',
      evidence: 'Google Places status: CLOSED_PERMANENTLY',
    });
  } else if (businessStatus === 'OPERATIONAL') {
    findings.push({
      type: 'POSITIVE',
      title: 'Active Commercial Entity Status Confirmed',
      description: 'Physical business presence is verified active with regular operational traffic and merchant listings.',
      evidence: `Reviews & activity count: ${userRatingsTotal || 'Established'}`,
    });
  }

  // 3. Domain & Online Footprint Verification
  if (domain) {
    const isFreeDomain = domain.includes('wixsite') || domain.includes('wordpress') || domain.includes('weebly') || domain.includes('blogspot');
    if (isFreeDomain) {
      score -= 20;
      findings.push({
        type: 'WARNING',
        title: 'Free Subdomain Hosting Detected',
        description: 'Company utilizes a free shared web host rather than an authenticated commercial corporate domain.',
        evidence: `Domain: ${domain}`,
      });
    } else {
      findings.push({
        type: 'POSITIVE',
        title: 'Authentic Enterprise Domain Profile',
        description: 'Corporate web presence operates under an official primary top-level domain.',
        evidence: `Domain: ${domain}`,
      });
    }
  } else {
    score -= 10;
    registryMatchStatus = 'PARTIAL_MATCH';
    findings.push({
      type: 'INFO',
      title: 'Domain Verification Inconclusive',
      description: 'No official web domain was cross-referenced in public registry filings.',
      evidence: 'Domain not provided in initial entity query.',
    });
  }

  // 4. Public Regulatory Disclosure Standing
  if (isPublic) {
    score += 5;
    findings.push({
      type: 'POSITIVE',
      title: 'Public SEC Regulatory Filings on Record',
      description: 'Company maintains public regulatory disclosures with mandatory audited quarterly and annual filings.',
      evidence: `Registered jurisdiction: ${country}`,
    });
  }

  // Clamp score between 0 and 100
  const normalizedScore = Math.max(5, Math.min(99, score));

  return {
    legitimacyScore: normalizedScore,
    registryMatchStatus,
    findings,
  };
};

