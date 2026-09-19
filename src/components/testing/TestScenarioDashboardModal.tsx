import React, { useState } from 'react';
import { ALL_TEST_SCENARIOS } from '../../testing/scenarios.ts';
import { ScenarioRunner } from '../../testing/runner.ts';
import { TestScenario, ScenarioRunReport, ScenarioCategory } from '../../testing/types.ts';
import { 
  CheckCircle2, 
  XCircle, 
  Play, 
  RotateCcw, 
  ShieldCheck, 
  FlaskConical, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  Lock, 
  EyeOff, 
  Terminal,
  ExternalLink,
  Search,
  Filter,
  Globe,
  Radio
} from 'lucide-react';

interface TestScenarioDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestScenarioDashboardModal: React.FC<TestScenarioDashboardModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [reports, setReports] = useState<Record<string, ScenarioRunReport>>({});
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [runningScenarioId, setRunningScenarioId] = useState<string | null>(null);
  const [expandedScenarioId, setExpandedScenarioId] = useState<string | null>(null);

  if (!isOpen) return null;

  const runner = new ScenarioRunner();

  const categories: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'All Scenarios', count: ALL_TEST_SCENARIOS.length },
    { id: 'task', label: 'Tasks & Navigation', count: ALL_TEST_SCENARIOS.filter(s => s.category === 'task').length },
    { id: 'safety', label: 'Safety & Credentials', count: ALL_TEST_SCENARIOS.filter(s => s.category === 'safety').length },
    { id: 'scam', label: 'Scam Detection', count: ALL_TEST_SCENARIOS.filter(s => s.category === 'scam').length },
    { id: 'language', label: 'Language & Hindi', count: ALL_TEST_SCENARIOS.filter(s => s.category === 'language').length },
    { id: 'failure', label: 'Failure Resilience', count: ALL_TEST_SCENARIOS.filter(s => s.category === 'failure').length },
    { id: 'behavior', label: 'User Mistakes & Recovery', count: ALL_TEST_SCENARIOS.filter(s => s.category === 'behavior').length },
    { id: 'realtime', label: 'Real-time & Separation', count: ALL_TEST_SCENARIOS.filter(s => s.category === 'realtime').length },
    { id: 'security', label: 'Security & Injections', count: ALL_TEST_SCENARIOS.filter(s => s.category === 'security').length }
  ];

  const filteredScenarios = ALL_TEST_SCENARIOS.filter(scenario => {
    const matchesCategory = selectedCategory === 'all' || scenario.category === selectedCategory;
    const matchesQuery = 
      scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.userInput.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const totalRuns = Object.keys(reports).length;
  const passedCount = Object.values(reports).filter(r => r.status === 'PASS').length;
  const failedCount = Object.values(reports).filter(r => r.status === 'FAIL').length;

  const handleRunScenario = async (scenario: TestScenario) => {
    setRunningScenarioId(scenario.id);
    try {
      const report = await runner.runScenario(scenario);
      setReports(prev => ({ ...prev, [scenario.id]: report }));
      setExpandedScenarioId(scenario.id);
    } catch (err: any) {
      console.error('Scenario run error:', err);
    } finally {
      setRunningScenarioId(null);
    }
  };

  const handleRunAll = async () => {
    setIsRunningAll(true);
    const newReports: Record<string, ScenarioRunReport> = { ...reports };
    
    for (const scenario of filteredScenarios) {
      setRunningScenarioId(scenario.id);
      const report = await runner.runScenario(scenario);
      newReports[scenario.id] = report;
      setReports({ ...newReports });
    }
    
    setRunningScenarioId(null);
    setIsRunningAll(false);
  };

  const handleReset = () => {
    setReports({});
    setExpandedScenarioId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/80 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-white dark:bg-stone-900 w-full max-w-6xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 dark:border-stone-800"
        role="dialog"
        aria-modal="true"
        aria-label="Testing & Scenario Engine Dashboard"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-stone-900 dark:text-white tracking-tight">
                  SevaMitr Testing & Scenario Engine
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  TEST MODE
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-400 border border-blue-300 dark:border-blue-800">
                  SIMULATION
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Reusable senior workflow simulations, safety gates, and resilience test matrix.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="btn-run-all-scenarios"
              onClick={handleRunAll}
              disabled={isRunningAll}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all ${
                isRunningAll
                  ? 'bg-amber-500 text-white cursor-wait animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              {isRunningAll ? 'Running Scenarios...' : `Run All (${filteredScenarios.length})`}
            </button>

            <button
              id="btn-reset-scenarios"
              onClick={handleReset}
              disabled={isRunningAll || totalRuns === 0}
              className="px-3.5 py-2.5 rounded-xl text-sm font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 disabled:opacity-40 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>

            <button
              id="btn-close-scenario-modal"
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-800 text-sm font-semibold transition-colors"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-6 py-3 bg-stone-100/70 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-stone-600 dark:text-stone-300">
              Coverage Matrix: {ALL_TEST_SCENARIOS.length} Total Automated Scenarios
            </span>
            <div className="h-4 w-px bg-stone-300 dark:bg-stone-700" />
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" /> {passedCount} Passed
            </span>
            <span className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-medium">
              <XCircle className="w-4 h-4" /> {failedCount} Failed
            </span>
            <span className="text-stone-500">
              Pending: {ALL_TEST_SCENARIOS.length - totalRuns}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scenarios or user inputs..."
                className="pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500 w-56"
              />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-6 py-2.5 bg-stone-50 dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
              }`}
            >
              {cat.label}
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedCategory === cat.id ? 'bg-amber-700 text-amber-100' : 'bg-stone-300 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Main List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5 bg-stone-50/50 dark:bg-stone-900/40">
          {filteredScenarios.map((scenario) => {
            const report = reports[scenario.id];
            const isRunning = runningScenarioId === scenario.id;
            const isExpanded = expandedScenarioId === scenario.id;

            return (
              <div 
                key={scenario.id}
                className={`rounded-2xl border transition-all ${
                  report?.status === 'PASS'
                    ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : report?.status === 'FAIL'
                    ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900'
                }`}
              >
                {/* Card Header */}
                <div className="p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-[280px]">
                    <div className="mt-0.5">
                      {isRunning ? (
                        <div className="w-6 h-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                      ) : report?.status === 'PASS' ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      ) : report?.status === 'FAIL' ? (
                        <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-400 flex items-center justify-center text-xs font-bold">
                          •
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                          {scenario.name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          scenario.mode === 'LIVE'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}>
                          {scenario.mode}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                          {scenario.language === 'hi' ? '🇮🇳 Hindi' : '🇬🇧 English'}
                        </span>
                        <span className="text-xs text-stone-400 font-mono">
                          #{scenario.id}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        {scenario.description}
                      </p>

                      {scenario.userInput && (
                        <div className="text-xs font-mono bg-stone-100 dark:bg-stone-800/80 px-2.5 py-1 rounded-md text-stone-700 dark:text-stone-300 inline-block mt-1 border border-stone-200 dark:border-stone-700/50">
                          User Input: &ldquo;{scenario.userInput}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5">
                    {report && (
                      <div className="text-right text-xs mr-1">
                        <div className={`font-bold ${report.status === 'PASS' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {report.status} ({report.durationMs}ms)
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {report.assertionResults.filter(a => a.passed).length}/{report.assertionResults.length} assertions
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleRunScenario(scenario)}
                      disabled={isRunning || isRunningAll}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white active:scale-95 disabled:opacity-40 transition-all flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Run
                    </button>

                    <button
                      onClick={() => setExpandedScenarioId(isExpanded ? null : scenario.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs transition-colors"
                      title="Toggle Assertion Logs"
                    >
                      {isExpanded ? '▲ Hide' : '▼ Details'}
                    </button>
                  </div>
                </div>

                {/* Expanded Assertion Breakdown & Logs */}
                {isExpanded && (
                  <div className="px-5 pb-4 pt-2 border-t border-stone-200/80 dark:border-stone-800/80 bg-stone-50/70 dark:bg-stone-950/40 text-xs space-y-3">
                    <div>
                      <h4 className="font-bold text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        Expected Results & Verification Assertions:
                      </h4>

                      <div className="space-y-1.5 pl-2">
                        {scenario.expectedResults.map((expected, idx) => {
                          const assertionEval = report?.assertionResults?.[idx];
                          return (
                            <div 
                              key={idx}
                              className={`p-2.5 rounded-lg border text-xs flex items-start justify-between gap-3 ${
                                assertionEval?.passed
                                  ? 'bg-emerald-100/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                                  : assertionEval
                                  ? 'bg-rose-100/50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800/60 text-rose-900 dark:text-rose-200'
                                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div className="mt-0.5">
                                  {assertionEval?.passed ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                  ) : assertionEval ? (
                                    <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                  ) : (
                                    <div className="w-3.5 h-3.5 rounded-full border border-stone-400" />
                                  )}
                                </div>
                                <div>
                                  <span className="font-mono font-bold text-[11px] block text-stone-800 dark:text-stone-200">
                                    {expected.type}
                                  </span>
                                  <p className="text-[11px] mt-0.5 leading-relaxed">
                                    {assertionEval ? assertionEval.message : `Expected assertion: ${JSON.stringify(expected)}`}
                                  </p>
                                </div>
                              </div>

                              {assertionEval && (
                                <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                                  assertionEval.passed
                                    ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300'
                                    : 'bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-300'
                                }`}>
                                  {assertionEval.passed ? 'PASS' : 'FAIL'}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Execution Event Logs */}
                    {report?.logs && report.logs.length > 0 && (
                      <div>
                        <h4 className="font-bold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-stone-500" />
                          Deterministic Execution Log:
                        </h4>
                        <div className="bg-stone-950 text-stone-300 font-mono text-[11px] p-3 rounded-xl max-h-36 overflow-y-auto space-y-0.5 border border-stone-800">
                          {report.logs.map((log, i) => (
                            <div key={i} className="leading-tight">
                              {log}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero Mock Logic in Production: Scenarios exercise the real Task Engine, Privacy Firewall, and Safety Matrix.</span>
          </div>
          <div className="text-stone-400 text-[11px]">
            SevaMitr AI Testing Framework v1.0
          </div>
        </div>
      </div>
    </div>
  );
};
