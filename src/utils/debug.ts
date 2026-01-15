/**
 * Debug utility for collecting and exporting OST generation logs
 * 
 * This utility helps collect debug information from the console
 * that can be shared for troubleshooting.
 */

export interface DebugLogEntry {
  timestamp: string;
  level: "log" | "error" | "warn" | "info";
  message: string;
  data?: any;
}

class DebugLogger {
  private logs: DebugLogEntry[] = [];
  private originalConsole: {
    log: typeof console.log;
    error: typeof console.error;
    warn: typeof console.warn;
    info: typeof console.info;
  };

  constructor() {
    // Store original console methods
    this.originalConsole = {
      log: console.log.bind(console),
      error: console.error.bind(console),
      warn: console.warn.bind(console),
      info: console.info.bind(console),
    };

    // Intercept console methods to capture logs
    this.interceptConsole();
  }

  private interceptConsole() {
    const self = this;

    console.log = (...args: any[]) => {
      self.originalConsole.log(...args);
      self.captureLog("log", args);
    };

    console.error = (...args: any[]) => {
      self.originalConsole.error(...args);
      self.captureLog("error", args);
    };

    console.warn = (...args: any[]) => {
      self.originalConsole.warn(...args);
      self.captureLog("warn", args);
    };

    console.info = (...args: any[]) => {
      self.originalConsole.info(...args);
      self.captureLog("info", args);
    };
  }

  private captureLog(level: DebugLogEntry["level"], args: any[]) {
    // Only capture OST-DEBUG logs
    const message = args
      .map((arg) => {
        if (typeof arg === "string") return arg;
        if (typeof arg === "object") return JSON.stringify(arg, null, 2);
        return String(arg);
      })
      .join(" ");

    if (message.includes("[OST-DEBUG]")) {
      this.logs.push({
        timestamp: new Date().toISOString(),
        level,
        message,
        data: args.length > 1 ? args.slice(1) : undefined,
      });
    }
  }

  /**
   * Get all captured logs
   */
  getLogs(): DebugLogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs as formatted text
   */
  getLogsAsText(): string {
    return this.logs
      .map((log) => {
        const dataStr = log.data
          ? "\n" + JSON.stringify(log.data, null, 2)
          : "";
        return `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}${dataStr}`;
      })
      .join("\n\n");
  }

  /**
   * Export logs as JSON
   */
  exportLogsAsJSON(): string {
    return JSON.stringify(
      {
        exportTimestamp: new Date().toISOString(),
        logCount: this.logs.length,
        logs: this.logs,
      },
      null,
      2
    );
  }

  /**
   * Copy logs to clipboard
   */
  async copyLogsToClipboard(): Promise<boolean> {
    try {
      const text = this.getLogsAsText();
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error("Failed to copy logs to clipboard:", error);
      return false;
    }
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Get logs filtered by session ID
   */
  getLogsBySession(sessionId: string): DebugLogEntry[] {
    return this.logs.filter((log) => log.message.includes(sessionId));
  }
}

// Create singleton instance
let debugLoggerInstance: DebugLogger | null = null;

/**
 * Get the debug logger instance
 */
export function getDebugLogger(): DebugLogger {
  if (!debugLoggerInstance) {
    debugLoggerInstance = new DebugLogger();
  }
  return debugLoggerInstance;
}

/**
 * Export logs for sharing (adds to window for easy access)
 */
export function setupDebugExport() {
  if (typeof window !== "undefined") {
    (window as any).exportOSTDebugLogs = () => {
      const logger = getDebugLogger();
      const logs = logger.exportLogsAsJSON();
      const blob = new Blob([logs], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ost-debug-logs-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log("[OST-DEBUG] Logs exported to file");
    };

    (window as any).copyOSTDebugLogs = async () => {
      const logger = getDebugLogger();
      const success = await logger.copyLogsToClipboard();
      if (success) {
        console.log("[OST-DEBUG] Logs copied to clipboard");
        alert("Debug logs copied to clipboard! You can paste them to share.");
      } else {
        alert("Failed to copy logs. Please check console.");
      }
    };

    (window as any).clearOSTDebugLogs = () => {
      const logger = getDebugLogger();
      logger.clearLogs();
      console.log("[OST-DEBUG] Logs cleared");
    };

    console.log(
      "[OST-DEBUG] Debug utilities available:\n" +
        "  - window.exportOSTDebugLogs() - Export logs as JSON file\n" +
        "  - window.copyOSTDebugLogs() - Copy logs to clipboard\n" +
        "  - window.clearOSTDebugLogs() - Clear all logs"
    );
  }
}
