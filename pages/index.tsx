import { NextPage } from "next";
import styles from "../styles/Home.module.scss";
import { useState } from "react";
import { Lecture } from "../types";
import LectureList from "../components/LectureList";
import TimeTable from "../components/TimeTable";

const Home: NextPage = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [editedLectureId, setEditedLectureId] = useState<string | null>(null);
  return (
    <div className={styles.columnsContainer}>
      <LectureList
        lectures={lectures}
        setLectures={setLectures}
        editedLectureId={editedLectureId}
        setEditedLectureId={setEditedLectureId}
      />
      <TimeTable
        lectures={lectures}
        modifiedId={editedLectureId}
        setTimes={(value) =>
          setLectures(
            lectures.map((lecture) =>
              lecture.id === editedLectureId
                ? { ...lecture, times: value }
                : lecture
            )
          )
        }
        times={
          lectures.find((lecture) => lecture.id === editedLectureId)?.times
        }
      />
    </div>
  );
};

export default Home;
