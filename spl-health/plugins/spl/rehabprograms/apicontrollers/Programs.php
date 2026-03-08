<?php namespace Spl\Rehabprograms\ApiControllers;

use Spl\Rehabprograms\Models\Program;
use Spl\Rehabprograms\Models\Lesson;
use Spl\Rehabprograms\Models\Exercise;
use Spl\Rehabprograms\Models\Category;
use Spl\Rehabprograms\Models\UserProgram;
use Spl\Rehabprograms\Dictionaries\ProgramState;
use Input;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use RLuders\JWTAuth\Classes\JWTAuth;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

/**
 * Programs API Controller
 */
class Programs extends Controller
{

    public function index(JWTAuth $auth): JsonResponse
    {
        $categoryId = Input::get('category_id');

        if (!$categoryId) {
            throw new BadRequestException('Необходимо указать category_id');
        }

        $category = Category::find($categoryId);

        if (!$category) {
            throw new NotFoundHttpException('Категория не найдена');
        }

        $programs = $category->programs()->where('is_published', true)->get();
        $user = $auth->user();

        $userPrograms = UserProgram::where('user_id', $user->id)->get();

        foreach ($programs as $program) {
            $program->load('lessons');
        }

        $programs = array_map(function($program) use ($userPrograms) {
            $userProgramKey = array_search(
                $program['id'],
                array_column($userPrograms->toArray(), 'program_id')
            );

            if ($userProgramKey !== false) {
                $userProgram = $userPrograms[$userProgramKey];
                $completedLessons = $userProgram->completed_lessons;

                if (count($userProgram->completed_lessons->toArray()) === count($program['lessons'])) {
                    $program['state'] = ProgramState::COMPLETED;
                } else {
                    $program['state'] = ProgramState::STARTED;
                }
            } else {
                $program['state'] = ProgramState::NOT_STARTED;
            }

            return $program;
        }, $programs->toArray());

        return response()->json($programs);
    }

    public function startProgram($programId, JWTAuth $auth): void
    {
        $user = $auth->user();

        $programExist = Program::find($programId);

        if (!$programExist) {
            throw new NotFoundHttpException('Программа не найдена');
        }

        $isStarted = !!UserProgram::where(
            'user_id', $user->id
        )->where(
            'program_id', $programId
        )->first();

        if ($isStarted) {
            throw new BadRequestException('Программа уже начата');
        } else {
            $userProgram = new UserProgram;
            $userProgram->program_id = $programId;
            $userProgram->user_id = $user->id;

            $userProgram->save();
        }
    }

    public function getIndicators($programId)
    {
        $program = Program::find($programId);

        if (!$program) {
            throw new NotFoundHttpException('Программа не найдена');
        }

        return response()->json($program->indicators);
    }

    public function createProgram(JWTAuth $auth): void
    {
        $user = $auth->user();

        $programName = Input::get('program_name');
        $programDescription = Input::get('program_description');
        $categoryId = Input::get('category_id');

        if (!$programName) {
            throw new BadRequestException('Поле program_name обязательно для заполнения');
        }

        if (!$programDescription) {
            throw new BadRequestException('Поле program_description обязательно для заполнения');
        }

        if (!$categoryId) {
            throw new BadRequestException('Поле category_id обязательно для заполнения');
        }

        $program = new Program;
        $program->name = $programName;
        $program->description = $programDescription;
        $program->category_id = $categoryId;
        $program->user_id_creator = $user->id;

        $program->save();
    }

    public function getOrganizationProgram($programId, JWTAuth $auth) {
        $organization = $auth->user();

        if (!$organization->groups->contains('code', 'organization')) {
            throw new NotFoundHttpException('Метод не найден');
        }

        $organizationProgram = Program::where(
            'id', $programId
        )->where(
            'user_id_creator', $organization->id
        )->withTrashed()->with([
            'lessons' => fn ($query) => $query->withTrashed()->orderBy('position_in_program', 'asc')
        ])->first();

        foreach ($organizationProgram->lessons as $organizationProgramLesson) {
            $organizationProgramLesson->exercises = $organizationProgramLesson->exercises()->withTrashed()->orderBy('position_in_lesson')->get();
        }

        if ($organizationProgram->indicators == null) {
            $organizationProgram->indicators = [];
        }

        return response()->json($organizationProgram);
    }

