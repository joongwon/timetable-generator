import { NextPage } from "next";
import styles from "../styles/Home.module.scss";
import TimeTableEditor from "../components/TimeTableEditor";
import { TimeTable } from "../types/TimeTable";
import { useState } from "react";

const Home: NextPage = () => {
  const [tt, setTt] = useState<TimeTable>({
    lectures: [],
    slots: [],
  });
  return (
    <div className={styles.columnsContainer}>
      <TimeTableEditor value={tt} onChange={setTt} timeBegin={9} timeEnd={21} />
    </div>
  );
};

export default Home;
