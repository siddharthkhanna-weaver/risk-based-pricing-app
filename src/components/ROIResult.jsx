import '../styles/ROIResult.css';

export default function ROIResult({ result }) {
  if (!result) return null;

  if (result.error) {
    return (
      <div className="roi-result error">
        <h3>Calculation Error</h3>
        <p>{result.error}</p>
        <p>Resolved Profile: <strong>{result.resolvedProfile}</strong></p>
        <p>Pricing Product: <strong>{result.pricingProduct}</strong></p>
      </div>
    );
  }

  return (
    <div className="roi-result">
      <div className="roi-final">
        <span className="roi-label">Final ROI</span>
        <span className="roi-value">{result.finalROI.toFixed(2)}%</span>
      </div>

      <div className="roi-breakdown">
        <h4>ROI Breakdown</h4>

        <div className="breakdown-section">
          <div className="breakdown-row main">
            <span>Base Rate</span>
            <span className="rate">{result.baseRate.toFixed(2)}%</span>
          </div>
          <div className="breakdown-detail">{result.baseRateSource}</div>
        </div>

        <div className="breakdown-section">
          <div className="breakdown-row main">
            <span>Risk Add-On (R1 + R2 + R3)</span>
            <span className="rate">
              {result.riskAddon >= 0 ? '+' : ''}{result.riskAddon.toFixed(2)}%
              {result.riskAddonCapped && <span className="cap-badge">CAPPED</span>}
            </span>
          </div>
          {result.riskAddonCapped && (
            <div className="breakdown-detail cap-note">
              Uncapped total: {result.uncappedRiskAddon.toFixed(2)}% → capped at 2.00%
            </div>
          )}

          <div className="sub-breakdown">
            <div className="breakdown-row sub">
              <span>R1 — Credit Score ({result.r1.label})</span>
              <span className="rate">{result.r1.addon >= 0 ? '+' : ''}{result.r1.addon.toFixed(2)}%</span>
            </div>
            <div className="breakdown-detail">
              Score used: {result.r1.score} | Borrower: {result.r0}
            </div>

            <div className="breakdown-row sub">
              <span>R2 — Policy Deviations</span>
              <span className="rate">{result.r2.addon >= 0 ? '+' : ''}{result.r2.addon.toFixed(2)}%</span>
            </div>
            {result.r2.details.length > 0 ? (
              result.r2.details.map((d, i) => (
                <div key={i} className="breakdown-detail">• {d.label}: +{d.addon.toFixed(2)}%</div>
              ))
            ) : (
              <div className="breakdown-detail">No policy deviations</div>
            )}

            <div className="breakdown-row sub">
              <span>R3 — Property & Location</span>
              <span className="rate">{result.r3.addon >= 0 ? '+' : ''}{result.r3.addon.toFixed(2)}%</span>
            </div>
            {result.r3.details.map((d, i) => (
              <div key={i} className="breakdown-detail">
                • {d.label}: {d.addon >= 0 ? '+' : ''}{d.addon.toFixed(2)}%
              </div>
            ))}
          </div>
        </div>

        <div className="breakdown-section">
          <div className="breakdown-row main">
            <span>Special Product Pricing</span>
            <span className="rate">
              {result.specialPricing.markup > 0
                ? `+${result.specialPricing.markup.toFixed(2)}%`
                : '0.00%'}
            </span>
          </div>
          <div className="breakdown-detail">{result.specialPricing.label}</div>
        </div>
      </div>

      <div className="roi-meta">
        <div><strong>Resolved Customer Profile:</strong> {result.resolvedProfile}</div>
        <div><strong>Pricing Product:</strong> {result.pricingProduct}</div>
      </div>
    </div>
  );
}
