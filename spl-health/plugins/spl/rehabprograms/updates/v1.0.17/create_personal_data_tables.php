<?php namespace Spl\Rehabprograms\Updates;

use Schema;
use Winter\Storm\Database\Schema\Blueprint;
use Winter\Storm\Database\Updates\Migration;

class PersonalDataTables extends Migration
{
    public function up()
    {
        Schema::create('spl_rehabprograms_users_info', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('user_id');
            $table->date('birth_date')->nullable();
            $table->text('gender')->nullable();
            $table->string('phone')->nullable();
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->text('interests')->nullable();
            $table->text('about_me')->nullable();
            $table->timestamps();
        });

        Schema::create('spl_rehabprograms_organizations_info', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('organization_id');
            $table->text('logo')->nullable();
            $table->json('contacts')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('spl_rehabprograms_users_info');
        Schema::dropIfExists('spl_rehabprograms_organizations_info');
    }
}
