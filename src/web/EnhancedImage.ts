import type Quill from 'quill';
interface EnhancedImageProps {
  src: string;
}
export default function createEnhancedImage() {
  const _Quill = (window as any).Quill as typeof Quill;
  const ImageBlob = _Quill.import('formats/image');
  const ATTRIBUTES = ['src', 'crossOrigin'];
  class EnhancedImage extends ImageBlob {
    public static blotName = 'enhanced-image';
    public static tagName = 'IMG';
    public static onload: () => void = () => {};
    public static onclick: (e: MouseEvent) => void = () => {};

    public static create(props: EnhancedImageProps) {
      const node: HTMLElement = super.create(props.src);
      node.setAttribute('crossOrigin', 'Anonymous');
      node.setAttribute('src', props.src);
      node.onload = () => {
        EnhancedImage.onload();
      };
      node.onclick = (e) => {
        EnhancedImage.onclick(e);
      };
      return node;
    }

    static value(domNode: any) {
      return domNode.getAttribute('src');
    }

    static formats(domNode: any) {
      return ATTRIBUTES.reduce((formats, attribute) => {
        if (domNode.hasAttribute(attribute)) {
          formats[attribute] = domNode.getAttribute(attribute);
        }
        return formats;
      }, {} as any);
    }

    format(name: string, value: string) {
      super.format(name, value);
      if (ATTRIBUTES.includes(name)) {
        if (value) {
          // @ts-ignore
          this.domNode.setAttribute(name, value);
        } else {
          // @ts-ignore
          this.domNode.removeAttribute(name);
        }
      }
    }
  }

  return EnhancedImage;
}
