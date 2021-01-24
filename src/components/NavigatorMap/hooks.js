import { useEffect, useRef } from 'react';

// 通过鼠标滚轮缩放地图大小
export const useWheelScale = (containerRef, setScale) => {
  useEffect(() => {
    const container = containerRef.current;

    const onWheel = (e) => {
      e.preventDefault();

      const isScaleUp = e.deltaY < 0;
      setScale((prevScale) =>
        isScaleUp
          ? Math.min(prevScale + 0.1, 2)
          : Math.max(prevScale - 0.1, 0.1)
      );
    };

    container.addEventListener('wheel', onWheel);

    return () => {
      container.removeEventListener('wheel', onWheel);
    };
  }, [containerRef, setScale]);
};

// 在容器中点击拖动移动地图图片位置
export const useDrag = (containerRef, mapImgRef, setMapPosition) => {
  const dragBasePosition = useRef({ x: null, y: null });

  useEffect(() => {
    const container = containerRef.current;

    const handleDragStart = (e) => {
      // 未载入地图图片时不处理
      const mapImg = mapImgRef.current;
      if (!mapImg) return;

      const { clientX: x, clientY: y } = e.touches ? e.touches[0] : e;
      dragBasePosition.current = {
        x,
        y,
      };

      // 同步当前的地图图片的position
      setMapPosition({
        x: mapImg.offsetLeft,
        y: mapImg.offsetTop,
      });

      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('touchmove', handleDragMove);
    };

    const handleDragEnd = () => {
      dragBasePosition.current = {
        x: null,
        y: null,
      };

      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('touchmove', handleDragMove);
    };

    const handleDragMove = (e) => {
      // 地图需加载完成
      const mapImg = mapImgRef.current;
      if (!mapImg) return;

      // 需要基坐标
      const base = dragBasePosition.current;
      if (!base.x) return;

      // 计算基于基坐标的移动值
      const { clientX: x, clientY: y } = e.touches ? e.touches[0] : e;
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

    container.addEventListener('mousedown', handleDragStart);
    container.addEventListener('touchstart', handleDragStart);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);

    return () => {
      container.removeEventListener('mousedown', handleDragStart);
      container.removeEventListener('touchstart', handleDragStart);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [containerRef, mapImgRef, setMapPosition]);
};