    public function getOrganizationPrograms(JWTAuth $auth) {

        $organization = $auth->user();

        if (!$organization->groups->contains('code', 'organization')) {
            throw new NotFoundHttpException('Метод не найден');
        }

        $view = Input::get('view');

        if ($view == null) {
            $organizationPrograms = Program::where('user_id_creator', $organization->id)->withTrashed()->with([
                'lessons' => fn ($query) => $query->withTrashed()->orderBy('position_in_program', 'asc')
            ])->get();

            return response()->json($organizationPrograms);
        }

        if ($view == 'visible') {
            $organizationPrograms = Program::where(
                'user_id_creator', $organization->id
            )->where(
                'is_published', true
            )->with([
                'lessons' => fn ($query) => $query->orderBy('position_in_program', 'asc')
            ])->get();

            return response()->json($organizationPrograms);
        }

        if ($view == 'hidden') {
            $organizationPrograms = Program::where(
                'user_id_creator', $organization->id
            )->where(
                'is_published', false
            )->with([
                'lessons' => fn ($query) => $query->orderBy('position_in_program', 'asc')
            ])->get();

            return response()->json($organizationPrograms);
        }

        if ($view == 'deleted') {
            $organizationPrograms = Program::where(
                'user_id_creator', $organization->id
            )->whereNotNull(
                'deleted_at'
            )->withTrashed()->with([
                'lessons' => fn ($query) => $query->withTrashed()->orderBy('position_in_program', 'asc')
            ])->get();

            return response()->json($organizationPrograms);
        }
    }

    public function updateOrganizationProgram($programId, JWTAuth $auth) {
        $organization = $auth->user();

        if (!$organization->groups->contains('code', 'organization')) {
            throw new NotFoundHttpException('Метод не найден');
        }

        $organizationProgram = Program::where(
            'id', $programId
        )->where(
            'user_id_creator', $organization->id
        )->first();

        if (!$organizationProgram) {
            throw new NotFoundHttpException('Программа не найдена');
        }

        $programName = Input::get('program_name');
        $programDescription = Input::get('program_description');
        $categoryId = Input::get('category_id');

        if (!$programName) {
            throw new BadRequestException('Поле program_name обязательно для заполнения');
        }

        if (!$programDescription) {
            throw new BadRequestException('Поле program_description обязательно для заполнения');
        }

        if (!$categoryId) {
            throw new BadRequestException('Поле category_id обязательно для заполнения');
        }

        $organizationProgram->name = $programName;
        $organizationProgram->description = $programDescription;
        $organizationProgram->category_id = $categoryId;

        $organizationProgram->save();
    }

    public function updateOrganizationProgramLessons($programId, JWTAuth $auth) {
        $organization = $auth->user();

        if (!$organization->groups->contains('code', 'organization')) {
            throw new NotFoundHttpException('Метод не найден');
        }

        $lessons = Input::get('lessons');

        foreach ($lessons as $lesson) {
            if ($lesson['id'] > 0) {
                if (array_key_exists('deleted', $lesson) && $lesson['deleted']) {
                    $this->deleteLesson($lesson);
                } else {
                    $this->updateLesson($programId, $lesson);
                }
            } else {
                $this->createLesson($programId, $lesson);
            }
        }
    }

    private function updateLesson($programId, $lesson) {
        $lessonModel = Lesson::find($lesson['id']);

        $this->saveLesson($programId, $lessonModel, $lesson);
    }

    private function createLesson($programId, $lesson) {
        $lessonModel = new Lesson();
        $lessonModel->programs_id = $programId;

        $this->saveLesson($programId, $lessonModel, $lesson);
    }

    private function saveLesson($programId, $lessonModel, $lesson) {
        $lessonModel->name = $lesson['name'];
        $lessonModel->position_in_program = $lesson['position_in_program'];
        $lessonModel->description = $lesson['description'];

        $lessonModel->save();

        $newLesson = Lesson::where(
            'position_in_program', $lesson['position_in_program']
        )->where(
            'programs_id', $programId
        )->first();

        $this->updateLessonExercises($programId, $newLesson->id, $lesson);
    }

