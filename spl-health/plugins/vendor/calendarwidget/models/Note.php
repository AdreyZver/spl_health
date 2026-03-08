<?php namespace Vendor\CalendarWidget\Models;

use Model;

class Note extends Model
{
    use \October\Rain\Database\Traits\Validation;

    public $table = 'vendor_calendarwidget_notes';

    protected $guarded = ['*'];

    protected $fillable = [
        'program_id',
        'lesson_id',
        'date',
        'content',
        'color',
    ];

    public $rules = [
        'program_id' => 'nullable|integer',
        'lesson_id' => 'nullable|integer',
        'date'    => 'required|date',
        'content' => 'required|string|max:2000',
        'color'   => 'nullable|string|max:7'
    ];

    protected $dates = [
        'date',
        'created_at',
        'updated_at'
    ];
}