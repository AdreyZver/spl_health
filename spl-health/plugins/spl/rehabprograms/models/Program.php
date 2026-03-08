<?php namespace Spl\Rehabprograms\Models;

use Model;
use Spl\Rehabprograms\Models\Category;

/**
 * Program Model
 */
class Program extends Model
{
    use \Winter\Storm\Database\Traits\Validation;
    use \Winter\Storm\Database\Traits\SoftDelete;

    /**
     * @var string The database table used by the model.
     */
    public $table = 'spl_rehabprograms_programs';

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
    protected $jsonable = [
        'indicators'
    ];

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
        'lessons' => [
            'Spl\Rehabprograms\Models\Lesson',
            'key' => 'programs_id',
            'softDelete' => true
        ],
        'exercises' => [
            'Spl\Rehabprograms\Models\Exercise',
            'key' => 'programs_id',
            'softDelete' => true
        ]
    ];
    public $hasOneThrough = [];
    public $hasManyThrough = [];
    public $belongsTo = [
        'category' => 'Spl\Rehabprograms\Models\Category',
        'user' => [
            'RainLab\User\Models\User',
            'key' => 'user_id_creator'
        ],
    ];
    public $belongsToMany = [];
    public $morphTo = [];
    public $morphOne = [];
    public $morphMany = [];
    public $attachOne = [];
    public $attachMany = [];

    public function getCategoryIdOptions($value, $formData)
    {
        $categories = Category::all();

        $options = [];

        foreach ($categories as $category) {
            $options[$category->id] = $category->name;
        }

        return $options;
    }
}
