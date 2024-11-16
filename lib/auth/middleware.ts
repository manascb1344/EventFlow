import { z } from 'zod';
import { users } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { InferModel } from 'drizzle-orm';

export type ActionState = {
  error?: string;
  success?: string;
  [key: string]: any;
};

type ValidatedActionFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>
) => Promise<T>;

export function validatedAction<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ValidatedActionFunction<S, T>
) {
  return async (data: any): Promise<T> => {
    try {
      const result = schema.safeParse(data);
      if (!result.success) {
        return { error: result.error.errors[0].message } as T;
      }

      const actionResult = await action(result.data);
      return actionResult;
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'An error occurred' } as T;
    }
  };
}

type ValidatedActionWithUserFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>,
  user: InferModel<typeof users>
) => Promise<T>;

export function validatedActionWithUser<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ValidatedActionWithUserFunction<S, T>
) {
  return async (data: any): Promise<T> => {
    try {
      const user = await getUser();
      if (!user) {
        return { error: 'User is not authenticated' } as T;
      }

      const result = schema.safeParse(data);
      if (!result.success) {
        return { error: result.error.errors[0].message } as T;
      }

      const actionResult = await action(result.data, user);
      return actionResult;
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'An error occurred' } as T;
    }
  };
}
