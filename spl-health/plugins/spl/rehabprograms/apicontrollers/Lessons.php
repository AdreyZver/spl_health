<?php namespace Spl\Rehabprograms\ApiControllers;

use Spl\Rehabprograms\Models\Lesson;
use Spl\Rehabprograms\Models\Program;
use Spl\Rehabprograms\Models\CompletedLesson;
use Spl\Rehabprograms\Models\UserProgram;
use Spl\Rehabprograms\Models\LessonIndicators;
use Spl\Rehabprograms\Dictionaries\LessonState;
use Input;
use ValidationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use RLuders\JWTAuth\Classes\JWTAuth;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

/**
 * Lessons API Controller
 */
class Lessons extends Controller
{

    public function index(JWTAuth $auth): JsonResponse
    {
        $user = $auth->user();

        $programId = Input::get('program_id');
        if (!$programId) {
            throw new BadRequestException('Необходимо указать поле program_id');
        }

        $program = Program::find($programId);
        if (!$program) {
            throw new NotFoundHttpException('Програма не найдена');
        }

        $userProgram = UserProgram::where(
            'user_id', $user->id
         )->where(
            'program_id', $program->id
         )->first();
        if (!$userProgram) {
            throw new BadRequestException('Необходимо начать программу');
        }

        $programLessons = $program->lessons->load('exercises');
        $completedLessons = CompletedLesson::where(
            'user_program_id', $userProgram->id
        )->get();

        $programLessons = array_map(function($programLesson) use ($completedLessons) {

            $isLessonCompleted = in_array(
                $programLesson['id'],
                array_column($completedLessons->toArray(), 'lesson_id')
            );

            if ($isLessonCompleted) {
                $programLesson['state'] = LessonState::COMPLETED;
            } else {
                $programLesson['state'] = LessonState::UNCOMPLETED;
            }

            return $programLesson;
        }, $programLessons->toArray());

        return response()->json($programLessons);
    }

    public function getOne($lessonId): JsonResponse
    {
        $lesson = Lesson::find($lessonId);

        if (!$lesson) {
            throw new NotFoundHttpException('Занятие не найдено');
        }

        return response()->json($lesson->load('exercises'));
    }

    public function completeLesson($lessonId, JWTAuth $auth)
    {
        $user = $auth->user();
        $lesson = Lesson::find($lessonId);

        if (!$lesson) {
            throw new NotFoundHttpException('Занятие не найдено');
        }

        $program = $lesson->programs;
        $userProgram = UserProgram::where(
           'user_id', $user->id
        )->where(
           'program_id', $program->id
        )->first();

        if (!$userProgram) {
            throw new BadRequestException('Некоректный запрос');
        }

        $isCompleted = !!CompletedLesson::where(
            'user_program_id', $userProgram->id
        )->where(
            'lesson_id', $lesson->id
        )->first();

        if ($isCompleted) {
            throw new BadRequestException('Занятие уже завершено');
        } else {
            $completedLesson = new CompletedLesson;
            $completedLesson->user_program_id = $userProgram->id;
            $completedLesson->lesson_id = $lesson->id;

            $completedLesson->save();
        }
    }

    public function createIndicators($lessonId, JWTAuth $auth): void
    {
        $user = $auth->user();
        $lesson = Lesson::find($lessonId);

        if (!$lesson) {
            throw new NotFoundHttpException('Занятие не найдено');
        }

        $program = $lesson->programs;

        $userProgram = UserProgram::where(
            'user_id', $user->id
        )->where(
            'program_id', $program->id
        )->first();

        if (!$userProgram) {
            throw new BadRequestException('Невозможно сохранить показатели для указанного занятия');
        }

        $completedLesson = CompletedLesson::where(
            'user_program_id', $userProgram->id
        )->where(
            'lesson_id', $lessonId
        )->first();

        if (!$completedLesson) {
            throw new BadRequestException('Занятие еще не завершено');
        }

        $isIndicatorsSaved = $completedLesson->indicators;

        if ($isIndicatorsSaved) {
            throw new BadRequestException('Показатели уже сохранены');
        } else {
            $indicators = Input::get('indicators');

            if (!$indicators) {
                //TODO переделать на ValidationException
                throw new BadRequestException('Поле indicators обязательно для заполнения');
            } else {
                $lessonIndicators = new LessonIndicators;
                $lessonIndicators->completed_lesson_id = $completedLesson->id;
                $lessonIndicators->indicators = $indicators;
                $lessonIndicators->user_id = $user->id;

                $lessonIndicators->save();
            }
        }
    }

}
