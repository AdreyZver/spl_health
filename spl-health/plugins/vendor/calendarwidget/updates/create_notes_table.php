<?php namespace Vendor\CalendarWidget\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class CreateNotesTable extends Migration
{
    public function up()
    {
        Schema::create('vendor_calendarwidget_notes', function($table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('program_id')->unsigned()->nullable();
            $table->integer('lesson_id')->unsigned()->nullable();
            $table->date('date')->index();
            $table->text('content');
            $table->string('color', 7)->default('#ffffff');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('vendor_calendarwidget_notes');
    }
}