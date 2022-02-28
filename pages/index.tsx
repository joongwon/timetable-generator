import { NextPage } from "next";
import styles from "../styles/Home.module.scss";
import TimeTableEditor from "../components/TimeTableEditor";
import { TimeTable } from "../types/TimeTable";
import { useState } from "react";
import Head from "next/head";
import { Slider } from "@mui/material";

const Home: NextPage = () => {
  const [tt, setTt] = useState<TimeTable>({
    lectures: [],
    slots: [],
  });
  const [timeBegin, setTimeBegin] = useState(9);
  const [timeEnd, setTimeEnd] = useState(21);
  return (
    <>
      <Head>
        <title>시간표 만들기</title>
      </Head>
      <div className={styles.columnsContainer}>
        <TimeTableEditor
          value={tt}
          onChange={setTt}
          timeBegin={timeBegin}
          timeEnd={timeEnd}
        />
        <footer>
          <Slider
            value={[timeBegin, timeEnd]}
            onChange={(e, v) => {
              const l = v as number[];
              setTimeBegin(l[0]);
              setTimeEnd(l[1]);
            }}
            marks
            step={1}
            min={8}
            max={24}
            valueLabelDisplay="on"
          />
          <a href={"https://github.com/joongwon/timetable-generator"}>github</a>
        </footer>
      </div>
    </>
  );
};

export default Home;
