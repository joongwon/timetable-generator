import { FC, FocusEventHandler, useEffect, useMemo, useState } from "react";
import styles from "./style.module.scss";
import {
  addTimeSlot,
  Lecture,
  PureTimeSlot,
  removeTimeSlot,
  TimeTable,
  updateLecture,
} from "../../types/TimeTable";
import { nanoid } from "nanoid";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton } from "@mui/material";

interface Props {
  value: TimeTable;
  onChange: (value: TimeTable) => void;
  timeBegin: number;
  timeEnd: number;
}

const DAYS = "월화수목금".split("");

const makeTimes = (begin: number, end: number) => {
  let result = [];
  begin = Math.floor(begin);
  end = Math.floor(end) + 1;
  for (let i = begin; i < end; ++i) result.push(i);
  return result;
};
const TimeTableEditor: FC<Props> = ({
  value,
  onChange,
  timeBegin,
  timeEnd,
}) => {
  const TIMES = useMemo(
    () => makeTimes(timeBegin, timeEnd),
    [timeBegin, timeEnd]
  );
  const [dragSlot, setDragSlot] = useState<PureTimeSlot | null>(null);
  const lectureMap = useMemo(
    () =>
      new Map<string, Lecture>(
        value.lectures.map((lecture) => [lecture.id, lecture])
      ),
    [value.lectures]
  );
  const [editedLectureId, setEditedLectureId] = useState<string>();
  useEffect(() => setEditedLectureId(nanoid()), []);

  useEffect(() => {
    window.onclick = () => {
      setEditedLectureId(nanoid());
      const active = window.document.activeElement;
      if (active instanceof HTMLElement) {
        active.blur();
      }
    };
    window.onkeydown = (e) => {
      if (e.key !== "Escape") return;
      setEditedLectureId(nanoid());
      const active = window.document.activeElement;
      if (active instanceof HTMLElement) {
        active.blur();
      }
    };
  }, []);
  useEffect(() => {
    window.onmouseup = () => {
      if (!dragSlot) return;
      onChange(addTimeSlot(value, dragSlot));
      setDragSlot(null);
    };
  }, [dragSlot, onChange, value]);

  const slotOnGrid = (slot: PureTimeSlot) => ({
    gridRowStart: (slot.timeBegin - timeBegin) * 2 + 3,
    gridRowEnd: (slot.timeEnd - timeBegin) * 2 + 4,
    gridColumn: slot.day + 3,
  });
  return (
    <div
      className={styles.grid}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {DAYS.map((day, i) => (
        <div
          className={styles.colHeader}
          style={{ gridColumn: i + 3 }}
          key={day}
        >
          {day}
        </div>
      ))}
      {TIMES.flatMap((time, i) => [
        <div
          className={styles.rowHeader}
          key={time}
          style={{ gridRowStart: i * 2 + 2 }}
        >{`${time}:00`}</div>,
        <div
          className={styles.scale}
          key={`${time}-scale`}
          style={{ gridRow: i * 2 + 2 }}
        />,
      ])}
      {DAYS.flatMap((day, i) =>
        TIMES.flatMap((time) => [time - 0.5, time]).map((time, j) => (
          <div
            className={styles.clickArea}
            key={`${day}-${time}`}
            style={{ gridColumn: i + 3, gridRow: j + 2 }}
            onMouseDown={(e) => {
              if (e.button !== 0) return;
              e.preventDefault();
              setDragSlot({
                day: i,
                timeBegin: time,
                timeEnd: time,
                lectureId: editedLectureId,
              });
            }}
            onMouseEnter={() => {
              if (!dragSlot) return;
              if (dragSlot.timeBegin >= time)
                setDragSlot({ ...dragSlot, timeEnd: dragSlot.timeBegin });
              else setDragSlot({ ...dragSlot, timeEnd: time });
            }}
          />
        ))
      )}
      {dragSlot && (
        <div className={styles.draggedArea} style={slotOnGrid(dragSlot)} />
      )}
      {value.slots.map((slot) => {
        const lecture = lectureMap.get(slot.lectureId);
        const edited = slot.lectureId === editedLectureId;
        return (
          <div
            key={`${slot.day}-${slot.timeBegin}`}
            className={styles.slotContainer}
            style={{
              ...slotOnGrid(slot),
            }}
          >
            <TimeSlotView
              lecture={lecture}
              edited={edited}
              onChange={(lecture) => onChange(updateLecture(value, lecture))}
              onFocus={() => setEditedLectureId(slot.lectureId)}
              onRemove={() => onChange(removeTimeSlot(value, slot))}
            />
          </div>
        );
      })}
    </div>
  );
};

interface TimeSlotViewProps {
  lecture?: Lecture;
  edited: boolean;
  onFocus: FocusEventHandler;
  onChange: (lecture: Lecture) => void;
  onRemove: () => void;
}

const TimeSlotView: FC<TimeSlotViewProps> = ({
  lecture,
  edited,
  onFocus,
  onChange,
  onRemove,
}) => {
  return (
    <div
      className={`${styles.timeSlot} ${edited ? styles.rotatingDash : ""}`}
      style={{
        backgroundColor: lecture?.color,
      }}
    >
      <textarea
        value={lecture?.description}
        onChange={(e) =>
          lecture &&
          onChange({
            ...lecture,
            description: e.target.value,
          })
        }
        onFocus={onFocus}
      />
      <IconButton onClick={onRemove} sx={{ padding: 0.1 }}>
        <ClearIcon />
      </IconButton>
    </div>
  );
};

export default TimeTableEditor;
