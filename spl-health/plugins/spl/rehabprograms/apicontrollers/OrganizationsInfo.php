<?php namespace Spl\Rehabprograms\ApiControllers;

use Spl\Rehabprograms\Models\OrganizationInfo;
use Input;
use ValidationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use RLuders\JWTAuth\Classes\JWTAuth;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

/**
 * OrganizationsInfo API Controller
 */
class OrganizationsInfo extends Controller
{
    public function index(JWTAuth $auth)
    {
        $organization = $auth->user();

        if (!$organization->groups->contains('code', 'organization')) {
            throw new NotFoundHttpException('Метод не найден');
        }

        $organizationInfo = OrganizationInfo::where('organization_id', $organization->id)->first();

        $responseData = [
            'id' => $organizationInfo ? $organizationInfo->id : null,
            'contacts' => $organizationInfo ? $organizationInfo->contacts : null,
            'description' => $organizationInfo ? $organizationInfo->description : null,
            'phone' => $organizationInfo ? $organizationInfo->phone : null,
            'address' => $organizationInfo ? $organizationInfo->address : null,
            'logo_path' => $organizationInfo && $organizationInfo->logo ? $organizationInfo->logo->getPath() : null
        ];

        return response()->json($responseData);
    }

    public function udpateInfo(JWTAuth $auth)
    {
        $organization = $auth->user();

        if (!$organization->groups->contains('code', 'organization')) {
            throw new NotFoundHttpException('Метод не найден');
        }

        $organizationInfo = OrganizationInfo::where('organization_id', $organization->id)->first();

        if (!$organizationInfo) {
            $this->createOrganizationInfo($organization);
        } else {
            $this->updateOrganizationInfo($organizationInfo);
        }
    }

    private function createOrganizationInfo($organization)
    {
        $organizationInfo = new OrganizationInfo();

        $organizationInfo->organization_id = $organization->id;
        $organizationInfo->logo = Input::file('logo');
        $organizationInfo->phone = Input::get('phone');
        $organizationInfo->contacts = json_decode(Input::get('contacts'));
        $organizationInfo->description = Input::get('description');        $organizationInfo->address = Input::get('address');

        $organizationInfo->save();
    }

    private function updateOrganizationInfo($organizationInfo)
    {
        $organizationInfo->logo = Input::file('logo');
        $organizationInfo->phone = Input::get('phone');
        $organizationInfo->contacts = json_decode(Input::get('contacts'));
        $organizationInfo->description = Input::get('description');        $organizationInfo->address = Input::get('address');

        $organizationInfo->save();
    }
}
