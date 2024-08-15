import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import { TextEncoder, TextDecoder as UtilTextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = UtilTextDecoder as unknown as {
    new (label?: string, options?: TextDecoderOptions): TextDecoder;
    prototype: TextDecoder;
};

fetchMock.enableMocks();