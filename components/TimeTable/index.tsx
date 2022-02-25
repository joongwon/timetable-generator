import { FC, MouseEventHandler, useState } from "react";
import { Lecture, TimeSpan } from "../../types";
import styles from "./style.module.scss";

interface Props {
  lectures: Lecture[];
  modifiedId: string | null;
  times?: TimeSpan[];
  setTimes: (value: TimeSpan[]) => void;
}

const DAYS = "월화수목금".split("");
const TIMES = (() => {
  const result = [];
  for (let i = 9; i <= 21; ++i) {
    const h = i.toString();
    const hh = "0".repeat(2 - h.length) + h;
    result.push(`${hh}:00`);
  }
  return result;
})();

interface ClickAreaProps {
  row: number;
  col: number;
  onMouseDown: MouseEventHandler;
  onMouseUp: MouseEventHandler;
  onMouseEnter: MouseEventHandler;
}

const ClickArea: FC<ClickAreaProps> = ({
  row,
  col,
  onMouseDown,
  onMouseUp,
  onMouseEnter,
}) => {
  return (
    <div
      className={styles.clickArea}
      style={{
        gridRow: 2 * row + 2,
        gridColumn: col + 2,
      }}
      data-col={col}
      data-row={row}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

interface TimeSpanViewProps {
  timeSpan: TimeSpan;
  drag?: boolean;
  color?: string;
  content?: string;
  onContextMenu?: MouseEventHandler;
}

const TimeSpanView: FC<TimeSpanViewProps> = ({
  timeSpan,
  color,
  content,
  onContextMenu,
  drag,
}) => {
  return (
    <div
      className={drag ? styles.dragSpan : styles.timeSpan}
      style={{
        gridRowStart: 2 * timeSpan.timeBegin + 2,
        gridRowEnd: 2 * timeSpan.timeEnd + 3,
        gridColumn: timeSpan.day + 2,
        background: color,
      }}
      onContextMenu={onContextMenu ?? ((e) => e.preventDefault())}
    >
      {content}
    </div>
  );
};

const TimeTable: FC<Props> = ({ lectures, modifiedId, setTimes, times }) => {
  const [dragSpan, setDragSpan] = useState<TimeSpan | null>(null);
  const startDrag: MouseEventHandler<HTMLElement> = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    if (!times) return;
    const { row, col } = e.currentTarget.dataset;
    const nRow = Number(row),
      nCol = Number(col);
    setDragSpan({
      day: nCol,
      timeBegin: nRow,
      timeEnd: nRow,
    });
  };
  const endDrag = () => {
    if (!dragSpan || !times) return;
    setTimes([...times, dragSpan]);
    setDragSpan(null);
  };
  const cancelDrag = () => setDragSpan(null);
  const moveDrag: MouseEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    const { row, col } = e.currentTarget.dataset;
    const nRow = Number(row),
      nCol = Number(col);
    if (nCol !== dragSpan?.day) return;
    if (nRow < dragSpan.timeBegin)
      setDragSpan({ ...dragSpan, timeEnd: dragSpan.timeBegin });
    else setDragSpan({ ...dragSpan, timeEnd: nRow });
  };
  const removeTimeSpan = (i: number) => {
    if (times) setTimes(times.slice(0, i).concat(times.slice(i + 1)));
  };
  return (
    <div className={styles.timeTable} onMouseLeave={cancelDrag}>
      <div className={styles.colHeader} />
      {DAYS.map((day) => (
        <div key={day} className={styles.colHeader}>
          {day}
        </div>
      ))}
      {TIMES.map((time) => (
        <div key={time} className={styles.rowHeader}>
          {time}
        </div>
      ))}
      {DAYS.flatMap((_, col) =>
        TIMES.flatMap((_, row) => [
          <ClickArea
            key={`${row}-${col}`}
            onMouseEnter={moveDrag}
            onMouseDown={startDrag}
            onMouseUp={endDrag}
            col={col}
            row={row}
          />,
          <ClickArea
            key={`${row + 0.5}-${col}`}
            onMouseEnter={moveDrag}
            onMouseDown={startDrag}
            onMouseUp={endDrag}
            col={col}
            row={row + 0.5}
          />,
        ])
      )}
      {lectures.map((lecture) =>
        lecture.times.map((time, i) => (
          <TimeSpanView
            timeSpan={time}
            key={`${lecture.id}-${time.day}-${time.timeBegin}`}
            color={lecture.color}
            content={lecture.name}
            onContextMenu={(e) => {
              e.preventDefault();
              if (times && lecture.id === modifiedId) removeTimeSpan(i);
            }}
          />
        ))
      )}
      {dragSpan && <TimeSpanView timeSpan={dragSpan} drag />}
    </div>
  );
};

export default TimeTable;
