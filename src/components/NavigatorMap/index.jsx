import { useState, useRef } from 'react';

const MapImg = ({ src, style, onLoad }) => {
  const handleOnLoad = (e) => {
    const { width, height } = e.target;
    onLoad?.({ width, height });
  };
  return <img src={src} style={style} alt="mapImg" onLoad={handleOnLoad} />;
};

const NavigatorMap = ({ src, children }) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef();

  const onWheel = (e) => {
    const isScaleUp = e.deltaY < 0;
    setScale((prevScale) =>
      isScaleUp ? Math.min(prevScale + 0.1, 2) : Math.max(prevScale - 0.1, 0.1)
    );
  };

  const onMapImgLoad = ({ width: mw, height: mh }) => {
    const container = containerRef.current;
    const { clientWidth: cw, clientHeight: ch } = container;

    const isHorizontalMap = mw >= mh;
    let scaleTo = 1;
    if (isHorizontalMap) {
      // 水平地图尺寸，根据容器宽计算缩放
      scaleTo = Math.max(cw / mw, 0.1);
    } else {
      // 垂直地图尺寸，根据容器高计算缩放
      scaleTo = Math.max(ch / mh, 0.1);
    }

    // 当地图比容器小，使用地图原尺寸，不进行缩放
    setScale(Math.min(scaleTo, 1));
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'red',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      ref={containerRef}
      onWheel={onWheel}
    >
      <MapImg
        src={src}
        style={{
          display: 'block',
          transform: `scale(${scale})`,
        }}
        onLoad={onMapImgLoad}
      />
    </div>
  );
};

NavigatorMap.Image = Image;

export default NavigatorMap;
