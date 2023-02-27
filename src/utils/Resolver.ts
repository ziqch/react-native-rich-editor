export class Resolver<F extends (...args: any) => any> {
  private static readonly allResolvers = new Map<string, Resolver<any>>();
  public readonly token: string;
  private readonly resolver: F | undefined;
  constructor(token: string, resolver?: F) {
    this.token = token;
    this.resolver = resolver;
    Resolver.allResolvers.set(token, this);
  }

  public resolve(...args: Parameters<F>): ReturnType<F> {
    if (this.resolver) {
      return this.resolver.apply(this, args);
    } else {
      throw Error(`Unregistered Resolver: ${this.token}`);
    }
  }
}
