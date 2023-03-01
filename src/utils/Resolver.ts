export class Resolver<T, F extends (...args: any) => any> {
  public readonly token: T;
  private readonly resolver: F | undefined;
  constructor(token: T, resolver?: F) {
    this.token = token;
    this.resolver = resolver;
  }

  public resolve(...args: Parameters<F>): ReturnType<F> {
    if (this.resolver) {
      return this.resolver.apply(this, args);
    } else {
      throw Error(`Unregistered Resolver: ${this.token}`);
    }
  }
}
