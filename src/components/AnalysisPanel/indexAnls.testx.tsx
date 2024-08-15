// index.test.ts
import * as Index from './index';
import * as AnalysisPanel from './AnalysisPanel';
import * as AnalysisPanelTabs from './AnalysisPanelTabs';

describe('index.tsx exports', () => {
    it('should re-export everything from AnalysisPanel', () => {
        Object.keys(AnalysisPanel).forEach((key) => {
            expect(Index).toHaveProperty(key);
        });
    });

    it('should re-export everything from AnalysisPanelTabs', () => {
        Object.keys(AnalysisPanelTabs).forEach((key) => {
            expect(Index).toHaveProperty(key);
        });
    });
});