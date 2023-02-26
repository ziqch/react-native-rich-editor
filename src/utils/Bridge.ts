import type { Resolver } from './contract';
import { v4 as uuidv4 } from 'uuid';

type ResolverInnerType<S> = S extends Resolver<infer T> ? T : never;
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
class Bridge<SRC extends ResolverList<SRC>, TGT extends ResolverList<TGT>> {
  private readonly queue: Action[] = [];
  private readonly callbackPool = new Map<string, CallbackControl<any>>();
  private resolvers: SRC;
  private readonly send: (data: string) => void;

  constructor(send: (data: string) => void, resolvers?: SRC) {
    this.send = send;
    this.resolvers = resolvers ?? ({} as SRC);
  }

  public registerResolvers(resolvers: SRC) {
    this.resolvers = Object.assign(this.resolvers, resolvers);
  }

  private async callResolver(token: keyof SRC, ...args: any) {
    const resolver = this.resolvers[token];
    if (!resolver) {
      throw new Error(`Unregistered Resolver: ${String(token)}`);
    } else {
      return resolver.resolve(args);
    }
  }

  private async execute(size: number) {
    await Promise.resolve();
    while (size--) {
      const cur = this.queue.shift() as Action;
      this.consumeMessage(cur);
    }
  }

  public on(message: string) {
    const msg = JSON.parse(message);
    this.queue.push(msg);
    this.execute(this.queue.length);
  }

  private async consumeMessage(action: Action) {
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
        const res = await this.callResolver(action.token as keyof SRC, ...args);
        const callbackAction: Action = {
          actionType: ActionType.CALLBACK,
          token: action.token,
          id: action.id,
          payload: JSON.stringify(res),
        };
        this.dispatch(callbackAction);
    }
  }

  private async dispatch<T>(action: Action): Promise<T> {
    switch (action.actionType) {
      case ActionType.CALLBACK:
        this.send(JSON.stringify(action));
        return Promise.resolve({} as T);
      case ActionType.CALL:
        this.send(JSON.stringify(action));
        return new Promise<T>((resolve, reject) => {
          this.callbackPool.set(action.id, { resolve, reject });
        });
      default:
        return Promise.resolve({} as T);
    }
  }
  public call<K extends keyof TGT>(
    token: K,
    ...args: Parameters<ResolverInnerType<TGT[K]>>
  ) {
    return this.dispatch<ReturnType<ResolverInnerType<TGT[K]>>>({
      actionType: ActionType.CALL,
      token: token as string,
      payload: JSON.stringify(args),
      id: uuidv4(),
    });
  }
}

export default Bridge;
