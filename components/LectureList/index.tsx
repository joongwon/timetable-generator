import { FC } from "react";
import { Lecture } from "../../types";
import styles from "./style.module.scss";
import LectureComponent from "../LectureComponent";
import { nanoid } from "nanoid";
import { Button } from "@mui/material";

interface Props {
  lectures: Lecture[];
  setLectures: (value: Lecture[]) => void;
  editedLectureId: string | null;
  setEditedLectureId: (value: string | null) => void;
}

const LectureList: FC<Props> = ({
  lectures,
  setLectures,
  editedLectureId,
  setEditedLectureId,
}) => {
  return (
    <ul className={styles.lectureList}>
      {lectures.map((lecture, i) => (
        <li key={lecture.id}>
          <LectureComponent
            lecture={lecture}
            setLecture={(value) =>
              setLectures(
                lectures
                  .slice(0, i)
                  .concat(value)
                  .concat(lectures.slice(i + 1))
              )
            }
            removeLecture={() =>
              setLectures(lectures.slice(0, i).concat(lectures.slice(i + 1)))
            }
            toggleEditTimes={() =>
              setEditedLectureId(
                editedLectureId === lecture.id ? null : lecture.id
              )
            }
            isTimesEdited={editedLectureId === lecture.id}
          />
        </li>
      ))}
      <li>
        <Button
          onClick={() =>
            setLectures([
              ...lectures,
              { id: nanoid(), times: [], name: "", color: "#eeeeee" },
            ])
          }
        >
          추가
        </Button>
      </li>
    </ul>
  );
};

export default LectureList;
