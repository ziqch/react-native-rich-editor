import type { Resolver } from './Resolver';
import { v4 as uuidv4 } from 'uuid';

type ElementOf<T> = T extends Array<infer E> ? E : never;
type ResolverList = Array<Resolver<any, any>>;
export type ResolverFunctionType<R> = R extends Resolver<any, infer F>
  ? F
  : never;
export type ResolverFunctionTypeByToken<
  T,
  RL extends ResolverList
> = ResolverFunctionType<Extract<ElementOf<RL>, Resolver<T, any>>>;
export type ResolverTokens<RL extends ResolverList> =
  ElementOf<RL> extends Resolver<infer T, any> ? T : never;
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
class Bridge<SRC extends ResolverList, TGT extends ResolverList> {
  private readonly transceiver = Transceiver.getInstance();
  private readonly resolvers = new Map<string, Resolver<any, any>>();

  constructor(resolvers?: SRC) {
    this.registerResolvers(resolvers);
  }

  public registerResolvers(resolvers: SRC = [] as any) {
    resolvers.forEach((resolver) => {
      if (this.resolvers.has(resolver.token)) {
        throw new Error(`Duplicated resolver token: ${resolver.token}`);
      } else {
        this.resolvers.set(resolver.token, resolver);
      }
    });
  }

  public on(message: string) {
    this.transceiver.on(message, this.resolvers);
  }

  public call<K extends ResolverTokens<TGT>>(
    token: K,
    ...args: Parameters<ResolverFunctionTypeByToken<K, TGT>>
  ) {
    return this.transceiver.dispatch<
      ReturnType<ResolverFunctionTypeByToken<K, TGT>>
    >({
      actionType: ActionType.CALL,
      token: token as string,
      payload: JSON.stringify(args),
      id: uuidv4(),
    });
  }
}

export default Bridge;
