<?php namespace Spl\Rehabprograms\Updates;

use Schema;
use Winter\Storm\Database\Schema\Blueprint;
use Winter\Storm\Database\Updates\Migration;

class UpdateProgramsTable extends Migration
{
    public function up()
    {
        Schema::table('spl_rehabprograms_programs', function (Blueprint $table) {
            $table->integer('user_id_creator');
        });
    }

    public function down()
    {
        Schema::table('spl_rehabprograms_programs', function (Blueprint $table) {
            $table->dropColumn('user_id_creator');
        });
    }
}
