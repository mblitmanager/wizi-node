import { Controller, Post, Body, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponseService } from "../common/services/api-response.service";

@Controller("broadcasting")
export class BroadcastingApiController {
  constructor(private apiResponse: ApiResponseService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("auth")
  async auth(@Request() req: any, @Body() body: any) {
    const { socket_id, channel_name } = body;

    // In a real app with Pusher, you would use pusher.authenticate() here.
    // For now, we return a mock success response that Laravel Echo expects.

    const user = req.user;

    return {
      auth: "mock_auth_token:" + user.id + ":" + socket_id,
      channel_data: JSON.stringify({
        user_id: user.id,
        user_info: {
          name: user.name,
          role: user.role,
        },
      }),
    };
  }
}
