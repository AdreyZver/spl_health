<?php namespace Spl\Rehabprograms\Updates;

use Schema;
use Winter\Storm\Database\Schema\Blueprint;
use Winter\Storm\Database\Updates\Migration;

class UpdateProgramsTable extends Migration
{
    public function up()
    {
        Schema::table('spl_rehabprograms_programs', function (Blueprint $table) {
            $table->boolean('is_published')->default(true);
        });
    }

    public function down()
    {
        Schema::table('spl_rehabprograms_programs', function (Blueprint $table) {
            $table->dropColumn('is_published');
        });
    }
}
