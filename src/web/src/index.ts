import { WebViewLogger } from '../../core/WebViewLogger';

const webViewLogger = new WebViewLogger();
webViewLogger.render();
(window as any)[WebViewLogger.token] = webViewLogger;
