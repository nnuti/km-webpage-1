// authConfig.test.tsx
import { msalConfig } from "./authConfig";
import { LogLevel } from "@azure/msal-browser"; // Ensure you import LogLevel if it's used in your code

describe("msalConfig", () => {
  it("should have the correct auth configuration", () => {
    expect(msalConfig.auth).toEqual({
      clientId: "d725ccbf-5813-4de0-94b6-25fa06ed9ef3",
      authority:
        "https://login.microsoftonline.com/f2fda5e7-2ea1-450d-9fc1-2af5f8630095",
      redirectUri: "https://azapp-entcoreaife-dev-001.azurewebsites.net/",
    });
  });

  it("should have the correct cache configuration", () => {
    expect(msalConfig.cache).toEqual({
      cacheLocation: "localStorage",
      storeAuthStateInCookie: false,
    });
  });
});

describe("MSAL Configuration Tests", () => {
  it("should have the correct clientId", () => {
    expect(msalConfig.auth.clientId).toBe(
      "d725ccbf-5813-4de0-94b6-25fa06ed9ef3"
    );
  });

  it("should have the correct authority", () => {
    expect(msalConfig.auth.authority).toBe(
      "https://login.microsoftonline.com/f2fda5e7-2ea1-450d-9fc1-2af5f8630095"
    );
  });

  it("should have the correct redirectUri", () => {
    expect(msalConfig.auth.redirectUri).toBe("https://azapp-entcoreaife-dev-001.azurewebsites.net/");
  });

  it("should use localStorage for cacheLocation", () => {
    if (msalConfig.cache) {
      // Ensure cache is defined
      expect(msalConfig.cache.cacheLocation).toBe("localStorage");
    } else {
      fail("msalConfig.cache is undefined");
    }
  });

  it("should not store auth state in cookie", () => {
    if (msalConfig.cache) {
      // Ensure cache is defined
      expect(msalConfig.cache.storeAuthStateInCookie).toBe(false);
    } else {
      fail("msalConfig.cache is undefined");
    }
  });
});

describe("loggerCallback", () => {
  const system = {
    loggerOptions: {
      loggerCallback: (level: any, message: any, containsPii: any) => {
        if (containsPii) return; // Skip logging if containsPii is true
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
          default:
            break;
        }
      },
    },
  };
  // Mock console methods
  const mockError = jest.spyOn(console, "error").mockImplementation(() => {});
  const mockInfo = jest.spyOn(console, "info").mockImplementation(() => {});
  const mockDebug = jest.spyOn(console, "debug").mockImplementation(() => {});
  const mockWarn = jest.spyOn(console, "warn").mockImplementation(() => {});

  afterEach(() => {
    // Clear mocks after each test
    jest.clearAllMocks();
  });

  it("should log error messages", () => {
    system.loggerOptions.loggerCallback(LogLevel.Error, "Test Error", false);
    expect(mockError).toHaveBeenCalledWith("Test Error");
  });

  it("should log info messages", () => {
    system.loggerOptions.loggerCallback(LogLevel.Info, "Test Info", false);
    expect(mockInfo).toHaveBeenCalledWith("Test Info");
  });

  it("should log debug messages", () => {
    system.loggerOptions.loggerCallback(LogLevel.Verbose, "Test Debug", false);
    expect(mockDebug).toHaveBeenCalledWith("Test Debug");
  });

  it("should log warning messages", () => {
    system.loggerOptions.loggerCallback(
      LogLevel.Warning,
      "Test Warning",
      false
    );
    expect(mockWarn).toHaveBeenCalledWith("Test Warning");
  });

  it("should not log messages if containsPii is true", () => {
    system.loggerOptions.loggerCallback(LogLevel.Error, "Test Error", true);
    expect(mockError).not.toHaveBeenCalled();
  });
});
