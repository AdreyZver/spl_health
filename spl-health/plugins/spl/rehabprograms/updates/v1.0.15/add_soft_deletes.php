<?php namespace Spl\Rehabprograms\Updates;

use Schema;
use Winter\Storm\Database\Schema\Blueprint;
use Winter\Storm\Database\Updates\Migration;

class UpdateTables extends Migration
{
    public function up()
    {
        Schema::table('spl_rehabprograms_programs', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('spl_rehabprograms_lessons', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('spl_rehabprograms_exercises', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::table('spl_rehabprograms_programs', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::table('spl_rehabprograms_lessons', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::table('spl_rehabprograms_exercises', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
}
