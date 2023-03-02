import type Quill from 'quill';
import type { DeltaOperation, RangeStatic } from 'quill';
import type { Bridge } from '../utils';
import {
  Direction,
  QuillResolverListBuiltin,
  QuillResolverTokenBuiltin,
  Resolver,
  RNResolverListBuiltin,
  RNResolverTokenBuiltin,
} from '../utils';

export default function init(
  quill: Quill,
  bridge: Bridge<QuillResolverListBuiltin, RNResolverListBuiltin>,
  initialValue: DeltaOperation[]
) {
  const _Quill = (window as any).Quill as typeof Quill;
  const Delta = _Quill.import('delta');
  class QuillEditor {
    static ScrollOffsetBuffer = 20;
    private readonly quill: Quill;
    private readonly history: any;
    private readonly bridge: Bridge<
      QuillResolverListBuiltin,
      RNResolverListBuiltin
    >;
    private viewHeight = 0;
    private previousContentLength = 0;
    private previousSectionRange: RangeStatic | null = { index: 0, length: 0 };

    constructor(
      quill: Quill,
      bridge: Bridge<QuillResolverListBuiltin, RNResolverListBuiltin>,
      initialValue: DeltaOperation[]
    ) {
      this.bridge = bridge;
      this.quill = quill;
      this.history = this.quill.getModule('history');
      this.quill.setContents(new Delta(initialValue));
      this.setEvents();
      this.registerResolvers();
      this.updateViewHeight();
    }

    private setEvents() {
      this.quill.on('text-change', () => {
        this.updateViewHeight();
        this.calculateScrollOffsetWhenTextChange();
        this.bridge.call(
          RNResolverTokenBuiltin.OnTextChange,
          this.getContents()
        );
      });
      this.quill.on('selection-change', (range) => {
        this.calculateScrollOffsetWhenSelect(range);
      });
    }

    private updateViewHeight() {
      const rect = this.quill.root.getBoundingClientRect();
      if (this.viewHeight !== rect.height) {
        this.bridge.call(
          RNResolverTokenBuiltin.SetReactNativeState,
          'webViewHeight',
          JSON.stringify(rect.height)
        );
      }
      this.viewHeight = rect.height;
    }

    private calculateScrollOffsetWhenTextChange() {
      const prevLen = this.previousContentLength;
      const curLen = this.quill.getLength();
      setTimeout(() => {
        const curSelection = this.quill.getSelection();
        if (!curSelection) return;
        const direction = prevLen <= curLen ? Direction.DOWN : Direction.UP;
        const curBound = this.quill.getBounds(
          curSelection.index,
          curSelection.length
        );
        const offset =
          direction === Direction.DOWN
            ? curBound.bottom
            : curBound.top - QuillEditor.ScrollOffsetBuffer;
        if (offset !== -1) {
          this.bridge.call(
            RNResolverTokenBuiltin.ScrollWebView,
            offset,
            direction
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
        direction = Direction.DOWN;
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
            direction =
              curBound.bottom > prevBound.bottom
                ? Direction.DOWN
                : Direction.UP;
            offset =
              curBound.bottom +
              QuillEditor.ScrollOffsetBuffer *
                (direction === Direction.DOWN ? 1 : -1);
          } else if (!isTopEqual) {
            direction =
              curBound.top > prevBound.top ? Direction.DOWN : Direction.UP;
            offset =
              curBound.top +
              QuillEditor.ScrollOffsetBuffer *
                (direction === Direction.DOWN ? 1 : -1);
          }
        }
      }
      this.previousSectionRange = { ...range };
      if (offset !== -1) {
        this.bridge.call(
          RNResolverTokenBuiltin.ScrollWebView,
          offset,
          direction
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

    private getContents(index?: number, length?: number) {
      return this.quill.getContents(index, length).ops;
    }
    private registerResolvers() {
      this.bridge.registerResolvers([
        new Resolver(QuillResolverTokenBuiltin.Focus, this.undo.bind(this)),
        new Resolver(QuillResolverTokenBuiltin.Blur, this.blur.bind(this)),
        new Resolver(QuillResolverTokenBuiltin.Undo, this.undo.bind(this)),
        new Resolver(QuillResolverTokenBuiltin.Redo, this.redo.bind(this)),
        new Resolver(
          QuillResolverTokenBuiltin.GetContents,
          this.getContents.bind(this)
        ),
      ]);
    }
  }
  return new QuillEditor(quill, bridge, initialValue);
}
