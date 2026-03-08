<?php namespace Spl\Rehabprograms\Models;

use Db;
use Model;
use Spl\Rehabprograms\Models\Program;

/**
 * Lesson Model
 */
class Lesson extends Model
{
    use \Winter\Storm\Database\Traits\Validation;
    use \Winter\Storm\Database\Traits\SoftDelete;

    /**
     * @var string The database table used by the model.
     */
    public $table = 'spl_rehabprograms_lessons';

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
    public $hasMany = [
        'exercises' => [
            'Spl\Rehabprograms\Models\Exercise',
            'key' => 'lessons_id',
            'softDelete' => true
        ]
    ];
    public $hasOneThrough = [];
    public $hasManyThrough = [];
    public $belongsTo = [
        'programs' => 'Spl\Rehabprograms\Models\Program'
    ];
    public $belongsToMany = [];
    public $morphTo = [];
    public $morphOne = [];
    public $morphMany = [];
    public $attachOne = [];
    public $attachMany = [];

    public function beforeCreate()
    {
        $lessonsToMove = Lesson::where(
            'position_in_program', '>=', $this->position_in_program
        )->where('programs_id', '=', $this->programs_id)->get();

        foreach ($lessonsToMove as $lesson) {
            $lesson->position_in_program = $lesson->position_in_program + 1;
            if (!$lesson->save()) {
                return false;
            }
        }
    }

    public function beforeUpdate()
    {
        /**
         * Для обновления используется класс Db,
         * т.к. при использовании Lesson::...->save() скрипт падает в бесконечный цикл
         */
        Db::table($this->table)
            ->where('position_in_program', '=', $this->position_in_program)
            ->where('programs_id', '=', $this->programs_id)
            ->update(['position_in_program' => $this->original['position_in_program']]);
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

    public function getPositionInProgramOptions($value, $formData)
    {
        $lessonsCount = Lesson::where('programs_id', '=', $this->programs_id)->count();

        $options = [];

        for ($i = 1; $i <= $lessonsCount + 1; $i++) {
            $options[$i] = $i;
        }

        return $options;
    }

    public function positionsInProgramsOnUpdate($fieldName, $value, $formData)
    {
        $lessonsCount = Lesson::where('programs_id', '=', $this->programs_id)->count();

        $options = [];

        for ($i = 1; $i <= $lessonsCount; $i++) {
            $options[$i] = $i;
        }

        return $options;
    }
}
