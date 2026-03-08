<?php

use Illuminate\Support\Facades\Route;
use Spl\Rehabprograms\ApiControllers\Categories;
use Spl\Rehabprograms\ApiControllers\Programs;
use Spl\Rehabprograms\ApiControllers\Lessons;
use Spl\Rehabprograms\ApiControllers\UserPrograms;
use Spl\Rehabprograms\ApiControllers\Users;
use Spl\Rehabprograms\ApiControllers\OrganizationsInfo;
use Spl\Rehabprograms\ApiControllers\UsersInfo;

Route::group([
    'prefix' => 'api',
    'namespace'  => 'Spl\Rehabprograms\ApiControllers',
    'middleware' => [
        'api',
        'jwt.auth'
    ],
], function() {
    //Categories API controller
    Route::get('/categories', [Categories::class, 'index']);

    //Programs API controller
    Route::get('/programs', [Programs::class, 'index']);
    Route::get('/programs/{programId}/indicators', [Programs::class, 'getIndicators']);
    Route::post('/programs/{programId}/start', [Programs::class, 'startProgram']);
    Route::get('/organization/programs', [Programs::class, 'getOrganizationPrograms']);
    Route::post('/organization/programs/create', [Programs::class, 'createProgram']);
    Route::get('/organization/programs/{programId}', [Programs::class, 'getOrganizationProgram']);
    Route::put('/organization/programs/{programId}/update', [Programs::class, 'updateOrganizationProgram']);
    Route::post('/organization/programs/{programId}/delete', [Programs::class, 'deleteOrganizationProgram']);
    Route::post('/organization/programs/{programId}/restore', [Programs::class, 'restoreOrganizationProgram']);
    Route::post('/organization/programs/{programId}/update-lessons', [Programs::class, 'updateOrganizationProgramLessons']);
    Route::post('/organization/programs/{programId}/update-indicators', [Programs::class, 'updateOrganizationProgramIndicators']);
    Route::post('/organization/programs/{programId}/update-published', [Programs::class, 'updateOrganizationProgramIsPublished']);

    //Lessons API controller
    Route::get('/lessons', [Lessons::class, 'index']);
    Route::get('/lessons/{lessonId}', [Lessons::class, 'getOne']);
    Route::post('/lessons/{lessonId}/complete', [Lessons::class, 'completeLesson']);
    Route::post('/lessons/{lessonId}/indicators', [Lessons::class, 'createIndicators']);

    //UserPrograms API controller
    Route::get('/user/indicators', [UserPrograms::class, 'getIndicators']);
    Route::get('/user/programs', [UserPrograms::class, 'getUserPrograms']);

    //UsersInfo API controller
    Route::get('/user/info', [UsersInfo::class, 'index']);
    Route::post('/user/info/update', [UsersInfo::class, 'updateInfo']);

    //OrganizationsInfo API controller
    Route::get('/organization/info', [OrganizationsInfo::class, 'index']);
    Route::post('/organization/info/update', [OrganizationsInfo::class, 'udpateInfo']);
});
