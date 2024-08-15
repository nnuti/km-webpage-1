import { PromptModel } from './models';

describe('PromptModel', () => {
    it('should have a default prompt_type value', () => {
        const model = new PromptModel();
        expect(model.prompt_type).toBe('');
    });

    it('should set and get the prompt_type value', () => {
        const model = new PromptModel('example');
        expect(model.prompt_type).toBe('example');
    });
});