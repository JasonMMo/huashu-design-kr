/**
 * animations.jsx — 타임라인 애니메이션 엔진
 *
 * Stage + Sprite 패턴, Remotion에서 영감을 받아 경량화.
 *
 * 내보내기 (window.Animations에 마운트):
 * - Stage: 전체 애니메이션 컨테이너, 시간 및 컨트롤 제공
 * - Sprite: 시간 구간, start/end 범위 내에서 표시, 로컬 진행률 제공
 * - useTime(): 전역 시간 읽기 (초 단위)
 * - useSprite(): 로컬 진행률 읽기 {t: 0→1, elapsed: seconds, duration: seconds}
 * - Easing: {linear, easeIn, easeOut, easeInOut, spring, anticipation}
 * - interpolate(t, [input0, input1], [output0, output1], easing?)
 *
 * 사용법:
 *   <Stage duration={10}>
 *     <Sprite start={0} end={3}>
 *       <Title />
 *     </Sprite>
 *     <Sprite start={2} end={5}>
 *       <Subtitle />
 *     </Sprite>
 *   </Stage>
 *
 * Sprite 자식 컴포넌트에서 useSprite()로 현재 구간의 진행률을 읽을 수 있습니다.
 */

(function() {
  const { createContext, useContext, useState, useEffect, useRef, useCallback } = React;

  const TimeContext = createContext({ time: 0, duration: 10, playing: false });
  const SpriteContext = createContext(null);

  const Easing = {
    linear: t => t,
    easeIn: t => t * t,
    easeOut: t => 1 - (1 - t) * (1 - t),
    easeInOut: t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    // expoOut: Anthropic 수준의 주요 이징 (cubic-bezier(0.16, 1, 0.3, 1))
    // 빠르게 시작하고 천천히 감속 — 숫자 요소에 물리적 무게감 부여
    expoOut: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    // overshoot: 탄성 있는 토글/버튼 팝업 (cubic-bezier(0.34, 1.56, 0.64, 1))
    overshoot: t => {
      const c1 = 1.70158, c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    spring: t => {
      const c = (2 * Math.PI) / 3;
      return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c) + 1;
    },
    anticipation: t => {
      if (t < 0.2) return -0.3 * (t / 0.2) * (t / 0.2);
      const adjusted = (t - 0.2) / 0.8;
      return -0.012 + 1.012 * adjusted * adjusted * (3 - 2 * adjusted);
    },
  };

  function interpolate(t, input, output, easing) {
    const [inStart, inEnd] = input;
    const [outStart, outEnd] = output;

    if (t <= inStart) return outStart;
    if (t >= inEnd) return outEnd;

    let progress = (t - inStart) / (inEnd - inStart);
    if (easing) {
      progress = easing(progress);
    }

    return outStart + (outEnd - outStart) * progress;
  }

  function useTime() {
    const ctx = useContext(TimeContext);
    return ctx.time;
  }

  function useSprite() {
    const sprite = useContext(SpriteContext);
    if (!sprite) {
      return { t: 0, elapsed: 0, duration: 0 };
    }
    return sprite;
  }

  const stageStyles = {
    wrapper: {
      position: 'fixed',
      inset: 0,
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, sans-serif',
    },
    stageHolder: {
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
    },
    canvas: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transformOrigin: 'center center',
      background: '#111',
      overflow: 'hidden',
    },
    controls: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      color: '#fff',
      fontSize: 12,
      zIndex: 100,
    },
    button: {
      background: 'none',
      border: '1px solid rgba(255,255,255,0.3)',
      color: '#fff',
      padding: '6px 14px',
      borderRadius: 4,
      cursor: 'pointer',
      fontSize: 12,
    },
    timeDisplay: {
      fontFamily: 'ui-monospace, monospace',
      fontVariantNumeric: 'tabular-nums',
      minWidth: 90,
    },
    scrubber: {
      flex: 1,
      height: 4,
      background: 'rgba(255,255,255,0.2)',
      borderRadius: 2,
      position: 'relative',
      cursor: 'pointer',
    },
    scrubberFill: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      background: '#fff',
      borderRadius: 2,
      pointerEvents: 'none',
    },
    scrubberHandle: {
      position: 'absolute',
      top: '50%',
      width: 12,
      height: 12,
      background: '#fff',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
    },
  };

  function Stage({ duration = 10, width = 1920, height = 1080, fps = 60, loop = true, children, bgColor = '#fff' }) {
    const [time, setTime] = useState(0);
    const [playing, setPlaying] = useState(true);
    const [scale, setScale] = useState(1);
    const rafRef = useRef(null);
    const startTimeRef = useRef(performance.now());
    const canvasRef = useRef(null);

    // 녹화 모드: render-video.js가 goto 전에 window.__recording = true를 주입합니다.
    // 설정되면 loop=false로 강제하여 내보내기가 최종 프레임에서 종료되도록 합니다.
    // (수동으로 브라우저에서 볼 때는 __recording이 undefined이므로 계속 루프됩니다.)
    const effectiveLoop = (typeof window !== 'undefined' && window.__recording) ? false : loop;

    useEffect(() => {
      function updateScale() {
        const vw = window.innerWidth;
        const vh = window.innerHeight - 56;
        const s = Math.min(vw / width, vh / height);
        setScale(s);
      }
      updateScale();
      window.addEventListener('resize', updateScale);
      return () => window.removeEventListener('resize', updateScale);
    }, [width, height]);

    useEffect(() => {
      if (!playing) return;
      let cancelled = false;
      let last = null;

      function tick(now) {
        if (cancelled) return;
        if (last === null) {
          // 첫 번째 애니메이션 프레임. last=now로 설정하여 delta를 0에서 시작,
          // 동시에 비디오 내보내기 준비 완료를 알립니다.
          // 이 페어링이 중요: window.__ready는 WebM이 애니메이션 0프레임을 캡처하는
          // 정확한 순간에 true로 전환되어야 render-video.js의 트림 오프셋이
          // 애니메이션 이전 공백과 일치합니다.
          last = now;
          if (typeof window !== 'undefined') window.__ready = true;
        }
        const delta = (now - last) / 1000;
        last = now;
        setTime(prev => {
          const next = prev + delta;
          if (next >= duration) {
            // effectiveLoop는 window.__recording을 따릅니다 (내보내기 중 비루프 강제).
            // duration 직전에 멈춰 최종 프레임 상태를 유지합니다
            // (정확히 `duration`에서 끝나는 Sprite가 종료되는 것을 방지).
            return effectiveLoop ? 0 : duration - 0.001;
          }
          return next;
        });
        rafRef.current = requestAnimationFrame(tick);
      }

      // 폰트 로드 완료 후 타이머 시작 — 0프레임이 폴백 폰트 플래시가 아닌
      // 실제 "로딩 완료" 프레임이 되도록 합니다.
      const startAfterFonts = () => {
        if (cancelled) return;
        rafRef.current = requestAnimationFrame(tick);
      };
      if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
        document.fonts.ready.then(startAfterFonts);
      } else {
        startAfterFonts();
      }

      return () => {
        cancelled = true;
        cancelAnimationFrame(rafRef.current);
      };
    }, [playing, duration, effectiveLoop]);

    const handleScrub = useCallback((e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      setTime(Math.max(0, Math.min(duration, ratio * duration)));
    }, [duration]);

    const handleSeek = useCallback((e) => {
      handleScrub(e);
      setPlaying(false);
    }, [handleScrub]);

    const progress = time / duration;

    const ctx = {
      time,
      duration,
      playing,
      setPlaying,
      setTime,
    };

    const canvasStyle = {
      ...stageStyles.canvas,
      width,
      height,
      background: bgColor,
      transform: `translate(-50%, -50%) scale(${scale})`,
    };

    return (
      <TimeContext.Provider value={ctx}>
        <div style={stageStyles.wrapper}>
          <div style={stageStyles.stageHolder}>
            <div ref={canvasRef} style={canvasStyle}>
              {children}
            </div>
          </div>

          <div style={stageStyles.controls}>
            <button
              style={stageStyles.button}
              onClick={() => setPlaying(p => !p)}
            >
              {playing ? '⏸ 일시정지' : '▶ 재생'}
            </button>

            <button
              style={stageStyles.button}
              onClick={() => setTime(0)}
            >
              ⏮ 처음으로
            </button>

            <div style={stageStyles.timeDisplay}>
              {time.toFixed(2)}s / {duration.toFixed(2)}s
            </div>

            <div style={stageStyles.scrubber} onMouseDown={handleSeek}>
              <div style={{ ...stageStyles.scrubberFill, width: `${progress * 100}%` }} />
              <div style={{ ...stageStyles.scrubberHandle, left: `${progress * 100}%` }} />
            </div>
          </div>
        </div>
      </TimeContext.Provider>
    );
  }

  function Sprite({ start = 0, end, children, style }) {
    const { time } = useContext(TimeContext);
    const actualEnd = end == null ? Infinity : end;

    if (time < start || time >= actualEnd) {
      return null;
    }

    const duration = actualEnd - start;
    const elapsed = time - start;
    const t = duration === 0 ? 1 : Math.max(0, Math.min(1, elapsed / duration));

    const spriteValue = { t, elapsed, duration, start, end: actualEnd };

    return (
      <SpriteContext.Provider value={spriteValue}>
        <div style={{ position: 'absolute', inset: 0, ...style }}>
          {children}
        </div>
      </SpriteContext.Provider>
    );
  }

  if (typeof window !== 'undefined') {
    window.Animations = {
      Stage,
      Sprite,
      useTime,
      useSprite,
      Easing,
      interpolate,
    };
  }
})();
