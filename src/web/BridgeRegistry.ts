import { Action, Bridge, ResolverList } from '../react-native/utils';

export class BridgeRegistry {
  private bridges = new Map<string, Bridge<any, any>>();

  constructor() {}

  public register(key: string, resolverList?: ResolverList) {
    this.bridges.set(key, new Bridge<any, any>(key, resolverList));
  }

  public get(key: string) {
    return this.bridges.get(key);
  }

  public on(message: string) {
    const payload = JSON.parse(message) as Action;
    const target = this.bridges.get(payload.key);
    target?.on(message);
  }
}
