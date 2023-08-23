import { Logger } from '@nestjs/common';

export function LoggingInterceptor(logger: Logger = new Logger()) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      logger.verbose(
        `[Start] => ${JSON.stringify({ args })}`,
        `${target}::${propertyKey}`,
      );

      try {
        const result = originalMethod.apply(this, args);
        logger.verbose(
          `[Finish] => ${JSON.stringify({ args, result })}`,
          `${target}::${propertyKey}`,
        );
        return result;
      } catch (error) {
        logger.error(
          `[Error] => ${JSON.stringify({ args })}`,
          error?.stack ? error.stack : 'STACK_ERROR_NOT_FOUND',
          `${target}::${propertyKey}`,
        );
        throw error;
      }
    };

    return descriptor;
  };
}
