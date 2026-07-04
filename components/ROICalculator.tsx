"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Clock, Users, Zap } from 'lucide-react';

interface ROIResults {
  robotsNeeded: number;
  currentDays: number;
  newDays: number;
  currentLaborCost: number;
  newLaborCost: number;
  monthlySavings: number;
  paybackMonths: number;
  outputIncrease: number;
  bundlingSavings: number;
}

export function ROICalculator() {
  const [sqft, setSqft] = useState(85000);
  const [crewSize, setCrewSize] = useState(8);
  const [dailyCost, setDailyCost] = useState(685);
  const [coats, setCoats] = useState(3);
  const [targetDays, setTargetDays] = useState(18);
  const [bundleWithDryforge, setBundleWithDryforge] = useState(true);

  const [results, setResults] = useState<ROIResults>({
    robotsNeeded: 3,
    currentDays: 42,
    newDays: 18,
    currentLaborCost: 230160,
    newLaborCost: 68400,
    monthlySavings: 12480,
    paybackMonths: 4.2,
    outputIncrease: 380,
    bundlingSavings: 2240,
  });

  // Realistic calculation engine
  const calculateROI = () => {
    const totalWorkUnits = sqft * coats; // total coat-sqft
    
    // Human productivity: ~245 sqft per painter per day per coat (realistic incl. masking/edges)
    const humanDailyPerPainter = 245;
    const currentDailyOutput = crewSize * humanDailyPerPainter;
    const currentDaysCalc = Math.max(12, Math.ceil(totalWorkUnits / currentDailyOutput));
    
    // Robot: 4.1x effective output (optimized paths + continuous operation)
    const robotDailyPerRobot = 1005; // sqft per coat per day
    
    // Robots needed to hit target timeline (with 15% buffer for maintenance)
    const robotsNeededCalc = Math.max(1, Math.ceil((totalWorkUnits * 1.15) / (robotDailyPerRobot * targetDays)));
    
    // With robots, reduced human crew for supervision, prep, touch-up & QA (typically 25-35% of original)
    const reducedCrew = Math.max(2, Math.floor(crewSize * 0.32));
    
    // Current total labor cost for project
    const currentLabor = crewSize * dailyCost * currentDaysCalc;
    
    // New labor: reduced crew + robot RaaS (assume ~$4900/mo per robot prorated to project days)
    const robotDailyCost = (bundleWithDryforge ? 4200 : 4900) / 30; // daily equivalent
    const newLabor = (reducedCrew * dailyCost * targetDays) + (robotsNeededCalc * robotDailyCost * targetDays);
    
    // Project savings
    const projectSavings = currentLabor - newLabor;
    
    // Monthly equivalent savings (assume 2.2 projects per month average utilization for mid-size contractor)
    const monthlySavingsCalc = Math.round((projectSavings / currentDaysCalc) * 22);
    
    // Payback in months (robot fleet investment vs monthly savings)
    const fleetInvestment = robotsNeededCalc * (bundleWithDryforge ? 4200 : 4900);
    const paybackMonthsCalc = Math.max(2.8, parseFloat((fleetInvestment / monthlySavingsCalc).toFixed(1)));
    
    // Daily output increase %
    const newDailyOutput = robotsNeededCalc * robotDailyPerRobot;
    const outputIncreasePercent = Math.round(((newDailyOutput / currentDailyOutput) - 1) * 100);
    
    // Bundling extra savings (18% discount + shared ops efficiency)
    const bundlingExtra = bundleWithDryforge ? Math.round(monthlySavingsCalc * 0.18) : 0;

    setResults({
      robotsNeeded: robotsNeededCalc,
      currentDays: currentDaysCalc,
      newDays: targetDays,
      currentLaborCost: Math.round(currentLabor),
      newLaborCost: Math.round(newLabor),
      monthlySavings: monthlySavingsCalc,
      paybackMonths: paybackMonthsCalc,
      outputIncrease: outputIncreasePercent,
      bundlingSavings: bundlingExtra,
    });
  };

  // Live recalculation
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateROI();
    }, 120);
    return () => clearTimeout(timer);
    // calculateROI reads exactly these inputs; re-run when any changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sqft, crewSize, dailyCost, coats, targetDays, bundleWithDryforge]);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(amount);

  return (
    <div id="roi-calculator" className="bg-white rounded-3xl border border-[#E2E8F0] p-8 md:p-10 shadow-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-[#0A2540] text-white">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">Interactive ROI Model</h3>
          <p className="text-[#475569]">Model the potential impact for your project. All outputs are estimates based on engineering targets.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#334155] mb-2">Total Wall + Ceiling Area (sqft)</label>
            <input 
              type="range" min="15000" max="350000" step="5000" 
              value={sqft} onChange={(e) => setSqft(parseInt(e.target.value))}
              className="w-full accent-[#FF6B35]"
            />
            <div className="flex justify-between text-xs text-[#64748B] mt-1">
              <span>15,000</span>
              <span className="font-mono font-semibold text-[#0A2540]">{sqft.toLocaleString()} sqft</span>
              <span>350,000</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-2">Current Painter Crew</label>
              <input 
                type="number" value={crewSize} onChange={(e) => setCrewSize(Math.max(2, parseInt(e.target.value) || 2))}
                className="roi-input" min="2" max="35"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-2">Daily Cost / Painter (CAD)</label>
              <input 
                type="number" value={dailyCost} onChange={(e) => setDailyCost(Math.max(450, parseInt(e.target.value) || 450))}
                className="roi-input" step="5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-2">Number of Coats</label>
              <select 
                value={coats} onChange={(e) => setCoats(parseInt(e.target.value))}
                className="roi-input"
              >
                <option value={2}>2 coats (Primer + Finish)</option>
                <option value={3}>3 coats (Typical commercial)</option>
                <option value={4}>4 coats (High-spec / Institutional)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-2">Target Timeline (days)</label>
              <input 
                type="number" value={targetDays} onChange={(e) => setTargetDays(Math.max(8, parseInt(e.target.value) || 8))}
                className="roi-input" min="8" max="60"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input 
              type="checkbox" 
              id="bundle" 
              checked={bundleWithDryforge} 
              onChange={(e) => setBundleWithDryforge(e.target.checked)}
              className="w-4 h-4 accent-[#FF6B35]"
            />
            <label htmlFor="bundle" className="text-sm font-medium cursor-pointer">
              Model planned platform bundle discount (18% \u2014 roadmap pricing)
            </label>
          </div>
        </div>

        {/* Results - Live updating */}
        <div className="lg:col-span-3">
          <div className="bg-[#F8FAFC] rounded-2xl p-7 border border-[#E2E8F0]">
            <div className="uppercase text-xs tracking-[1.5px] font-semibold text-[#FF6B35] mb-4">MODELED IMPACT FOR YOUR NUMBERS</div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {/* Robots Needed */}
              <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
                <div className="flex items-center gap-2 text-[#FF6B35] mb-1">
                  <Users className="w-4 h-4" /> <span className="text-xs font-semibold tracking-widest">FLEET SIZE</span>
                </div>
                <div className="text-4xl font-semibold tabular-nums tracking-tighter text-[#0A2540]">{results.robotsNeeded}</div>
                <div className="text-sm text-[#475569]">robots recommended</div>
              </div>

              {/* Timeline Compression */}
              <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
                <div className="flex items-center gap-2 text-[#FF6B35] mb-1">
                  <Clock className="w-4 h-4" /> <span className="text-xs font-semibold tracking-widest">TIMELINE</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-semibold tabular-nums tracking-tighter text-[#0A2540]">{results.newDays}</div>
                  <div className="text-sm text-[#475569]">days</div>
                </div>
                <div className="text-sm text-[#059669] font-medium">vs {results.currentDays} days currently</div>
              </div>

              {/* Output Increase */}
              <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
                <div className="flex items-center gap-2 text-[#FF6B35] mb-1">
                  <Zap className="w-4 h-4" /> <span className="text-xs font-semibold tracking-widest">SPEED GAIN</span>
                </div>
                <div className="text-4xl font-semibold tabular-nums tracking-tighter text-[#0A2540]">+{results.outputIncrease}<span className="text-2xl">%</span></div>
                <div className="text-sm text-[#475569]">daily output increase</div>
              </div>
            </div>

            {/* Financials */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
                <div className="text-xs uppercase tracking-widest text-[#64748B] mb-2">PROJECT LABOR COST</div>
                <div className="flex items-baseline gap-3">
                  <div>
                    <div className="text-sm text-[#64748B] line-through">{formatCurrency(results.currentLaborCost)}</div>
                    <div className="text-3xl font-semibold tabular-nums text-[#0A2540]">{formatCurrency(results.newLaborCost)}</div>
                  </div>
                  <div className="text-xs px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] font-medium self-start mt-2">
                    Save {Math.round(((results.currentLaborCost - results.newLaborCost) / results.currentLaborCost) * 100)}%
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
                <div className="text-xs uppercase tracking-widest text-[#64748B] mb-2">MONTHLY SAVINGS (EQUIV.)</div>
                <div className="text-3xl font-semibold tabular-nums text-[#0A2540]">{formatCurrency(results.monthlySavings)}</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-sm text-[#059669]">Payback in <span className="font-semibold">{results.paybackMonths}</span> months</div>
                  {bundleWithDryforge && (
                    <div className="text-[10px] px-2 py-0.5 rounded bg-[#FF6B35] text-white font-medium">+{formatCurrency(results.bundlingSavings)}/mo from bundle</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t text-xs text-[#475569] flex items-center justify-between">
              <div>Modeled estimate: published Ontario 2025\u20132026 labor rates + PaintForge engineering targets. Not measured field results.</div>
              <button 
                onClick={() => window.location.href = '/pricing'}
                className="text-[#FF6B35] font-semibold hover:underline flex items-center gap-1"
              >
                See full RaaS pricing <TrendingUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
