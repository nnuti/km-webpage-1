// AnalysisPanelTabs.test.ts
import { AnalysisPanelTabs } from './AnalysisPanelTabs';

describe('AnalysisPanelTabs Enum', () => {
    it('should have the correct values', () => {
        expect(AnalysisPanelTabs.ThoughtProcessTab).toBe('thoughtProcess');
        expect(AnalysisPanelTabs.SupportingContentTab).toBe('supportingContent');
        expect(AnalysisPanelTabs.CitationTab).toBe('citation');
    });

    it('should have the correct keys', () => {
        const keys = Object.keys(AnalysisPanelTabs);
        expect(keys).toContain('ThoughtProcessTab');
        expect(keys).toContain('SupportingContentTab');
        expect(keys).toContain('CitationTab');
    });
});