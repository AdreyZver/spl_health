<?php namespace Spl\Rehabprograms\Components;

use Db;
use Cms\Classes\ComponentBase;
use Spl\Rehabprograms\Models\Category;
use Spl\Rehabprograms\Models\Program;

class Categories extends ComponentBase
{
    public function componentDetails()
    {
        return [
            'name'        => 'Компонент доступных категорий',
            'description' => 'Выводит список категорий и соответствующих им программ'
        ];
    }

    public function getProgramsPageOptions()
    {
        return Page::sortBy('baseFileName')->lists('baseFileName', 'baseFileName');
    }

    public function getCategories()
    {
        $categories = Category::orderBy('name', 'asc')->get();

        $result = [];

        foreach ($categories as $category) {
            $result[] = [
                'id' => $category->id,
                'name' => $category->name,
            ];
        }

        return $result;
    }

    function onGetProgramsTemplate()
    {
        $categoryId = input('categoryId');
        $programsCollection = Program::where('category_id', $categoryId)->with(['lessons'])->get();

        $programs = [];

        foreach ($programsCollection as $program) {
            $programs[] = [
                'name' => $program->name,
                'id' => $program->id,
                'lessons_count' => count($program->lessons),
            ];
        }

        return [
            '#categoryProrgamsList' => $this->renderPartial(
                '@programs-partial.htm',
                ['programs' => $programs]
            ),
            '#categories-list' => $this->renderPartial(
                '@default.htm',
                ['active_category_id' => $categoryId]
            )
        ];
    }

    public function onRun()
    {
        $this->addCss('/plugins/spl/rehabprograms/assets/css/components.css');

        $defaultCategory = Category::orderBy('id', 'asc')->first();

        $programsCollection = Program::where('category_id', $defaultCategory->id)->with(['lessons'])->get();

        $programs = [];

        foreach ($programsCollection as $program) {
            $programs[] = [
                'name' => $program->name,
                'id' => $program->id,
                'lessons_count' => count($program->lessons),
            ];
        }

        $this->page['active_category_id'] = $defaultCategory->id;
        $this->page['programs'] = $programs;
    }
}
