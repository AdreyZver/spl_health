<?php namespace Spl\Rehabprograms\ApiControllers;

use Spl\Rehabprograms\Models\Exercise;
use Spl\Rehabprograms\Models\Lesson;
use Input;
use ApplicationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Exercises API Controller
 */
class Exercises extends Controller
{

    public function index(): JsonResponse
    {
        $lessonId = Input::get('lesson_id');

        if (!$lessonId) {
            throw new BadRequestException('Необходимо указать поле lesson_id');
        }

        $lesson = Lesson::find($lessonId);

        if (!$lesson) {
            throw new NotFoundHttpException('Занятие не найдено');
        }

        return response()->json($lesson->exercises);
    }

}
