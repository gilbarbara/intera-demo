import React from 'react';
import SVG from 'react-inlinesvg';
import { RequireExactlyOne } from 'type-fest';

import { useParentFontSize } from 'src/modules/helpers';

import { Icons } from 'src/types';

interface Props extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'title'> {
  animation?: 'fade' | 'pulse' | 'spin';
  color?: string;
  effect?: 'flip-horizontal' | 'flip-vertical' | 'rotate-90' | 'rotate-180' | 'rotate-270';
  name: Icons;
  size?: number | string | [width: number | string, height: number | string];
  title?: string;
  url: string;
}

function Icon(props: RequireExactlyOne<Props, 'name' | 'url'>): JSX.Element {
  const { animation, color, effect, name, size, title, url, ...rest } = props;
  const [ref, fontSize, isCalculated] = useParentFontSize();
  const shouldRender = size || isCalculated;

  const baseSize = fontSize || 16;
  const width = Array.isArray(size) ? size[0] : size ?? baseSize;
  const height = Array.isArray(size) ? size[1] : size ?? baseSize;
  const styles: React.CSSProperties = { display: 'inline-flex', height, width };
  const src = url || `/icons/${name}.svg`;
  const classNames = [];

  if (animation) {
    classNames.push(`i-${animation}`);
  }

  if (color) {
    styles.color = color;
  }

  if (effect) {
    classNames.push(`i-${effect}`);
  }

  return (
    <span ref={ref} style={styles} {...rest}>
      {shouldRender ? (
        <SVG
          className={classNames.join(' ')}
          height={height}
          src={src}
          title={title}
          width={width}
        />
      ) : null}
    </span>
  );
}

export default Icon;
