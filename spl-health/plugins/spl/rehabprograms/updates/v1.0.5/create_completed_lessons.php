<?php namespace Spl\Rehabprograms\Updates;

use Schema;
use Winter\Storm\Database\Schema\Blueprint;
use Winter\Storm\Database\Updates\Migration;

class CreateCompletedLessonsTable extends Migration
{
    public function up()
    {
        Schema::create('spl_rehabprograms_completed_lessons', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('lesson_id');
            $table->integer('user_program_id');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('spl_rehabprograms_completed_lessons');
    }
}
