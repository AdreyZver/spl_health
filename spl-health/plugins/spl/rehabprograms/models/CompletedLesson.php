<?php namespace Spl\Rehabprograms\Models;

use Model;

/**
 * CompletedLesson Model
 */
class CompletedLesson extends Model
{
    use \Winter\Storm\Database\Traits\Validation;

    /**
     * @var string The database table used by the model.
     */
    public $table = 'spl_rehabprograms_completed_lessons';

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
        'updated_at'
    ];

    /**
     * @var array Relations
     */
    public $hasOne = [
        'lesson' => [
            'Spl\Rehabprograms\Models\Lesson',
            'key' => 'id'
        ],
        'indicators' => [
            'Spl\Rehabprograms\Models\LessonIndicators',
            'key' => 'completed_lesson_id'
        ],
    ];
    public $hasMany = [];
    public $hasOneThrough = [];
    public $hasManyThrough = [];
    public $belongsTo = [
        'user_program' => [
            'Spl\Rehabprograms\Models\UserProgram',
            'key' => 'user_program_id'
        ],
    ];
    public $belongsToMany = [];
    public $morphTo = [];
    public $morphOne = [];
    public $morphMany = [];
    public $attachOne = [];
    public $attachMany = [];
}
