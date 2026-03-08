<?php namespace Spl\Rehabprograms\Components;

use Db;
use Cms\Classes\ComponentBase;
use Spl\Rehabprograms\Models\Program;

class Programs extends ComponentBase
{
    public function componentDetails()
    {
        return [
            'name'        => 'Компонент программы',
            'description' => 'Отображает информацию о программе реабилитации'
        ];
    }

    public function onRun()
    {
        $programId = $this->param('program_id');

        $program = Program::find($programId);

        if (!$programId) {
            $this->setStatusCode(404);
            return $this->controller->run('404');
        }

        $this->page['program'] = $program;

        $this->addCss('/plugins/spl/rehabprograms/assets/css/components.css');
    }
}
