<?php namespace Vendor\CalendarWidget\Components;

use Cms\Classes\ComponentBase;

class CalendarWidget extends ComponentBase
{
    public function componentDetails()
    {
        return [
            'name'        => 'Calendar Widget',
            'description' => 'Виджет календаря с заметками'
        ];
    }

    public function defineProperties()
    {
        return [
            'apiEndpoint' => [
                'title'       => 'API Endpoint',
                'description' => 'Базовый URL для API запросов',
                'default'     => '/api/calendar/notes',
                'type'        => 'string'
            ],
            'defaultColor' => [
                'title'       => 'Цвет по умолчанию',
                'description' => 'Цвет новых заметок',
                'default'     => '#ffffff',
                'type'        => 'string'
            ]
        ];
    }

    public function onRun()
    {
        // Добавляем CSS
        $this->addCss('/plugins/vendor/calendarwidget/assets/css/styles.css');
        
        // Добавляем JavaScript библиотеки через CDN
        $this->addJs('https://unpkg.com/react@18/umd/react.development.js');
        $this->addJs('https://unpkg.com/react-dom@18/umd/react-dom.development.js');
        $this->addJs('https://unpkg.com/@babel/standalone/babel.min.js');
        $this->addJs('https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js');
        $this->addJs('https://cdn.jsdelivr.net/npm/moment@2.29.4/min/moment.min.js');
        $this->addJs('https://cdn.jsdelivr.net/npm/moment@2.29.4/locale/ru.min.js');
        $this->addJs('https://unpkg.com/react-calendar@4.0.0/dist/umd/react-calendar.development.js');
        
        // Наш основной JS файл
        $this->addJs('/plugins/vendor/calendarwidget/assets/js/app.js');
        
        // Передаем данные в шаблон
        $this->page['apiEndpoint'] = $this->property('apiEndpoint');
        $this->page['defaultColor'] = $this->property('defaultColor');
        $this->page['csrfToken'] = csrf_token();
    }
}