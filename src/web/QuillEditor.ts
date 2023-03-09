import type Quill from 'quill';
import type { DeltaOperation, RangeStatic, Sources } from 'quill';
import type { Bridge } from '../utils';
import {
  Direction,
  QuillResolversBuiltin,
  QuillResolverTokenBuiltin,
  RNResolversBuiltin,
  RNResolverTokenBuiltin,
} from '../utils';

export default function init(
  quill: Quill,
  bridge: Bridge<QuillResolversBuiltin, RNResolversBuiltin>,
  platform: string
) {
  const _Quill = (window as any).Quill as typeof Quill;
  const Delta = _Quill.import('delta');
  class QuillEditor {
    static ScrollOffsetBuffer = 20;
    private readonly quill: Quill;
    private readonly history: any;
    private readonly bridge: Bridge<QuillResolversBuiltin, RNResolversBuiltin>;
    private viewHeight = 0;
    private previousContentLength = 0;
    private previousSectionRange: RangeStatic | null = { index: 0, length: 0 };
    private readonly platform: string;

    constructor(
      quill: Quill,
      bridge: Bridge<QuillResolversBuiltin, RNResolversBuiltin>,
      platform: string
    ) {
      this.bridge = bridge;
      this.quill = quill;
      this.platform = platform;
      console.log('linked: ', this.platform);
      this.history = this.quill.getModule('history');
      this.setEvents();
      this.registerResolvers();
      this.updateViewHeight();
    }

    private setEvents() {
      this.quill.on('text-change', (delta, oldDelta, source) => {
        this.updateViewHeight();
        this.calculateScrollOffsetWhenTextChange();
        this.bridge.call(
          RNResolverTokenBuiltin.OnTextChange,
          delta.ops,
          oldDelta.ops,
          source
        );
      });
      this.quill.on('selection-change', (range, oldRange, source) => {
        this.calculateScrollOffsetWhenSelect(range);
        this.bridge.call(
          RNResolverTokenBuiltin.OnSelectionChange,
          range,
          oldRange,
          source
        );
        this.bridge.call(
          RNResolverTokenBuiltin.UpdateFormat,
          this.quill.getFormat()
        );
      });
    }

    private updateViewHeight() {
      setTimeout(() => {
        const rect = this.quill.root.getBoundingClientRect();
        if (this.viewHeight !== rect.height) {
          this.bridge.call(
            RNResolverTokenBuiltin.SetReactNativeState,
            'webViewHeight',
            JSON.stringify(rect.height)
          );
        }
        this.viewHeight = rect.height;
      });
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

    private setContents(delta: DeltaOperation[], source?: Sources) {
      return this.quill.setContents(new Delta(delta), source).ops;
    }

    private format(name: string, value: any, source?: Sources) {
      this.focus();
      const res = this.quill.format(name, value, source).ops;
      this.updateViewHeight();
      return res;
    }

    private addImage(sources: string[]) {
      this.focus();
      let index = this.quill.getSelection(true).index;
      sources.forEach((src) => {
        this.quill.insertEmbed(index++, 'image', src);
      });
      this.quill.setSelection({ index, length: 0 });
      this.updateViewHeight();
    }

    private registerResolvers() {
      this.bridge.registerResolvers({
        [QuillResolverTokenBuiltin.AddImage]: this.addImage.bind(this),
        [QuillResolverTokenBuiltin.Focus]: this.focus.bind(this),
        [QuillResolverTokenBuiltin.Blur]: this.blur.bind(this),
        [QuillResolverTokenBuiltin.Undo]: this.undo.bind(this),
        [QuillResolverTokenBuiltin.Redo]: this.redo.bind(this),
        [QuillResolverTokenBuiltin.SetContents]: this.setContents.bind(this),
        [QuillResolverTokenBuiltin.GetContents]: this.getContents.bind(this),
        [QuillResolverTokenBuiltin.Format]: this.format.bind(this),
      });
    }
  }
  return new QuillEditor(quill, bridge, platform);
}
