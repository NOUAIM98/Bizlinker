// database/migrations/2025_06_22_000000_create_reports_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('reports')) {
            Schema::create('reports', function (Blueprint $t) {
                $t->id();
                $t->foreignId('user_id')->constrained()->cascadeOnDelete();
                $t->string('title', 120);
                $t->text('description');
                $t->enum('category', ['Customer Experience','Pricing','Staff Conduct','Other']);
                $t->enum('report_type', ['Restaurant','Event','Freelance Service','Business']);
                $t->enum('status', ['Pending','In Progress','Resolved'])->default('Pending');
                $t->timestamps();
            });
        }
    }
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