    private function updateLessonExercises($programId, $lessonId, $lesson) {
        foreach ($lesson['exercises'] as $exercise) {
            if ($exercise['id'] > 0) {
                if (array_key_exists('deleted', $exercise) && $exercise['deleted']) {
                    $this->deleteExercise($exercise);
                } else {
                    $this->updateLessonExercise($exercise);
                }
            } else {
                $this->createLessonExercise($programId, $lessonId, $exercise);
            }
        }
    }

    private function updateLessonExercise($exercise) {
        $exerciseModel = Exercise::find($exercise['id']);

        $this->saveExercise($exerciseModel, $exercise);
    }

    private function createLessonExercise($programId, $lessonId, $exercise) {
        $exerciseModel = new Exercise();
        $exerciseModel->programs_id = $programId;
        $exerciseModel->lessons_id = $lessonId;

        $this->saveExercise($exerciseModel, $exercise);
    }

    private function saveExercise($exerciseModel, $exercise) {
        $exerciseModel->name = $exercise['name'];
        $exerciseModel->position_in_lesson = $exercise['position_in_lesson'];
        $exerciseModel->exercise_description = $exercise['exercise_description'];
        $exerciseModel->initial_position = $exercise['initial_position'];
        $exerciseModel->tempo = $exercise['tempo'];
        $exerciseModel->duration = $exercise['duration'];
        $exerciseModel->video_url = $exercise['video_url'];

        $exerciseModel->save();
    }

    private function deleteLesson($lesson) {
        $lessonModel = Lesson::find($lesson['id']);

        $lessonModel->delete();
    }

    private function deleteExercise($exercise) {
        $exerciseModel = Exercise::find($exercise['id']);

        $exerciseModel->delete();
    }

    public function updateOrganizationProgramIndicators($programId, JWTAuth $auth)
    {
        $organization = $auth->user();

        if (!$organization->groups->contains('code', 'organization')) {
            throw new NotFoundHttpException('Метод не найден');
        }

        $organizationProgram = Program::where(
            'id', $programId
        )->where(
            'user_id_creator', $organization->id
        )->first();

        if (!$organizationProgram) {
            throw new NotFoundHttpException('Программа не найдена');
        }

        $indicators = Input::get('indicators');

        if (!$indicators) {
            throw new BadRequestException('Поле indicators обязательно для заполнения');
        }

        $organizationProgram->indicators = $indicators;
        $organizationProgram->save();
    }

    public function deleteOrganizationProgram($programId, JWTAuth $auth) {
        $organization = $auth->user();

        if (!$organization->groups->contains('code', 'organization')) {
            throw new NotFoundHttpException('Метод не найден');
        }

        $organizationProgram = Program::where(
            'id', $programId
        )->where(
            'user_id_creator', $organization->id
        )->first();

        if (!$organizationProgram) {
            throw new NotFoundHttpException('Программа не найдена');
        }

        $organizationProgram->is_published = false;
        $organizationProgram->save();

        $organizationProgram->delete();
    }

    public function restoreOrganizationProgram($programId, JWTAuth $auth) {
        $organization = $auth->user();

        if (!$organization->groups->contains('code', 'organization')) {
            throw new NotFoundHttpException('Метод не найден');
        }

        $organizationProgram = Program::where(
            'id', $programId
        )->where(
            'user_id_creator', $organization->id
        )->withTrashed()->first();

        if (!$organizationProgram) {
            throw new NotFoundHttpException('Программа не найдена');
        }

        $organizationProgram->restore();
        $organizationProgram->lessons()->withTrashed()->restore();

        foreach ($organizationProgram->lessons as $organizationProgramLesson) {
            $organizationProgramLesson->exercises()->withTrashed()->restore();
        }
    }

    public function updateOrganizationProgramIsPublished($programId, JWTAuth $auth)
    {
        $organization = $auth->user();

        if (!$organization->groups->contains('code', 'organization')) {
            throw new NotFoundHttpException('Метод не найден');
        }

        $organizationProgram = Program::where(
            'id', $programId
        )->where(
            'user_id_creator', $organization->id
        )->first();

        if (!$organizationProgram) {
            throw new NotFoundHttpException('Программа не найдена');
        }

        $isPublished = Input::get('is_published');

        if ($isPublished != 0 && $isPublished != 1) {
            throw new BadRequestException('Поле is_published имеет некорректный формат');
        }

        $organizationProgram->is_published = $isPublished;
        $organizationProgram->save();
    }
}
