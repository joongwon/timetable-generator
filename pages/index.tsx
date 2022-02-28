import { NextPage } from "next";
import styles from "../styles/Home.module.scss";
import TimeTableEditor from "../components/TimeTableEditor";
import { TimeTable } from "../types/TimeTable";
import { useState } from "react";
import Head from "next/head";

const Home: NextPage = () => {
  const [tt, setTt] = useState<TimeTable>({
    lectures: [],
    slots: [],
  });
  return (
    <>
      <Head>
        <title>시간표 만들기</title>
      </Head>
      <div className={styles.columnsContainer}>
        <TimeTableEditor
          value={tt}
          onChange={setTt}
          timeBegin={9}
          timeEnd={21}
        />
      </div>
    </>
  );
};

export default Home;
