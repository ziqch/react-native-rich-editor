import React, { FC } from 'react';
import {
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';

interface IRichEditorToolBarProps {
  tools: Array<JSX.Element>;
  style?: ViewStyle;
  fixedLeft?: JSX.Element;
  fixedRight?: JSX.Element;
}

const ToolBarStyles = StyleSheet.create({
  container: {
    zIndex: 999,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  fixedLeft: {
    zIndex: 999,
    position: 'absolute',
    left: 0,
  },
  fixedRight: {
    zIndex: 999,
    position: 'absolute',
    right: 0,
  },
});
const RichEditorToolBar: FC<IRichEditorToolBarProps> = (props) => {
  const { width } = useWindowDimensions();
  const { tools, style, fixedLeft, fixedRight } = props;
  const [scrollContainerPadding, setScrollContainerPadding] = React.useState({
    left: 0,
    right: 0,
  });
  const onLayoutFixedLeft = (event: LayoutChangeEvent) => {
    const paddingLeft = event.nativeEvent.layout.width;
    setScrollContainerPadding((state) => ({
      ...state,
      left: paddingLeft,
    }));
  };
  const onLayoutFixedRight = (event: LayoutChangeEvent) => {
    const paddingRight = event.nativeEvent.layout.width;
    setScrollContainerPadding((state) => ({
      ...state,
      right: paddingRight,
    }));
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ ...ToolBarStyles.container, ...style }}>
        <View onLayout={onLayoutFixedLeft} style={ToolBarStyles.fixedLeft}>
          {fixedLeft}
        </View>
        <ScrollView
          horizontal={true}
          style={{ width }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            ...ToolBarStyles.scrollContainer,
            paddingLeft: scrollContainerPadding.left,
            paddingRight: scrollContainerPadding.right,
          }}
        >
          {tools.map((tool, index) =>
            React.isValidElement(tool) ? <View key={index}>{tool}</View> : <></>
          )}
        </ScrollView>
        <View onLayout={onLayoutFixedRight} style={ToolBarStyles.fixedRight}>
          {fixedRight}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RichEditorToolBar;
