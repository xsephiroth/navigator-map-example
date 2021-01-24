import { useState, useRef, forwardRef } from 'react';
import { useDrag } from './hooks';

const MapImg = forwardRef(({ src, onLoad, ...props }, ref) => {
  const handleOnLoad = (e) => {
    const { width, height } = e.target;
    onLoad?.({ width, height });
  };
  return (
    <img src={src} alt="mapImg" onLoad={handleOnLoad} ref={ref} {...props} />
  );
});

const NavigatorMap = ({ src, children }) => {
  const [scale, setScale] = useState(1);
  const [mapPosition, setMapPosition] = useState({
    x: undefined,
    y: undefined,
  });
  const containerRef = useRef();
  const mapImgRef = useRef();
  useDrag(containerRef, mapImgRef, setMapPosition);

  // 鼠标滚轮缩放
  const onWheel = (e) => {
    const isScaleUp = e.deltaY < 0;
    setScale((prevScale) =>
      isScaleUp ? Math.min(prevScale + 0.1, 2) : Math.max(prevScale - 0.1, 0.1)
    );
  };

  // 加载地图完成时计算缩放，将地图图片缩小或以原始大小显示在容器中
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
        backgroundColor: '#7e7e7e',
        overflow: 'hidden',
        userSelect: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
      ref={containerRef}
      onWheel={onWheel}
    >
      <MapImg
        src={src}
        ref={mapImgRef}
        style={{
          display: 'block',
          userSelect: 'none',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          position: 'absolute',
          top: mapPosition.y,
          left: mapPosition.x,
        }}
        onLoad={onMapImgLoad}
        onDragStart={(e) => e.preventDefault()}
      />
    </div>
  );
};

NavigatorMap.Image = Image;

export default NavigatorMap;
