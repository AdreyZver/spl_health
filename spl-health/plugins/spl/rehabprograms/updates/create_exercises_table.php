<?php namespace Spl\Rehabprograms\Updates;

use Schema;
use Winter\Storm\Database\Schema\Blueprint;
use Winter\Storm\Database\Updates\Migration;

class CreateExercisesTable extends Migration
{
    public function up()
    {
        Schema::create('spl_rehabprograms_exercises', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('programs_id');
            $table->integer('lessons_id');
            $table->string('name');
            $table->text('initial_position');
            $table->integer('position_in_lesson');
            $table->text('tempo');
            $table->text('duration');
            $table->text('exercise_description');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('spl_rehabprograms_exercises');
    }
}
