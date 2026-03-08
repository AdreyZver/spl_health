<?php namespace Spl\Rehabprograms\Updates;

use Schema;
use Winter\Storm\Database\Schema\Blueprint;
use Winter\Storm\Database\Updates\Migration;

class UpdateLessonIndicatorsTable extends Migration
{
    public function up()
    {
        Schema::table('spl_rehabprograms_lesson_indicators', function (Blueprint $table) {
            $table->renameColumn('comleted_lesson_id', 'completed_lesson_id');
        });
    }

    public function down()
    {
        Schema::table('spl_rehabprograms_lesson_indicators', function (Blueprint $table) {
            $table->renameColumn('completed_lesson_id', 'comleted_lesson_id');
        });
    }
}
