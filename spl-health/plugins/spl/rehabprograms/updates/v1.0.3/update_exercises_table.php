<?php namespace Spl\Rehabprograms\Updates;

use Schema;
use Winter\Storm\Database\Schema\Blueprint;
use Winter\Storm\Database\Updates\Migration;

class UpdateEsercisesTable extends Migration
{
    public function up()
    {
        Schema::table('spl_rehabprograms_exercises', function (Blueprint $table) {
            $table->string('video_url');
        });
    }
}
