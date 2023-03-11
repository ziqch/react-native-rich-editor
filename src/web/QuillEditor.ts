import type Quill from 'quill';
import type { DeltaOperation, RangeStatic, Sources } from 'quill';
import type { Bridge, QuillEditorOptions } from '../utils';
import {
  Direction,
  OriginalQuillInstance,
  QuillEditorToken,
  QuillResolversBuiltin,
  QuillResolverTokenBuiltin,
  RNResolversBuiltin,
  RNResolverTokenBuiltin,
} from '../utils';
import type { QuillOptionsStatic } from 'quill';

const DefaultScrollOffsetBuffer = 50;
export default function init(
  bridge: Bridge<QuillResolversBuiltin, RNResolversBuiltin>,
  options?: QuillEditorOptions
) {
  const _Quill = (window as any).Quill as typeof Quill;
  const Delta = _Quill.import('delta');
  class QuillEditor {
    private readonly scrollOffsetBuffer: number = DefaultScrollOffsetBuffer;
    private readonly quill: Quill;
    private readonly history: any;
    private readonly bridge: Bridge<QuillResolversBuiltin, RNResolversBuiltin>;
    private viewHeight = 0;
    private previousContentLength = 0;
    private previousSectionRange: RangeStatic | null = { index: 0, length: 0 };
    private readonly platform?: string;

    constructor(
      bridge: Bridge<QuillResolversBuiltin, RNResolversBuiltin>,
      options?: QuillEditorOptions
    ) {
      this.bridge = bridge;
      this.quill = this.mountQuill({
        placeholder: options?.placeholder,
        readOnly: options?.readOnly,
      });
      this.platform = options?.platform;
      this.history = this.quill.getModule('history');
      this.scrollOffsetBuffer =
        options?.scrollOffsetBuffer ?? DefaultScrollOffsetBuffer;
      this.setEvents();
      this.registerResolvers();
      this.updateViewHeight();
    }

    private mountQuill(options?: QuillOptionsStatic) {
      const el = document.createElement('div');
      el.id = '$editor';
      window.document.body.append(el);
      const quill = new _Quill(el, options);
      (window as any)[OriginalQuillInstance] = quill;
      return quill;
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
      this.quill.root.addEventListener('compositionstart', () => {
        this.bridge.call(
          RNResolverTokenBuiltin.SetReactNativeState,
          'isInputComposing',
          'true'
        );
      });
      this.quill.root.addEventListener('compositionend', () => {
        this.bridge.call(
          RNResolverTokenBuiltin.SetReactNativeState,
          'isInputComposing',
          'false'
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
            ? curBound.bottom + this.scrollOffsetBuffer
            : curBound.top - this.scrollOffsetBuffer;
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
        offset = curBound.bottom + this.scrollOffsetBuffer;
      } else {
        if (!this.previousSectionRange || !this.previousSectionRange.length) {
          offset = curBound.bottom + this.scrollOffsetBuffer;
        } else if (this.previousSectionRange.length) {
          const prevBound = this.quill.getBounds(
            this.previousSectionRange.index,
            this.previousSectionRange.length
          );
          const isBottomEqual = prevBound.bottom === curBound.bottom;
          const isTopEqual = prevBound.top === curBound.top;
          if (!isTopEqual && !isBottomEqual) {
            offset = curBound.bottom + this.scrollOffsetBuffer;
          } else if (!isBottomEqual) {
            direction =
              curBound.bottom > prevBound.bottom
                ? Direction.DOWN
                : Direction.UP;
            offset =
              curBound.bottom +
              this.scrollOffsetBuffer * (direction === Direction.DOWN ? 1 : -1);
          } else if (!isTopEqual) {
            direction =
              curBound.top > prevBound.top ? Direction.DOWN : Direction.UP;
            offset =
              curBound.top +
              this.scrollOffsetBuffer * (direction === Direction.DOWN ? 1 : -1);
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

    public setSelection(index: number, length: number, source?: Sources) {
      this.quill.setSelection(index, length, source);
    }

    private getContents(index?: number, length?: number) {
      return this.quill.getContents(index, length).ops;
    }

    private setContents(delta: DeltaOperation[], source?: Sources) {
      return this.quill.setContents(new Delta(delta), source).ops;
    }

    private format(name: string, value: any, source?: Sources) {
      const res = this.quill.format(name, value, source).ops;
      this.updateViewHeight();
      return res;
    }

    private addImage(sources: string[]) {
      let index = this.quill.getSelection(true).index;
      sources.forEach((src) => {
        this.quill.insertEmbed(index++, 'image', src);
      });
      this.quill.setSelection({ index, length: 0 });
      this.updateViewHeight();
    }

    public getPlatform() {
      return this.platform;
    }

    private registerResolvers() {
      this.bridge.registerResolvers({
        [QuillResolverTokenBuiltin.AddImage]: this.addImage.bind(this),
        [QuillResolverTokenBuiltin.Undo]: this.undo.bind(this),
        [QuillResolverTokenBuiltin.Redo]: this.redo.bind(this),
        [QuillResolverTokenBuiltin.SetContents]: this.setContents.bind(this),
        [QuillResolverTokenBuiltin.GetContents]: this.getContents.bind(this),
        [QuillResolverTokenBuiltin.Format]: this.format.bind(this),
        [QuillResolverTokenBuiltin.SetSelection]: this.setSelection.bind(this),
      });
    }
  }
  const quillEditor = new QuillEditor(bridge, options);
  (window as any)[QuillEditorToken] = quillEditor;
  return quillEditor;
}
