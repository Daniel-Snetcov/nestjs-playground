import { Logger } from '@nestjs/common';

export function LoggingInterceptor(logger: Logger = new Logger()) {
  return function (
    target: any,
    method: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const service = target.constructor.name;

    descriptor.value = async function (...args: any[]) {
      logger.verbose(
        `[Start] => ${JSON.stringify({ args })}`,
        `${service}::${method}`,
      );

      try {
        const result = await originalMethod.apply(this, args);
          
        logger.verbose(
          `[Finish] => ${JSON.stringify({ args, result })}`,
          `${service}::${method}`,
        );
        return result;
      } catch (error) {
        logger.error(
          `[Error] => ${JSON.stringify({ args })}`,
          error?.stack ? error.stack : 'STACK_ERROR_NOT_FOUND',
          `${service}::${method}`,
        );
        throw error;
      }
    };

    return descriptor;
  };
}
