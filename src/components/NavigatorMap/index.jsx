import { useState, useRef } from 'react';
import { useDrag, useWheelScale } from './hooks';

export const RobotIcon = ({ position = {} }) => {
  return (
    <svg
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: `rotate(${position.angle}deg)`,
        transition: '0.5s',
        width: '1em',
        height: '1em',
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 22 22"
    >
      <defs>
        <clipPath>
          <path fill="#00f" fillOpacity=".514" d="m-7 1024.36h34v34h-34z" />
        </clipPath>
        <clipPath>
          <path fill="#aade87" fillOpacity=".472" d="m-6 1028.36h32v32h-32z" />
        </clipPath>
      </defs>
      <path
        d="m345.44 248.29l-194.29 194.28c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744l171.91-171.91-171.91-171.9c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.29 194.28c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373"
        transform="matrix(.03541-.00013.00013.03541 2.98 3.02)"
        fill="#eb3c3c"
      />
    </svg>
  );
};

const NavigatorMap = ({ src, children, onPositionSelect }) => {
  const [scale, setScale] = useState(1);
  // 记录scale初始值，用于reset
  const initScale = useRef(1);
  const [mapPosition, setMapPosition] = useState({
    x: undefined,
    y: undefined,
  });
  const containerRef = useRef();
  const mapRef = useRef();
  useWheelScale(containerRef, setScale);
  useDrag(containerRef, mapRef, setMapPosition);

  // 加载地图完成时计算缩放，将地图图片缩小或以原始大小显示在容器中
  const onMapImgLoad = (e) => {
    const container = containerRef.current;
    const { clientWidth: cw, clientHeight: ch } = container;

    const { width: mw, height: mh } = e.target;
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
    scaleTo = Math.min(scaleTo, 1);
    initScale.current = scaleTo;
    setScale(scaleTo);
  };

  // 双击选择导航目录位置
  const handlePositionSelect = (e) => {
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    onPositionSelect?.({ x, y });
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#7e7e7e',
        overflow: 'hidden',
        userSelect: 'none',
        touchAction: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
      ref={containerRef}
    >
      <div
        ref={mapRef}
        style={{
          position: 'absolute',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          top: mapPosition.y,
          left: mapPosition.x,
        }}
      >
        <img
          src={src}
          style={{
            display: 'block',
            userSelect: 'none',
          }}
          onLoad={onMapImgLoad}
          onDragStart={(e) => e.preventDefault()}
          onDoubleClick={handlePositionSelect}
          alt="mapImg"
        />
        {children}
      </div>
      <button
        style={{ position: 'absolute', bottom: '1em', right: '1em' }}
        onClick={() => {
          setMapPosition({ x: undefined, y: undefined });
          setScale(initScale.current);
        }}
      >
        reset
      </button>
    </div>
  );
};

NavigatorMap.Image = Image;

export default NavigatorMap;
