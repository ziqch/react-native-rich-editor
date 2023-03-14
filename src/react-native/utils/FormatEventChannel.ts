import type { StringMap } from 'quill';

export class FormatEventChannel {
  private static readonly subscriptions: ((formats: StringMap) => void)[] = [];

  private constructor() {}

  private static instance: FormatEventChannel;

  public static getInstance() {
    if (!FormatEventChannel.instance) {
      FormatEventChannel.instance = new FormatEventChannel();
    }
    return FormatEventChannel.instance;
  }

  public subscribe(cb: (formats: StringMap) => void) {
    FormatEventChannel.subscriptions.push(cb);
  }

  public publish(formats: StringMap) {
    FormatEventChannel.subscriptions.forEach((cb) => cb(formats));
  }
}
