
import { useState, useRef, useEffect, createRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import cn from 'classnames';
import { Responses404 } from '@consta/uikit/Responses404';
import { Button } from "@consta/uikit/Button";
import { SkeletonText, SkeletonBrick } from "@consta/uikit/Skeleton";
import { LessonInformation } from "../components/Lesson/LessonInformation/LessonInformation";
import { LessonsAPI, ProgramsAPI, UserAPI } from "../app/API/api";
import { LessonsList } from "../components/Lesson/LessonsList/LessonsList";
import { ExerciseCard } from "../components/Lesson/Exercises/ExerciseCard/ExerciseCard";
import { ERROR_CODES, LessonStates } from "../app/constants";
import CalendarWithNotes from "../components/CalendarWithNotes/CalendarWithNotes";
import { openMeetingsAPI } from "../app/API/api";

import styles from './ProgramsLessonPage.module.css';
import { IndicatorsForm } from "../components/Lesson/IndicatorsForm/IndicatorsForm";
import { useAuth } from "../hooks/useAuth";

const findActiveLesson = (lessons) => {
  const activeLesson = [...lessons].sort(
    (a, b) => a.position_in_program - b.position_in_program
  ).find((lesson) => lesson.state === LessonStates.uncompleted);

  return activeLesson ? activeLesson : lessons[lessons.length - 1];
}

export const ProgramsLessonPage = () => {

  const [lessons, setLessons] = useState([]);
  const [currentLessonOnTab, setCurrentLessonOnTab] = useState({});
  const [currentFilterLessons, setCurrentFilterLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompletePeinding, setIsCompletePeinding] = useState(false);
  const [isIndicatorsModalOpen, setIsIndicatorsModalOpen] = useState(false);
  const {user, isOrdinaryUser} = useAuth();
  const lessonsCheckboxes = useRef({});

  const { programId, repetitor } = useParams();
  let repetorCheck = false;
  if (repetitor === "with") {repetorCheck = true}

  const [isWithRepetitor, setIsWithRepetitor] = useState(repetorCheck);

  const navigate = useNavigate();

  const getLessons = async () => {
    setIsLoading(true);

    try {
      const lessons = await LessonsAPI.getLessons({ programId });
      setLessons(lessons);
      setActiveLesson(findActiveLesson(lessons));
      setCurrentLessonOnTab(lessons[0]);
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      if (data.code === ERROR_CODES.not_found) {
        setIsNotFound(true);
      } else {
        toast.error(`${data.code}: ${data.message}`);
      }
    }

    setIsLoading(false);
  }

  const getFilterLessonsTabs = (lessons) => {
    return lessons.map((value,index) => {
      return (
        <>
        <div> 
          <label htmlFor={"lesson_checkbox_id_" + value.id}>{value.name}</label>
          <input
            ref={(elem) => {lessonsCheckboxes.current["lesson_checkbox_id_" + value.id] = elem}}
            id={"lesson_checkbox_id_" + value.id}
            type="checkbox"
            onChange={handleFilterLessonsNotes}/>
        </div>
        </>
      );
    });
  }

  const getProgramIndicators = async () => {
    try {
      const indicators = await ProgramsAPI.getProgramIndicators({ programId });

      const isIndicatorsUnset = indicators
        && Object.keys(indicators).length === 0
        && Object.getPrototypeOf(indicators) === Object.prototype;

      if (isIndicatorsUnset) {
        setIndicators(null);
      } else {
        setIndicators(indicators);
      }
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`Показатели - ${data.code}: ${data.message}`);
    }
  }

  const completeLesson = async () => {
    setIsCompletePeinding(true);

    try {
      await LessonsAPI.completeLesson({ lessonId: activeLesson.id });
      setIsIndicatorsModalOpen(true);
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`${data.code}: ${data.message}`);
    }

    setIsCompletePeinding(false);
  }

  useState(() => {
    getLessons();
    getProgramIndicators();
  }, [programId]);

  const handleLessonSelect = (lesson) => {
    setCurrentLessonOnTab(lesson);
    setActiveLesson(lesson);
  }

  const handleLessonComlete = () => {
    completeLesson();
  }

  const handleIndicatorsModalClose = () => {
    setIsIndicatorsModalOpen(false);
    getLessons();
  }

  const handleConferenceLogin = () => {
    const input = document.getElementById('link__OM__input');
    const link = input.getAttribute("value");

    window.open(link);
  }

  const handleConferenceCreate = async () => {
    const input = document.getElementById('link__OM__input');

    const roomHashResult = (await openMeetingsAPI.getRoomHash(user,isOrdinaryUser,currentLessonOnTab)).message;

    input.setAttribute("value",roomHashResult);
    input.value = roomHashResult;
  }

  const handleFilterLessonsNotes = () => {
    const lessonsIds = [];

    for (let key in lessonsCheckboxes.current) {
      if (lessonsCheckboxes.current[key].checked) {
        const lessonId = parseInt(lessonsCheckboxes.current[key].id.split('_').pop());
        lessonsIds.push(lessonId);
      }
    }

    const lessonsArray = [];

    lessonsIds.forEach((value,index) => {
      lessonsArray.push(...lessons.filter(elem => elem.id == value));
    });

    setCurrentFilterLessons(lessonsArray);
  }

  return (
    <div className={cn(styles.content, isNotFound ? styles.content_not_found : '')}>
      {isLoading ? (
        <>
          <div className={styles.lesson__description}>
            <SkeletonBrick
              width="500px"
              height="80px"
            />
            <SkeletonText rows={10}/>
          </div>
          <div className={styles.lesson__tabs}>
            <SkeletonBrick
              width="100%"
              height="200px"
            />
          </div>
          <div className={styles.lesson__exercises}>
            {Array.apply(null, {length: 4}).map((item, index) => (
              <SkeletonBrick
                key={`sceleton_${index}`}
                width="100%"
                height="250px"
              />
            ))}
          </div>
        </>
      ) : (
        <>
          {isNotFound ? (
            <div className={styles.not_found}>
              <Responses404
                actions={
                  <Button
                    size="m"
                    view="ghost"
                    label="Вернуться назад"
                    onClick={() => navigate(-1)}
                  />
                }
              />
            </div>
          ) : (
            <>
              <div className={styles.lesson__description}>
                <LessonInformation lesson={activeLesson} />
              </div>
              <div className={styles.lesson__tabs}>
                <LessonsList
                  activeLesson={activeLesson}
                  lessons={lessons}
                  onLessonSelect={handleLessonSelect}
                />
                {isWithRepetitor ? (
                  <>
                  <p className={styles.filter__header}>Фильтр:</p>
                  {getFilterLessonsTabs(lessons)}
                  </>
                ):(<div/>)}
                {isWithRepetitor ? (<CalendarWithNotes lesson={currentFilterLessons} mode={'guest'}/>):(<div/>)}
                {isWithRepetitor ? (
                <>
                <div>
                  <input type="text" className={styles.input_conference_link} id="link__OM__input" placeholder="Введите ссылку на конференцию" value=""></input>
                  <Button
                    style={{marginTop: '8px'}}
                    size="m"
                    view="primary"
                    label="Войти в концеренцию"
                    onClick={handleConferenceLogin}
                  />
                  <Button
                    style={{marginTop: '8px'}}
                    size="m"
                    view="primary"
                    label="Сгенерировать ссылку на конференцию"
                    onClick={handleConferenceCreate}
                  />
                </div>
                </>) : (<div/>)}
              </div>
              <div className={styles.lesson__exercises}>
                {activeLesson?.exercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                  />
                ))}
                {activeLesson?.state === LessonStates.uncompleted && (
                  <Button
                    label="Завершить"
                    onClick={handleLessonComlete}
                    disabled={isIndicatorsModalOpen}
                    view="primary"
                    loading={isCompletePeinding}
                    className={styles.button_complete}
                  />
                )}
              </div>
              {indicators && activeLesson && (
                <IndicatorsForm
                  isOpen={isIndicatorsModalOpen}
                  indicators={indicators}
                  lessonId={activeLesson.id}
                  onModalClose={handleIndicatorsModalClose}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}