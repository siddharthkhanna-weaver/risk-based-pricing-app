import '../styles/ROIResult.css';

export default function ROIResult({ result, compact }) {
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
        <span className="roi-label">Rate of Interest <span className="roi-note">(as per inputs provided)</span></span>
        <span className="roi-value">{result.finalROI.toFixed(2)}%</span>
      </div>

      <div className="roi-breakdown">
        <h4>ROI Breakdown</h4>

        <div className="breakdown-section">
          <div className="breakdown-row main">
            <span>Base Rate</span>
            <span className="rate">{result.baseRate.toFixed(2)}%</span>
          </div>
        </div>

        <div className="breakdown-section">
          <div className="breakdown-row main">
            <span>Product Pricing</span>
            <span className="rate">
              {result.specialPricing.markup > 0
                ? `+${result.specialPricing.markup.toFixed(2)}%`
                : '0.00%'}
            </span>
          </div>
        </div>

        <div className="breakdown-section rack-rate-section">
          <div className="breakdown-row main">
            <span>Rack Rate</span>
            <span className="rate">{(result.baseRate + result.specialPricing.markup).toFixed(2)}%</span>
          </div>
        </div>

        <div className="breakdown-section">
          <div className="breakdown-row main">
            <span>Risk Add-On</span>
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
        </div>
      </div>

      {!compact && (
        <div className="roi-meta">
          <div><strong>Resolved Customer Profile:</strong> {result.resolvedProfile}</div>
          <div><strong>Pricing Product:</strong> {result.pricingProduct}</div>
        </div>
      )}
    </div>
  );
}
