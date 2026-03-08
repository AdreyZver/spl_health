<?php namespace Spl\Rehabprograms\ApiControllers;

use Spl\Rehabprograms\Models\Lesson;
use Spl\Rehabprograms\Models\Program;
use Spl\Rehabprograms\Models\UserProgram;
use Spl\Rehabprograms\Models\LessonIndicators;
use Spl\Rehabprograms\Dictionaries\ProgramState;
use Spl\Rehabprograms\Dictionaries\LessonState;
use Input;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use RLuders\JWTAuth\Classes\JWTAuth;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;


/**
 * UserPrograms API Controller
 */
class UserPrograms extends Controller
{

    public function getIndicators(JWTAuth $auth): JsonResponse
    {
        $user = $auth->user();

        $programId = Input::get('program_id');

        if (!$programId) {
            throw new BadRequestException('Необходимо указать поле program_id');
        }

        $program = Program::find($programId);

        if (!$program) {
            throw new NotFoundHttpException('Программа не найдена');
        }

        $userProgram = UserProgram::where(
            'user_id', $user->id
        )->where(
            'program_id', $program->id
        )->first();

        if (!$userProgram) {
            throw new NotFoundHttpException('Указанная программа не является активной');
        }

        $completedLessons = $userProgram->completed_lessons;
        $lesson_id = Input::get('lesson_id');

        if ($lesson_id) {
            if (!in_array(
                $lesson_id,
                array_column($completedLessons->toArray(), 'lesson_id')
            )) {
                throw new BadRequestException('Занятие еще не завершено');
            } else {
                $completedLessonIndex = array_search(
                    $lesson_id,
                    array_column($completedLessons->toArray(), 'lesson_id')
                );

                $completedLesson = $completedLessons[$completedLessonIndex];
                $lessonIndicators =  $completedLesson->indicators;

                $indicators = $lessonIndicators ? json_decode(
                    $lessonIndicators->indicators
                ) : [];

                return response()->json($indicators);
            }
        } else {
            $indicators = [];
            foreach ($completedLessons as $completedLesson) {
                $lessonData = Lesson::where('id', $completedLesson->lesson_id)->first();
                $lessonIndicators = $completedLesson->indicators;

                $indicators[] = [
                    'lesson_info' => $lessonData,
                    'indicators' => $lessonIndicators ? json_decode(
                        $lessonIndicators->indicators
                    ) : null,
                ];
            }

            return response()->json($indicators);
        }
    }

    public function getUserPrograms(JWTAuth $auth)
    {
        $user = $auth->user();
        $userPrograms = UserProgram::where('user_id', $user->id)->get();

        $userProgramsResponse = [];

        foreach ($userPrograms as $userProgram) {
            $program = $userProgram->program()->withTrashed()->first();
            $userProgram->load('completed_lessons');
            $userProgram->lessons = $program->lessons()->withTrashed()->get();

            $isProgramCompleted = count($userProgram->lessons) === count($userProgram->completed_lessons);

            foreach ($userProgram->lessons as $lesson) {
                $isLessonCompleted = in_array(
                    $lesson['id'],
                    array_column($userProgram->completed_lessons->toArray(), 'lesson_id')
                );

                if ($isLessonCompleted) {
                    $lesson->state = LessonState::COMPLETED;
                } else {
                    $lesson->state = LessonState::UNCOMPLETED;
                }
            }

            $programState = ProgramState::STARTED;

            if ($isProgramCompleted) {
                $programState = ProgramState::COMPLETED;
            }

            if (!$program->is_published) {
                $programState = ProgramState::HIDDEN;
            }

            if ($program->deleted_at) {
                $programState = ProgramState::DELETED;
            }

            $userProgramsResponse[] = [
                'id' => $program->id,
                'name' => $program->name,
                'lessons' => $userProgram->lessons,
                'completed_lessons' => $userProgram->completed_lessons,
                'state' => $programState,
            ];
        }

        return response()->json($userProgramsResponse);
    }
}
