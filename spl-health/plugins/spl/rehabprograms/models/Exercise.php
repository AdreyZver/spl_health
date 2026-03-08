<?php namespace Spl\Rehabprograms\Models;

use Db;
use Model;
use Spl\Rehabprograms\Models\Program;
use Spl\Rehabprograms\Models\Lesson;

/**
 * Exercise Model
 */
class Exercise extends Model
{
    use \Winter\Storm\Database\Traits\Validation;
    use \Winter\Storm\Database\Traits\SoftDelete;

    /**
     * @var string The database table used by the model.
     */
    public $table = 'spl_rehabprograms_exercises';

    /**
     * @var array Guarded fields
     */
    protected $guarded = ['*'];

    /**
     * @var array Fillable fields
     */
    protected $fillable = [];

    /**
     * @var array Validation rules for attributes
     */
    public $rules = [];

    /**
     * @var array Attributes to be cast to native types
     */
    protected $casts = [];

    /**
     * @var array Attributes to be cast to JSON
     */
    protected $jsonable = [];

    /**
     * @var array Attributes to be appended to the API representation of the model (ex. toArray())
     */
    protected $appends = [];

    /**
     * @var array Attributes to be removed from the API representation of the model (ex. toArray())
     */
    protected $hidden = [];

    /**
     * @var array Attributes to be cast to Argon (Carbon) instances
     */
    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    /**
     * @var array Relations
     */
    public $hasOne = [];
    public $hasMany = [];
    public $hasOneThrough = [];
    public $hasManyThrough = [];
    public $belongsTo = [
        'lessons' => 'Spl\Rehabprograms\Models\Lesson',
        'programs' => 'Spl\Rehabprograms\Models\Program',
    ];
    public $belongsToMany = [];
    public $morphTo = [];
    public $morphOne = [];
    public $morphMany = [];
    public $attachOne = [];
    public $attachMany = [];

    public function beforeCreate()
    {
        $exercisesToMove = Exercise::where('lessons_id', '=', $this->lessons_id)
                                    ->where('position_in_lesson', '>=', $this->position_in_lesson)
                                    ->get();

        foreach ($exercisesToMove as $exercise) {
            $exercise->position_in_lesson = $exercise->position_in_lesson + 1;
            if (!$exercise->save()) {
                return false;
            }
        }
    }

    public function beforeUpdate()
    {
        /**
         * Для обновления используется класс Db,
         * т.к. при использовании Exercise::...->save() скрипт падает в бесконечный цикл
         */
        Db::table($this->table)
            ->where('lessons_id', '=', $this->lessons_id)
            ->where('position_in_lesson', '=', $this->position_in_lesson)
            ->update(['position_in_lesson' => $this->original['position_in_lesson']]);
    }

    public function getProgramsIdOptions($value, $formData)
    {
        $programs = Program::all();

        $options = [];

        foreach ($programs as $program) {
            $options[$program->id] = $program->name;
        }

        return $options;
    }

    public function getLessonsIdOptions($value, $formData)
    {
        if (!$this->programs_id) {
            return [];
        }

        $lessons = Lesson::where('programs_id', $this->programs_id)->get();

        $options = [];

        foreach ($lessons as $lesson) {
            $options[$lesson->id] = $lesson->name;
        }

        return $options;
    }

    public function getPositionInLessonOptions($value, $formData)
    {
        $exercisesCount = Exercise::where('lessons_id', '=', $this->lessons_id)->count();

        $options = [];

        for ($i = 1; $i <= $exercisesCount + 1; $i++) {
            $options[$i] = $i;
        }

        return $options;
    }

    public function positionsInLessonOnUpdate($fieldName, $value, $formData)
    {
        $exercisesCount = Exercise::where('lessons_id', '=', $this->lessons_id)->count();

        $options = [];

        for ($i = 1; $i <= $exercisesCount; $i++) {
            $options[$i] = $i;
        }

        return $options;
    }
}
