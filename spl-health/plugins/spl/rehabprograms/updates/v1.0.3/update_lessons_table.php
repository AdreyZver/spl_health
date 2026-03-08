<?php namespace Spl\Rehabprograms\Updates;

use Schema;
use Winter\Storm\Database\Schema\Blueprint;
use Winter\Storm\Database\Updates\Migration;

class UpdateLessonsTable extends Migration
{
    public function up()
    {
        Schema::table('spl_rehabprograms_lessons', function (Blueprint $table) {
            $table->text('description');
            $table->dropColumn('purpose');
            $table->dropColumn('technique');
            $table->dropColumn('location');
            $table->dropColumn('start_time');
            $table->dropColumn('end_time');
            $table->dropColumn('opening_time');
        });
    }
}
