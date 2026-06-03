import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request: { user: { sub: string } } = context
      .switchToHttp()
      .getRequest();
    return request.user.sub;
  },
);
