<?php namespace Spl\Rehabprograms\ApiControllers;

use Spl\Rehabprograms\Models\UserInfo;
use Input;
use ValidationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use RLuders\JWTAuth\Classes\JWTAuth;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

/**
 * UsersInfo API Controller
 */
class UsersInfo extends Controller
{
    public function index(JWTAuth $auth)
    {
        $user = $auth->user();

        if ($user->groups->contains('code', 'organization')) {
            throw new NotFoundHttpException('Метод не найден');
        }

        $userInfo = UserInfo::where('user_id', $user->id)->first();

        $responseData = [
            'id' => $userInfo ? $userInfo->id : null,
            'birth_date' => $userInfo ? $userInfo->birth_date : null,
            'gender' => $userInfo ? $userInfo->gender : null,
            'phone' => $userInfo ? $userInfo->phone : null,
            'country' => $userInfo ? $userInfo->country : null,
            'city' => $userInfo ? $userInfo->city : null,
            'interests' => $userInfo ? $userInfo->interests : null,
            'about_me' => $userInfo ? $userInfo->about_me : null,
        ];

        return response()->json($responseData);
    }

    public function updateInfo(JWTAuth $auth)
    {
        $user = $auth->user();

        if ($user->groups->contains('code', 'organization')) {
            throw new NotFoundHttpException('Метод не найден');
        }

        $userInfo = UserInfo::where('user_id', $user->id)->first();

        if (!$userInfo) {
            $this->createUserInfo($user);
        } else {
            $this->updateUserInfo($userInfo);
        }
    }

    private function createUserInfo($user)
    {
        $userInfo = new UserInfo();

        $userInfo->user_id = $user->id;
        $userInfo->birth_date = Input::get('birth_date');
        $userInfo->gender = Input::get('gender');
        $userInfo->phone = Input::get('phone');
        $userInfo->country = Input::get('country');
        $userInfo->city = Input::get('city');
        $userInfo->interests = Input::get('interests');
        $userInfo->about_me = Input::get('about_me');

        $userInfo->save();
    }

    private function updateUserInfo($userInfo)
    {
        $userInfo->birth_date = Input::get('birth_date');
        $userInfo->gender = Input::get('gender');
        $userInfo->phone = Input::get('phone');
        $userInfo->country = Input::get('country');
        $userInfo->city = Input::get('city');
        $userInfo->interests = Input::get('interests');
        $userInfo->about_me = Input::get('about_me');

        $userInfo->save();
    }
}
