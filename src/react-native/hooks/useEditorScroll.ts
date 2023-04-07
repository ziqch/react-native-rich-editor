import React from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
} from 'react-native';
import {
  BuiltinBridgeRN,
  Direction,
  QuillResolverTokenBuiltin,
} from '../utils';

interface ViewScrollInfo {
  h: number;
  scrollTop: number;
}

interface IUseEditorScroll {
  webViewHeight: number;
  bridge: BuiltinBridgeRN;
}
export const useEditorScroll = (props: IUseEditorScroll) => {
  const { webViewHeight, bridge } = props;
  const scrollViewRef = React.useRef<ScrollView>(null);
  const viewScrollInfoRef = React.useRef<ViewScrollInfo>({
    h: 0,
    scrollTop: 0,
  });

  const scrollWebView = (offset: number, direction: Direction) => {
    setTimeout(
      () => {
        const { scrollTop, h } = viewScrollInfoRef.current;
        if (scrollTop < offset && offset < scrollTop + h) return;
        scrollViewRef.current?.scrollTo({
          y: offset - (direction === Direction.DOWN ? h : 0),
          animated: true,
        });
      },
      Platform.select({
        ios: 0,
        android: 200,
      })
    );
  };

  const onLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      const { scrollTop } = viewScrollInfoRef.current;
      const curHeight = e.nativeEvent.layout.height;
      if (scrollTop + curHeight > webViewHeight) {
        viewScrollInfoRef.current.scrollTop = webViewHeight - curHeight;
      }
      viewScrollInfoRef.current.h = curHeight;
      bridge.call(QuillResolverTokenBuiltin.Layout);
    },
    [bridge, webViewHeight]
  );

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    viewScrollInfoRef.current.scrollTop = e.nativeEvent.contentOffset.y;
  };

  return {
    scrollViewRef,
    viewScrollInfoRef,
    scrollWebView,
    onLayout,
    onScroll,
  };
};
