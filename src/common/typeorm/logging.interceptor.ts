import { Logger } from "@nestjs/common";
const logger = new Logger();

function LoggingInterceptor(
  target: any,
  method: string,
  descriptor: PropertyDescriptor,
  options?: {
    service: string;
  },
) {
  const originalMethod = descriptor.value;
  const service = options?.service ? options.service : target.constructor.name;

  descriptor.value = async function (...args: any[]) {
    logger.verbose(
      `[Start] => ${JSON.stringify({ args })}`,
      `${service}::${method}`,
    );

    try {
      const start = performance.now();
      const result = await originalMethod.apply(this, args);
      const end = performance.now();
      const elapsed = `${end - start}ms`;

      logger.verbose(
        `[Finish] => ${JSON.stringify({ args, result })}`,
        `${service}::${method}::${elapsed}`,
      );
      return result;
    } catch (error) {
      logger.error(
        `[Error] => ${JSON.stringify({ args })}`,
        error?.stack ? error.stack : "STACK_ERROR_NOT_FOUND",
        `${service}::${method}`,
      );
      throw error;
    }
  };

  return descriptor;
}
export function LogMethod() {
  return LoggingInterceptor;
}

export function LogAllMethods(target: any) {
  const originalConstructor = target;

  // Iterate through the class prototype's methods and apply the method decorator
  for (const methodName of Object.getOwnPropertyNames(target.prototype)) {
    const descriptor = Object.getOwnPropertyDescriptor(
      target.prototype,
      methodName,
    );

    if (descriptor && typeof descriptor.value === "function") {
      Object.defineProperty(
        target.prototype,
        methodName,
        LoggingInterceptor(target, methodName, descriptor, {
          service: target.name,
        }),
      );
    }
  }

  return originalConstructor;
}
