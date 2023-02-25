interface WebViewLoggerProps {
  visible: boolean;
}

export class WebViewLogger {
  static token = '$WebViewLogger';
  private state: WebViewLoggerProps = {
    visible: false,
  };
  private readonly loggerBox: HTMLPreElement;
  private readonly container: HTMLDivElement;
  private message: string[] = ['fdsfasdsd', 'fasdfsdffds'];

  constructor() {
    this.container = this.containerDom();
    this.container.appendChild(this.triggerDom());
    this.loggerBox = this.loggerBoxDom();
    this.loggerBox.innerText = this.message.join('\n');
  }

  public log(message: string) {
    this.message.push(message);
    this.loggerBox.innerText = this.message.join('\n');
  }
  private onClickTrigger() {
    if (this.state.visible) {
      this.state.visible = false;
      this.container.removeChild(this.loggerBox);
    } else {
      this.state.visible = true;
      this.container.appendChild(this.loggerBox);
    }
  }

  private loggerBoxDom() {
    return window.document.createElement('pre');
  }

  private containerDom() {
    const container = window.document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '10px';
    container.style.right = '10px';
    return container;
  }

  private triggerDom() {
    const triggerDom = window.document.createElement('button');
    triggerDom.innerText = 'Logger';
    triggerDom.onclick = this.onClickTrigger.bind(this);
    return triggerDom;
  }
  public render() {
    if (!window.document) return;
    window.document.body.appendChild(this.container);
  }
}
