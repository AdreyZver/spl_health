<?php namespace Spl\Rehabprograms\Updates;

use Schema;
use Winter\Storm\Database\Schema\Blueprint;
use Winter\Storm\Database\Updates\Migration;

class CreateLessonIndicatorssTable extends Migration
{
    public function up()
    {
        Schema::create('spl_rehabprograms_lesson_indicators', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('comleted_lesson_id');
            $table->integer('user_id');
            $table->json('indicators');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('spl_rehabprograms_lesson_indicators');
    }
}
