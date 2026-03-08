<?php namespace Spl\Rehabprograms\Updates;

use Schema;
use Winter\Storm\Database\Schema\Blueprint;
use Winter\Storm\Database\Updates\Migration;

class CreateUserProgramTable extends Migration
{
    public function up()
    {
        Schema::create('spl_rehabprograms_user_program', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('user_id');
            $table->integer('program_id');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('spl_rehabprograms_user_program');
    }
}
