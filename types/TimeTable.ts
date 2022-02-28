import { nanoid } from "nanoid";

export interface PureTimeSlot {
  day: number;
  timeBegin: number;
  timeEnd: number;
  lectureId?: string;
}

export interface TimeSlot extends PureTimeSlot {
  lectureId: string;
}

const slotIntersect = (a: PureTimeSlot, b: PureTimeSlot) => {
  if (a.day === b.day) {
    if (a.timeBegin > b.timeBegin) {
      return b.timeEnd >= a.timeBegin;
    } else if (a.timeBegin < b.timeBegin) {
      return a.timeEnd >= b.timeBegin;
    } else return true;
  }
  return false;
};

export interface Lecture {
  id: string;
  color: string;
  description: string;
}

export interface TimeTable {
  lectures: Lecture[];
  slots: TimeSlot[];
}

const generateColor = () => `hsl(${Math.floor(Math.random() * 360)}, 80%, 80%)`;

const emptyLecture = (id: string): Lecture => ({
  color: generateColor(),
  description: "",
  id,
});

export const addTimeSlot = (tt: TimeTable, slot: PureTimeSlot): TimeTable => {
  if (tt.slots.some((oldSlot) => slotIntersect(oldSlot, slot))) return tt;
  if (slot.lectureId === undefined) {
    const lecture = emptyLecture(nanoid());
    return {
      lectures: [...tt.lectures, lecture],
      slots: [
        ...tt.slots,
        {
          ...slot,
          lectureId: lecture.id,
        },
      ],
    };
  }
  // slot has non-undefined lectureId
  else if (tt.slots.find((oldSlot) => oldSlot.lectureId === slot.lectureId)) {
    return {
      lectures: tt.lectures,
      slots: [...tt.slots, slot as TimeSlot],
    };
  } else {
    const lecture = emptyLecture(slot.lectureId);
    return {
      lectures: [...tt.lectures, lecture],
      slots: [...tt.slots, slot as TimeSlot],
    };
  }
};

export const removeTimeSlot = (
  tt: TimeTable,
  slot: PureTimeSlot
): TimeTable => {
  const index = tt.slots.findIndex(
    (oldSlot) =>
      oldSlot.day === slot.day && oldSlot.timeBegin === slot.timeBegin
  );
  if (index < 0) return tt;
  const lectureId = tt.slots[index].lectureId;
  const newSlots = tt.slots.slice(0, index).concat(tt.slots.slice(index + 1));
  if (newSlots.every((oldSlot) => oldSlot.lectureId !== lectureId)) {
    return {
      lectures: tt.lectures.filter((lecture) => lecture.id !== lectureId),
      slots: newSlots,
    };
  } else {
    return {
      lectures: tt.lectures,
      slots: newSlots,
    };
  }
};

export const updateLecture = (tt: TimeTable, lecture: Lecture): TimeTable => {
  return {
    lectures: tt.lectures.map((oldLecture) =>
      oldLecture.id === lecture.id ? lecture : oldLecture
    ),
    slots: tt.slots,
  };
};
