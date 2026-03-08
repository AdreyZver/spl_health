<?php namespace Spl\Rehabprograms;

use App;
use Backend;
use System\Classes\PluginBase;
use ValidationException;
use ApplicationException;
use ErrorException;
use Illuminate\Http\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * rehabprograms Plugin Information File
 */
class Plugin extends PluginBase
{
    public function pluginDetails()
    {
        return [
            'name' => 'Реабилитация',
            'description' => 'Модуль управления программами реабилитации',
            'author' => 'SPL',
            'icon' => 'icon-leaf'
        ];
    }

    public function registerComponents()
    {
        return [
            'Spl\Rehabprograms\Components\Categories' => 'categories',
            'Spl\Rehabprograms\Components\Programs' => 'programs',
        ];
    }

    /**
     * Registers back-end navigation items for this plugin.
     *
     * @return array
     */
    public function registerNavigation()
    {
        return [
            'rehabprograms' => [
                'label'       => 'Программы реабилитации',
                'url'         => Backend::url('spl/rehabprograms/programs'),
                'icon'        => 'icon-leaf',
                'permissions' => ['spl.rehabprograms.*'],
                'order'       => 500,
                'sideMenu' => [
                    'categories' => [
                        'label'  => 'Категории',
                        'icon'   => 'icon-cube',
                        'url'    => \Backend::url('spl/rehabprograms/categories'),
                    ],
                    'programs' => [
                        'label'  => 'Программы',
                        'icon'   => 'icon-user-md',
                        'url'    => \Backend::url('spl/rehabprograms/programs'),
                    ],
                    'lessons' => [
                        'label'  => 'Занятия',
                        'icon'   => 'icon-child',
                        'url'    => \Backend::url('spl/rehabprograms/lessons'),
                    ],
                    'exercises' => [
                        'label'  => 'Упражнения',
                        'icon'   => 'icon-heartbeat',
                        'url'    => \Backend::url('spl/rehabprograms/exercises'),
                    ],
                ]
            ],
        ];
    }

    public function boot(): void
    {
        App::error(function (ValidationException $exception) {
            return response()->json([
                'message' => 'Ошибка валидации',
                'code' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'errors'  => $exception->getErrors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        });

        App::error(function (NotFoundHttpException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
                'code' => Response::HTTP_NOT_FOUND,
            ], Response::HTTP_NOT_FOUND);
        });

        App::error(function (BadRequestException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
                'code' => Response::HTTP_BAD_REQUEST,
            ], Response::HTTP_BAD_REQUEST);
        });

        App::error(function (JWTException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
                'code' => Response::HTTP_FORBIDDEN,
            ], Response::HTTP_FORBIDDEN);
        });

        App::error(function (UnauthorizedHttpException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
                'code' => Response::HTTP_UNAUTHORIZED,
            ], Response::HTTP_UNAUTHORIZED);
        });

        App::error(function (ErrorException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
                'code' => Response::HTTP_INTERNAL_SERVER_ERROR,
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        });
    }
}
