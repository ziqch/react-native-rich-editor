import type Quill from 'quill';
import type { RangeStatic, QuillOptionsStatic, DeltaOperation } from 'quill';
import type Bridge from '../../src/utils/Bridge';
import {
  RNResolverTokenBuiltin,
  QuillResolverTokenBuiltin,
  QuillResolverListBuiltin,
  RNResolverListBuiltin,
  Resolver,
} from '../../src/utils/contract';

export default function init(
  id: string,
  bridge: Bridge<QuillResolverListBuiltin, RNResolverListBuiltin>,
  initialValue: DeltaOperation[],
  options: QuillOptionsStatic
) {
  const _Quill = (window as any).Quill as typeof Quill;
  const Delta = _Quill.import('delta');
  class QuillEditor {
    static ScrollOffsetBuffer = 20;
    private readonly quill: Quill;
    private readonly history: any;
    private readonly el: HTMLElement;
    private readonly bridge: Bridge<
      QuillResolverListBuiltin,
      RNResolverListBuiltin
    >;
    private viewHeight = 0;
    private previousContentLength = 0;
    private previousSectionRange: RangeStatic | null = { index: 0, length: 0 };
    private options: QuillOptionsStatic = {} as QuillOptionsStatic;

    constructor(
      id: string,
      bridge: Bridge<QuillResolverListBuiltin, RNResolverListBuiltin>,
      initialValue: DeltaOperation[],
      options: QuillOptionsStatic
    ) {
      this.bridge = bridge;
      this.el = document.createElement('div');
      this.el.id = id;
      window.document.body.append(this.el);
      this.options = options;
      this.quill = new _Quill(this.el, this.options);
      this.history = this.quill.getModule('history');
      this.quill.setContents(new Delta(initialValue));
      this.setEvents();
      this.registerResolvers();
    }

    private setEvents() {
      this.quill.on('text-change', () => {
        this.updateViewHeight();
        this.calculateScrollOffsetWhenTextChange();
      });
      this.quill.on('selection-change', (range) => {
        this.calculateScrollOffsetWhenSelect(range);
      });
    }

    private updateViewHeight() {
      const rect = this.quill.root.getBoundingClientRect();
      const hasChanged = this.viewHeight !== rect.height;
      if (hasChanged) {
        this.bridge.call(RNResolverTokenBuiltin.SetReactNativeState, {
          webviewHeight: rect.height,
        });
      }
      this.viewHeight = rect.height;
    }

    private calculateScrollOffsetWhenTextChange() {
      const prevLen = this.previousContentLength;
      const curLen = this.quill.getLength();
      setTimeout(() => {
        const curSelection = this.quill.getSelection();
        if (!curSelection) return;
        const isDownward = prevLen <= curLen;
        const curBound = this.quill.getBounds(
          curSelection.index,
          curSelection.length
        );
        const offset = isDownward
          ? curBound.bottom
          : curBound.top - QuillEditor.ScrollOffsetBuffer;
        if (offset !== -1) {
          this.bridge.call(
            RNResolverTokenBuiltin.ScrollWebView,
            offset,
            isDownward
          );
        }
        this.previousContentLength = curLen;
      });
    }

    private calculateScrollOffsetWhenSelect(range: RangeStatic) {
      if (!range) {
        this.previousSectionRange = null;
        return;
      }
      const curBound = this.quill.getBounds(range.index, range.length);
      let offset = -1,
        isDownward = true;
      if (!range.length) {
        offset = curBound.bottom + QuillEditor.ScrollOffsetBuffer;
      } else {
        if (!this.previousSectionRange || !this.previousSectionRange.length) {
          offset = curBound.bottom + QuillEditor.ScrollOffsetBuffer;
        } else if (this.previousSectionRange.length) {
          const prevBound = this.quill.getBounds(
            this.previousSectionRange.index,
            this.previousSectionRange.length
          );
          const isBottomEqual = prevBound.bottom === curBound.bottom;
          const isTopEqual = prevBound.top === curBound.top;
          if (!isTopEqual && !isBottomEqual) {
            offset = curBound.bottom + QuillEditor.ScrollOffsetBuffer;
          } else if (!isBottomEqual) {
            isDownward = curBound.bottom > prevBound.bottom;
            offset =
              curBound.bottom +
              QuillEditor.ScrollOffsetBuffer * (isDownward ? 1 : -1);
          } else if (!isTopEqual) {
            isDownward = curBound.top > prevBound.top;
            offset =
              curBound.top +
              QuillEditor.ScrollOffsetBuffer * (isDownward ? 1 : -1);
          }
        }
      }
      this.previousSectionRange = { ...range };
      if (offset !== -1) {
        this.bridge.call(
          RNResolverTokenBuiltin.ScrollWebView,
          offset,
          isDownward
        );
      }
    }
    private undo() {
      this.history.undo();
    }

    private redo() {
      this.history.redo();
    }

    private blur() {
      this.quill.blur();
    }

    public focus() {
      this.quill.focus();
      this.quill.root.click();
      this.quill.root.focus();
    }

    private getContents(index: number, length: number) {
      return this.quill.getContents(index, length).ops;
    }
    private registerResolvers() {
      this.bridge.registerResolvers({
        [QuillResolverTokenBuiltin.Focus]: new Resolver<() => void>(
          QuillResolverTokenBuiltin.Focus,
          this.undo.bind(this)
        ),
        [QuillResolverTokenBuiltin.Blur]: new Resolver<() => void>(
          QuillResolverTokenBuiltin.Blur,
          this.blur.bind(this)
        ),
        [QuillResolverTokenBuiltin.Undo]: new Resolver<() => void>(
          QuillResolverTokenBuiltin.Undo,
          this.undo.bind(this)
        ),
        [QuillResolverTokenBuiltin.Redo]: new Resolver<() => void>(
          QuillResolverTokenBuiltin.Redo,
          this.redo.bind(this)
        ),
        [QuillResolverTokenBuiltin.getContents]: new Resolver<
          (index: number, length: number) => DeltaOperation[]
        >(QuillResolverTokenBuiltin.getContents, this.getContents.bind(this)),
      });
    }
  }
  return new QuillEditor(id, bridge, initialValue, options);
}
