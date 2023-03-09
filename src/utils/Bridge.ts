import { Resolver } from './Resolver';

export type ResolverList = { [K in string]: (...args: any) => any };
export type ResolverFunctionType<
  T extends keyof RL,
  RL extends ResolverList
> = RL[T];
export type PromiseInner<T> = T extends Promise<infer P> ? P : T;
interface CallbackControl<T> {
  resolve: (data: T) => void;
  reject: (error: any) => void;
}
export enum ActionType {
  CALL,
  CALLBACK,
}
interface Action {
  actionType: ActionType;
  token: string;
  id: string;
  error?: string;
  payload: string;
}
const noop = () => {};

const uuid = () => {
  const s = [];
  const hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4';
  // @ts-ignore
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = '-';
  return s.join('');
};
class Transceiver {
  private readonly queue: Action[] = [];
  private readonly callbackPool = new Map<string, CallbackControl<any>>();
  private sender: (data: string) => void = noop;

  private constructor() {}

  private static instance: Transceiver;

  public static getInstance() {
    if (!Transceiver.instance) {
      Transceiver.instance = new Transceiver();
    }
    return Transceiver.instance;
  }

  public setSender(sender: (data: string) => void) {
    this.sender = sender;
  }

  public isConnected() {
    return this.sender !== noop;
  }

  private async callResolver(
    token: string,
    resolvers: Map<string, Resolver<any, any>>,
    args: any
  ) {
    const resolver = resolvers.get(token);
    if (!resolver) {
      throw new Error(`Unregistered Resolver: ${String(token)}`);
    } else {
      return resolver.resolve(...args);
    }
  }

  private async execute(
    size: number,
    resolvers: Map<string, Resolver<any, any>>
  ) {
    await Promise.resolve();
    while (size--) {
      const cur = this.queue.shift() as Action;
      this.consume(cur, resolvers);
    }
  }

  private async consume(
    action: Action,
    resolvers: Map<string, Resolver<any, any>>
  ) {
    switch (action.actionType) {
      case ActionType.CALLBACK:
        const control = this.callbackPool.get(action.id);
        if (control) {
          if (action.error) control.reject(JSON.parse(action.error));
          else
            control.resolve(action.payload ? JSON.parse(action.payload) : '');
          this.callbackPool.delete(action.id);
        }
        break;
      case ActionType.CALL:
        const args = action.payload ? JSON.parse(action.payload) : [];
        const res = await this.callResolver(action.token, resolvers, args);
        const callbackAction: Action = {
          actionType: ActionType.CALLBACK,
          token: action.token,
          id: action.id,
          payload: JSON.stringify(res),
        };
        this.dispatch(callbackAction);
    }
  }

  async dispatch<T>(action: Action): Promise<T> {
    switch (action.actionType) {
      case ActionType.CALLBACK:
        this.sender(JSON.stringify(action));
        return Promise.resolve({} as T);
      case ActionType.CALL:
        this.sender(JSON.stringify(action));
        return new Promise<T>((resolve, reject) => {
          this.callbackPool.set(action.id, { resolve, reject });
        });
      default:
        return Promise.resolve({} as T);
    }
  }

  public on(message: string, resolvers: Map<any, Resolver<any, any>>) {
    const msg = JSON.parse(message);
    this.queue.push(msg);
    this.execute(this.queue.length, resolvers);
  }
}
export class Bridge<SRC extends ResolverList, TGT extends ResolverList> {
  private static readonly transceiver = Transceiver.getInstance();
  private readonly resolvers = new Map<string, Resolver<any, any>>();

  public static setSender(sender: (data: string) => void) {
    if (!Bridge.transceiver.isConnected()) {
      Bridge.transceiver.setSender(sender);
    }
  }

  constructor(resolvers?: SRC) {
    this.registerResolvers(resolvers);
  }

  public registerResolvers(resolvers: Partial<SRC> = {} as any) {
    Object.keys(resolvers).forEach((token) => {
      this.resolvers.set(token, new Resolver(token, resolvers[token] ?? noop));
    });
  }

  public on(message: string) {
    Bridge.transceiver.on(message, this.resolvers);
  }

  public call<K extends keyof TGT>(
    token: K,
    ...args: Parameters<ResolverFunctionType<K, TGT>>
  ) {
    return Bridge.transceiver.dispatch<
      PromiseInner<ReturnType<ResolverFunctionType<K, TGT>>>
    >({
      actionType: ActionType.CALL,
      token: token as string,
      payload: JSON.stringify(args),
      id: uuid(),
    });
  }
}
