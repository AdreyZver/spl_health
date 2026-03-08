<?php namespace Spl\Rehabprograms\ApiControllers;

use Spl\Rehabprograms\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

/**
 * Categories API Controller
 */
class Categories extends Controller
{

    public function index(): JsonResponse
    {
        $categories = Category::get()->load('programs');

        return response()->json($categories);
    }
}
