<?php namespace Spl\Rehabprograms\Updates;

use Schema;
use Winter\Storm\Database\Schema\Blueprint;
use Winter\Storm\Database\Updates\Migration;

class PersonalDataTables extends Migration
{
    public function up()
    {

         Schema::table('spl_rehabprograms_organizations_info', function (Blueprint $table) {
            $table->string('phone')->nullable();
        });
    }

    public function down()
    {
        Schema::table('spl_rehabprograms_organizations_info', function (Blueprint $table) {
            $table->dropColumn('phone');
        });
    }
}
