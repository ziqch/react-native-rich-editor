import type { Resolver } from './Resolver';
import { v4 as uuidv4 } from 'uuid';

export type ResolverInnerType<S> = S extends Resolver<infer T> ? T : never;
type ResolverList<T> = { [K in keyof T]: Resolver<any> };
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

export class Transceiver {
  private readonly queue: Action[] = [];
  private readonly callbackPool = new Map<string, CallbackControl<any>>();
  private sender: (data: string) => void = () => {};

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

  private async callResolver(
    token: string,
    resolvers: ResolverList<any>,
    args: any
  ) {
    const resolver = resolvers[token];
    if (!resolver) {
      throw new Error(`Unregistered Resolver: ${String(token)}`);
    } else {
      return resolver.resolve(...args);
    }
  }

  private async execute(size: number, resolvers: ResolverList<any>) {
    await Promise.resolve();
    while (size--) {
      const cur = this.queue.shift() as Action;
      this.consume(cur, resolvers);
    }
  }

  private async consume(action: Action, resolvers: ResolverList<any>) {
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

  public on(message: string, resolvers: ResolverList<any>) {
    const msg = JSON.parse(message);
    this.queue.push(msg);
    this.execute(this.queue.length, resolvers);
  }
}
class Bridge<SRC extends ResolverList<SRC>, TGT extends ResolverList<TGT>> {
  private resolvers: SRC;
  private readonly transceiver = Transceiver.getInstance();

  constructor(resolvers?: SRC) {
    this.resolvers = resolvers ?? ({} as SRC);
  }

  public registerResolvers(resolvers: SRC) {
    this.resolvers = Object.assign(this.resolvers, resolvers);
  }

  public on(message: string) {
    this.transceiver.on(message, this.resolvers);
  }
  public call<K extends keyof TGT>(
    token: K,
    ...args: Parameters<ResolverInnerType<TGT[K]>>
  ) {
    return this.transceiver.dispatch<ReturnType<ResolverInnerType<TGT[K]>>>({
      actionType: ActionType.CALL,
      token: token as string,
      payload: JSON.stringify(args),
      id: uuidv4(),
    });
  }
}

export default Bridge;
