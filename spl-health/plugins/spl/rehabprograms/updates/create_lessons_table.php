<?php namespace Spl\Rehabprograms\Updates;

use Schema;
use Winter\Storm\Database\Schema\Blueprint;
use Winter\Storm\Database\Updates\Migration;

class CreateLessonsTable extends Migration
{
    public function up()
    {
        Schema::create('spl_rehabprograms_lessons', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('programs_id');
            $table->string('name');
            $table->integer('position_in_program');
            $table->text('purpose');
            $table->text('technique');
            $table->text('location');
            $table->dateTime('start_time')->nullable();
            $table->dateTime('end_time')->nullable();
            $table->date('opening_time')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('spl_rehabprograms_lessons');
    }
}
