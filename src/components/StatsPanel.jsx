import React, { useState, useEffect } from 'react';
import { X, BarChart2, Calculator, Info, FileText, Printer } from 'lucide-react';

export default function StatsPanel({ 
  isOpen, 
  onClose, 
  sections, 
  metadata 
}) {
  const [stats, setStats] = useState({
    totalChapters: 0,
    totalWords: 0,
    totalChars: 0,
    estimatedPages: 0
  });

  const [paperWeight, setPaperWeight] = useState('50lb'); // 50lb standard, 60lb thick
  const [printRun, setPrintRun] = useState(100);

  useEffect(() => {
    let chapters = 0;
    let words = 0;
    let chars = 0;

    sections.forEach(s => {
      if (s.type === 'chapter') chapters++;
      // Clean HTML to extract text length
      const temp = document.createElement('div');
      temp.innerHTML = s.content;
      const text = temp.innerText || '';
      const cleanText = text.trim();
      
      words += cleanText === '' ? 0 : cleanText.split(/\s+/).length;
      chars += text.length;
    });

    // Estimation: 250 words per printed page
    const estimatedPages = Math.max(1, Math.ceil(words / 250));

    setStats({
      totalChapters: chapters,
      totalWords: words,
      totalChars: chars,
      estimatedPages: estimatedPages
    });
  }, [sections]);

  if (!isOpen) return null;

  // Spine width calculation
  // Cream paper: 0.0025 inches per page
  // White paper: 0.00225 inches per page
  // Thickness multiplier for 60lb paper is 1.15
  const getSpineWidth = () => {
    const isCream = metadata.paperColor === 'cream';
    const basePpi = isCream ? 0.0025 : 0.00225;
    const weightMult = paperWeight === '60lb' ? 1.15 : 1.0;
    
    const widthInches = stats.estimatedPages * basePpi * weightMult;
    const widthMm = widthInches * 25.4;
    return {
      inches: widthInches.toFixed(3),
      mm: widthMm.toFixed(1)
    };
  };

  // Print cost estimator
  // Paperback base: $1.50 + $0.015 per page
  // Hardcover base: $4.50 + $0.020 per page
  const getUnitCost = () => {
    const isHardcover = false; // Add hardcover calculation if needed
    const baseCost = 1.80;
    const perPageCost = 0.018;
    const unitPrice = baseCost + (stats.estimatedPages * perPageCost);
    return unitPrice;
  };

  const unitCost = getUnitCost();
  
  // Bulk discounts
  // 1-99: 100% price
  // 100-499: 90% price
  // 500+: 80% price
  const getBulkDiscount = (qty) => {
    if (qty >= 500) return 0.8;
    if (qty >= 100) return 0.9;
    return 1.0;
  };

  const finalUnitCost = unitCost * getBulkDiscount(printRun);
  const totalCost = finalUnitCost * printRun;

  const spine = getSpineWidth();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content stats-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="text-accent" size={18} />
            <h3 className="modal-title">Book Statistics & Cost Estimator</h3>
          </div>
          <button className="action-icon-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="modal-body flex flex-col gap-4">
          
          {/* Grid: Stats Summary */}
          <div className="stats-summary-grid">
            <div className="stat-card">
              <span className="stat-card-label">Total Chapters</span>
              <span className="stat-card-val">{stats.totalChapters}</span>
            </div>
            <div className="stat-card">
              <span className="stat-card-label">Word Count</span>
              <span className="stat-card-val">{stats.totalWords.toLocaleString()}</span>
            </div>
            <div className="stat-card">
              <span className="stat-card-label">Estimated Pages</span>
              <span className="stat-card-val">{stats.estimatedPages}</span>
            </div>
          </div>

          <div className="setup-divider" />

          {/* Spine Calculator */}
          <div className="stats-section">
            <div className="flex items-center gap-1.5 mb-2">
              <Calculator size={14} className="text-accent" />
              <h4 className="stats-section-title">Estimated Spine Width</h4>
            </div>

            <div className="spine-calculator-panel flex items-center justify-between gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <div className="form-group">
                  <label>Paper Weight / Thickness</label>
                  <select 
                    value={paperWeight} 
                    onChange={(e) => setPaperWeight(e.target.value)}
                    className="mt-1"
                  >
                    <option value="50lb">50lb Standard (White/Cream)</option>
                    <option value="60lb">60lb Premium (Thicker Paper)</option>
                  </select>
                </div>
                <span className="info-text text-muted flex items-center gap-1">
                  <Info size={11} />
                  <span>Paper type: {metadata.paperColor === 'cream' ? 'Cream' : 'White'}</span>
                </span>
              </div>

              <div className="spine-result-box flex flex-col items-center justify-center">
                <span className="spine-width-val">{spine.inches}"</span>
                <span className="spine-width-sub">{spine.mm} mm width</span>
              </div>
            </div>
          </div>

          <div className="setup-divider" />

          {/* Cost Estimator */}
          <div className="stats-section">
            <div className="flex items-center gap-1.5 mb-2">
              <Printer size={14} className="text-accent" />
              <h4 className="stats-section-title">Print Cost Estimator (Paperback)</h4>
            </div>

            <div className="cost-estimator-panel flex flex-col gap-3">
              <div className="setup-grid-2">
                <div className="form-group">
                  <label>Order Quantity (Copies)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10000"
                    value={printRun}
                    onChange={(e) => setPrintRun(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="form-group">
                  <label>Estimated Trim Size</label>
                  <span className="form-static-val mt-2">{metadata.trimSize || '6" x 9"'}</span>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="pricing-grid mt-2">
                <div className="pricing-card">
                  <span className="pricing-label">Price Per Book</span>
                  <span className="pricing-val">${finalUnitCost.toFixed(2)}</span>
                  {printRun >= 100 && (
                    <span className="discount-badge">
                      {printRun >= 500 ? '20% bulk discount applied' : '10% bulk discount applied'}
                    </span>
                  )}
                </div>
                <div className="pricing-card highlighted">
                  <span className="pricing-label">Total Print Cost</span>
                  <span className="pricing-val">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="modal-footer flex justify-end">
          <button className="stats-close-btn" onClick={onClose}>Close Panel</button>
        </div>
      </div>

      <style>{`
        .stats-modal-content {
          max-width: 600px;
          padding: 24px;
        }

        .stats-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .stat-card {
          border: 1px solid var(--ui-border);
          background-color: var(--ui-panel-bg);
          border-radius: var(--ui-radius);
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .stat-card-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--ui-text-muted);
          font-weight: 600;
        }

        .stat-card-val {
          font-size: 20px;
          font-weight: 700;
          color: var(--ui-accent);
        }

        .stats-section-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--ui-text);
        }

        .spine-calculator-panel {
          border: 1px solid var(--ui-border);
          background-color: var(--ui-panel-bg);
          border-radius: var(--ui-radius);
          padding: 16px;
        }

        .spine-result-box {
          background-color: var(--ui-bg);
          border: 1px solid var(--ui-border);
          border-radius: var(--ui-radius);
          width: 140px;
          height: 80px;
          box-shadow: var(--ui-shadow-sm);
        }

        .spine-width-val {
          font-size: 24px;
          font-weight: 700;
          color: var(--ui-text);
        }

        .spine-width-sub {
          font-size: 11px;
          color: var(--ui-text-muted);
        }

        .info-text {
          font-size: 11px;
        }

        .form-static-val {
          font-size: 14px;
          font-weight: 600;
          color: var(--ui-text);
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .pricing-card {
          border: 1px solid var(--ui-border);
          background-color: var(--ui-panel-bg);
          border-radius: var(--ui-radius);
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          position: relative;
        }

        .pricing-card.highlighted {
          background-color: var(--ui-accent-light);
          border-color: var(--ui-accent);
        }

        .pricing-card.highlighted .pricing-val {
          color: var(--ui-accent);
        }

        .pricing-label {
          font-size: 12px;
          font-weight: 500;
          color: var(--ui-text-muted);
        }

        .pricing-val {
          font-size: 24px;
          font-weight: 700;
          color: var(--ui-text);
        }

        .discount-badge {
          font-size: 9px;
          background-color: #10b981;
          color: white;
          padding: 1px 6px;
          border-radius: 99px;
          margin-top: 4px;
          font-weight: 500;
        }

        .stats-close-btn {
          border: 1px solid var(--ui-border);
          padding: 8px 16px;
          border-radius: var(--ui-radius-sm);
          font-size: 13px;
          font-weight: 500;
        }

        .stats-close-btn:hover {
          background-color: var(--ui-panel-bg);
        }
      `}</style>
    </div>
  );
}
