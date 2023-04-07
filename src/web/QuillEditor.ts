import { createEmptyHistoryState, registerHistory } from '@lexical/history';
import {
  $convertToMarkdownString,
  HEADING,
  QUOTE,
  registerMarkdownShortcuts,
  TEXT_FORMAT_TRANSFORMERS,
} from '@lexical/markdown';
import { HeadingNode, QuoteNode, registerRichText } from '@lexical/rich-text';
import { $canShowPlaceholder } from '@lexical/text';
import {
  $getSelection,
  $getTextContent,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  createEditor,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
// @ts-expect-error no types
import documentOffset from 'document-offset';
import type {
  Bridge,
  QuillEditorOptions,
  WebViewResolversBuiltin,
} from '../react-native/utils';
import {
  Direction,
  QuillEditorKey,
  QuillResolversBuiltin,
  QuillResolverTokenBuiltin,
  RNResolversBuiltin,
  RNResolverTokenBuiltin,
  WebViewBridgeSDK,
} from '../react-native/utils';
import { registerHashtag } from './hashtag';
import {
  QueryMatch,
  replaceQueryMatchWithValue,
  triggerMentionCallbacksOnUpdate,
} from './mentions';
import { HashtagNode } from '@lexical/hashtag';

interface QuillEditorProps {
  bridge: Bridge<
    QuillResolversBuiltin & WebViewResolversBuiltin,
    RNResolversBuiltin
  >;
  options?: QuillEditorOptions;
}

const MARKDOWN_TRANSFORMERS = [QUOTE, HEADING, ...TEXT_FORMAT_TRANSFORMERS];

export default function init(initProps: QuillEditorProps) {
  class QuillEditor {
    private readonly scrollOffsetBuffer = 50;
    private readonly editor: ReturnType<typeof createEditor>;
    private readonly bridge: Bridge<
      QuillResolversBuiltin & WebViewResolversBuiltin,
      RNResolversBuiltin
    >;
    private viewHeight = 0;
    private previousContentLength = 0;

    private previousSectionRange: {
      index: number;
      length: number;
      bounds: { top: number; bottom: number };
    } | null = null;

    private placeholderEl: HTMLElement | null = null;
    private readonly queryMatches = new Map<string, QueryMatch>();

    constructor(props: QuillEditorProps) {
      const { bridge, options } = props;

      this.bridge = bridge;

      const editor = createEditor({
        nodes: [HeadingNode, QuoteNode, HashtagNode],
        theme: {
          text: {
            base: 'text-base',
          },
          hashtag: 'hashtag',
        },
      });

      this.editor = editor;

      const el = document.createElement('div');
      el.style.minHeight = '40px';
      el.contentEditable = 'true';
      document.body.append(el);
      editor.setRootElement(el);

      registerRichText(editor);
      registerMarkdownShortcuts(editor, MARKDOWN_TRANSFORMERS);
      registerHistory(editor, createEmptyHistoryState(), 1000);
      registerHashtag(editor);

      this.updateViewHeight();

      this.setEvents();
      this.registerResolvers();

      if (options?.placeholder) {
        const placeholderEl = document.createElement('div');
        placeholderEl.innerText = options?.placeholder;
        placeholderEl.className = 'placeholder';

        this.placeholderEl = placeholderEl;

        document.body.append(placeholderEl);

        this.updatePlaceholder();
      }

      let mentionsOpen = false;

      this.editor.registerUpdateListener(() => {
        triggerMentionCallbacksOnUpdate(
          this.editor,
          (mentionChar, searchTerm, queryMatch) => {
            mentionsOpen = true;

            this.bridge.call(RNResolverTokenBuiltin.OnMentionsOpen, {
              searchTerm,
              mentionChar,
            });

            this.queryMatches.set(`${searchTerm}`, queryMatch);
          },
          () => {
            if (mentionsOpen) {
              this.bridge.call(RNResolverTokenBuiltin.OnMentionsClose);
            }

            this.queryMatches.clear();

            mentionsOpen = false;
          }
        );
      });

      if (options?.autoFocus) {
        this.editor.getRootElement()?.focus();
      }
    }

    private updatePlaceholder = () => {
      this.editor.getEditorState().read(() => {
        if (!this.placeholderEl) {
          return;
        }

        const canShow = $canShowPlaceholder(this.editor.isComposing());

        if (canShow) {
          this.placeholderEl.style.opacity = '1';
        } else {
          this.placeholderEl.style.opacity = '0';
        }
      });
    };

    private setEvents() {
      this.editor.registerUpdateListener(() => {
        this.updatePlaceholder();
        this.updateViewHeight();
        this.calculateScrollOffsetWhenTextChange();
      });

      this.editor.registerEditableListener(() => {
        this.updatePlaceholder();
      });

      this.editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          const selection = $getSelection();

          if (selection) {
            this.calculateScrollOffsetWhenSelect(selection);
          }

          return false;
        },
        COMMAND_PRIORITY_LOW
      );

      //   this.quill.on('editor-change', () => {
      //     const currentSelection = this.quill.getSelection();
      //     if (currentSelection) {
      //       this.bridge.call(
      //         RNResolverTokenBuiltin.UpdateFormat,
      //         this.quill.getFormat(currentSelection)
      //       );
      //     }
      //   });

      //   this.quill.root.addEventListener('compositionstart', () => {
      //     this.bridge.call(
      //       RNResolverTokenBuiltin.SetReactNativeState,
      //       'isInputComposing',
      //       'true'
      //     );
      //   });
      //   this.quill.root.addEventListener('compositionend', () => {
      //     this.bridge.call(
      //       RNResolverTokenBuiltin.SetReactNativeState,
      //       'isInputComposing',
      //       'false'
      //     );
      //   });
    }

    private updateViewHeight() {
      setTimeout(() => {
        const rect = this.editor.getRootElement()?.getBoundingClientRect();
        if (!rect) {
          return;
        }

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

    private getSelectionBounds = (
      currentSelection: ReturnType<typeof $getSelection>
    ) => {
      if (!currentSelection) {
        return null;
      }

      const firstElement = this.editor.getElementByKey(
        currentSelection?.getNodes()[0].getKey() || ''
      );

      const lastElement = this.editor.getElementByKey(
        currentSelection
          ?.getNodes()
          [currentSelection?.getNodes().length - 1].getKey() || ''
      );

      if (!firstElement || !lastElement) {
        return;
      }

      const firstElementOffset = documentOffset(firstElement);
      const lastElementOffset = documentOffset(lastElement);

      const firstBoundingBox = {
        bottom:
          firstElementOffset.top + firstElement.getBoundingClientRect().height,
        top: firstElementOffset.top,
      };

      const lastBoundingBox = {
        bottom:
          lastElementOffset.top + lastElement.getBoundingClientRect().height,
        top: lastElementOffset.top,
      };

      const currBound = {
        bottom: Math.max(firstBoundingBox.bottom, lastBoundingBox.bottom),
        top: Math.min(firstBoundingBox.top, lastBoundingBox.top),
      };

      return currBound;
    };

    private calculateScrollOffsetWhenTextChange() {
      this.editor.getEditorState().read(() => {
        const currLen = $getTextContent().length;
        const currentSelection = $getSelection();

        const direction =
          this.previousContentLength <= currLen ? Direction.DOWN : Direction.UP;

        const currBound = this.getSelectionBounds(currentSelection);

        if (!currBound) {
          return;
        }

        const offset =
          direction === Direction.DOWN
            ? currBound.bottom + this.scrollOffsetBuffer
            : currBound.top - this.scrollOffsetBuffer;

        if (offset !== -1) {
          this.bridge.call(
            RNResolverTokenBuiltin.ScrollWebView,
            offset,
            direction
          );
        }

        this.previousContentLength = currLen;
      });
    }

    private calculateScrollOffsetWhenSelect(
      selection: ReturnType<typeof $getSelection>
    ) {
      if (!selection || !$isRangeSelection(selection)) {
        this.previousSectionRange = null;

        return;
      }

      const curBound = this.getSelectionBounds(selection);

      if (!curBound) {
        return;
      }

      let offset = -1;
      let direction = Direction.DOWN;

      const selectionLength =
        selection.getCharacterOffsets()[1] - selection.getCharacterOffsets()[0];

      if (!selectionLength) {
        offset = curBound.bottom + this.scrollOffsetBuffer;
      } else {
        if (!this.previousSectionRange || !this.previousSectionRange.length) {
          offset = curBound.bottom + this.scrollOffsetBuffer;
        } else if (this.previousSectionRange.length) {
          const prevBound = this.previousSectionRange.bounds;
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
      this.previousSectionRange = {
        index: selection.getCharacterOffsets()[0],
        length: selectionLength,
        bounds: curBound,
      };

      if (offset !== -1) {
        this.bridge.call(
          RNResolverTokenBuiltin.ScrollWebView,
          offset,
          direction
        );
      }
    }

    private registerResolvers() {
      this.bridge.registerResolvers({
        [QuillResolverTokenBuiltin.Undo]: () => {
          // @ts-expect-error wrong type
          this.editor.dispatchCommand(UNDO_COMMAND, true);
        },
        [QuillResolverTokenBuiltin.Redo]: () => {
          // @ts-expect-error wrong type
          this.editor.dispatchCommand(REDO_COMMAND, true);
        },
        [QuillResolverTokenBuiltin.Blur]: () => {
          this.editor.getRootElement()?.blur();
        },
        [QuillResolverTokenBuiltin.Focus]: () => {
          this.editor.getRootElement()?.focus();
        },
        [QuillResolverTokenBuiltin.Layout]: () =>
          this.calculateScrollOffsetWhenTextChange(),

        [QuillResolverTokenBuiltin.GetMarkdown]: async () => {
          return new Promise((resolve) => {
            this.editor.getEditorState().read(() => {
              const markdown = $convertToMarkdownString(MARKDOWN_TRANSFORMERS);

              resolve(markdown);
            });
          });
        },

        [QuillResolverTokenBuiltin.InsertMention]: (searchTerm, value) => {
          const queryMatch = this.queryMatches.get(searchTerm);

          if (!queryMatch) {
            return;
          }

          replaceQueryMatchWithValue(this.editor, queryMatch, value);

          this.queryMatches.clear();
        },
      });
    }
  }
  const quillEditor = new QuillEditor(initProps);
  (window as any)[WebViewBridgeSDK][QuillEditorKey] = quillEditor;
  return quillEditor;
}
