import { useState, useRef, forwardRef } from 'react';

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
  const dragBasePosition = useRef({ x: null, y: null });

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

  const handleDragStart = (e) => {
    // 未载入地图图片时不处理
    const mapImg = mapImgRef.current;
    if (!mapImg) return;

    const { clientX: x, clientY: y } = e;
    dragBasePosition.current = {
      x,
      y,
    };

    // 同步当前的地图图片的position
    setMapPosition({
      x: mapImg.offsetLeft,
      y: mapImg.offsetTop,
    });
  };

  const handleDragEnd = () => {
    dragBasePosition.current = {
      x: null,
      y: null,
    };
  };

  const handleDragMove = (e) => {
    // 地图需加载完成
    const mapImg = mapImgRef.current;
    if (!mapImg) return;

    // 需要基坐标
    const base = dragBasePosition.current;
    if (!base.x) return;

    // 计算基于基坐标的移动值
    const { clientX: x, clientY: y } = e;
    const offsetX = x - base.x;
    const offsetY = y - base.y;

    // 更新地图图片position
    setMapPosition((prev) => ({
      x: prev.x + offsetX,
      y: prev.y + offsetY,
    }));

    // 更新基坐标用于下次计算移动值
    base.x = x;
    base.y = y;
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
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDragMove}
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
