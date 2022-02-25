import { FC } from "react";
import { Lecture } from "../../types";
import { Button, TextField, ToggleButton } from "@mui/material";

interface Props {
  lecture: Lecture;
  setLecture: (value: Lecture) => void;
  removeLecture: () => void;
  toggleEditTimes: () => void;
  isTimesEdited: boolean;
}
const LectureComponent: FC<Props> = ({
  lecture,
  setLecture,
  removeLecture,
  toggleEditTimes,
  isTimesEdited,
}) => {
  return (
    <div>
      <TextField
        value={lecture.name}
        onChange={(e) => setLecture({ ...lecture, name: e.target.value })}
      />
      <input
        value={lecture.color}
        type="color"
        onChange={(e) => setLecture({ ...lecture, color: e.target.value })}
      />
      <ToggleButton
        value={"edit"}
        selected={isTimesEdited}
        onChange={toggleEditTimes}
      >
        시간표 수정
      </ToggleButton>
      <Button onClick={removeLecture}>삭제</Button>
    </div>
  );
};

export default LectureComponent;
