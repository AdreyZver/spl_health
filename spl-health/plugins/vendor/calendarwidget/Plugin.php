<?php namespace Vendor\CalendarWidget;

use System\Classes\PluginBase;

class Plugin extends PluginBase
{
    public function pluginDetails()
    {
        return [
            'name'        => 'Calendar Widget',
            'description' => 'Интерактивный календарь с заметками',
            'author'      => 'Your Vendor',
            'icon'        => 'icon-calendar',
            'homepage'    => ''
        ];
    }

    public function registerComponents()
    {
        return [
            'Vendor\CalendarWidget\Components\CalendarWidget' => 'calendarWidget'
        ];
    }

    public function registerPermissions()
    {
        return [
            'vendor.calendarwidget.manage_notes' => [
                'tab'   => 'Calendar Widget',
                'label' => 'Управление заметками'
            ]
        ];
    }

    public function boot()
    {
        $this->registerApiRoutes();
    }

    protected function registerApiRoutes()
    {
        \Route::prefix('api/calendar')->group(function () {
            \Route::get('notes', function () {
                $controller = new \Vendor\CalendarWidget\Controllers\NotesApi();
                return $controller->index();
            });

            \Route::get('notes/{date}', function ($date) {
                $controller = new \Vendor\CalendarWidget\Controllers\NotesApi();
                return $controller->getByDate($date);
            });

            \Route::post('notes', function () {
                $controller = new \Vendor\CalendarWidget\Controllers\NotesApi();
                return $controller->store();
            });

            \Route::put('notes/{id}', function ($id) {
                $controller = new \Vendor\CalendarWidget\Controllers\NotesApi();
                return $controller->update($id);
            });

            \Route::delete('notes/{id}', function ($id) {
                $controller = new \Vendor\CalendarWidget\Controllers\NotesApi();
                return $controller->destroy($id);
            });
        });
    }
}